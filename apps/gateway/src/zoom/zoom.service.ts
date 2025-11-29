import { Injectable, Logger, Inject } from '@nestjs/common';
import axios from 'axios';
import { DrizzleService } from '@app/lib/core/drizzle';
import { zoomMeetings } from './zoom.entities';
import { desc, eq } from 'drizzle-orm';

interface TokenCache {
  accessToken: string | null;
  expiresAt: number;
}

@Injectable()
export class ZoomService {
  private readonly logger = new Logger(ZoomService.name);
  private tokenCache: TokenCache = { accessToken: null, expiresAt: 0 };

  constructor(private db: DrizzleService) {}

  private getClientCredentials() {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const userId = process.env.ZOOM_USER_ID || 'me';

    if (!clientId || !clientSecret) {
      throw new Error(
        'ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET must be set in env',
      );
    }

    return { clientId, clientSecret, accountId, userId };
  }

  private async fetchAccessToken() {
    try {
      const { clientId, clientSecret, accountId } = this.getClientCredentials();

      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );
      const url = `https://zoom.us/oauth/token?grant_type=account_credentials${accountId ? `&account_id=${accountId}` : ''}`;

      this.logger.debug('Requesting Zoom access token');

      const resp = await axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Basic ${basic}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .catch((error) => {
          this.logger.error(
            'Error response from Zoom token endpoint:',
            error.response?.data || error.message,
          );
          throw error;
        });

      const data = resp.data as { access_token: string; expires_in: number };
      if (!data || !data.access_token) {
        throw new Error('Failed to obtain Zoom access token');
      }

      const now = Date.now();
      this.tokenCache = {
        accessToken: data.access_token,
        expiresAt: now + (data.expires_in - 30) * 1000,
      };

      return this.tokenCache.accessToken;
    } catch (error) {
      this.logger.error('Error fetching Zoom access token:', error);
      throw error;
    }
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.tokenCache.accessToken && now < this.tokenCache.expiresAt) {
      return this.tokenCache.accessToken;
    }

    return this.fetchAccessToken();
  }

  async createMeeting(payload: any) {
    const { userId } = this.getClientCredentials();
    const token = await this.getAccessToken();

    const url = `https://api.zoom.us/v2/users/${encodeURIComponent(userId)}/meetings`;
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const meeting = res.data;
    // Persist meeting to database
    try {
      await this.db.db.insert(zoomMeetings).values({
        id: `zoom_${Date.now()}`,
        zoomId: String(meeting.id),
        topic: meeting.topic,
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url,
        password: meeting.password,
        startTime: meeting.start_time ? new Date(meeting.start_time) : null,
      });
      this.logger.log(`Meeting persisted to DB (zoom_id=${meeting.id})`);
    } catch (err: any) {
      this.logger.error('Failed to persist meeting to DB', err?.message);
    }

    return meeting;
  }

  async getActiveMeeting() {
    try {
      // Fetch the most recently created meeting from DB
      const result = await this.db.db
        .select()
        .from(zoomMeetings)
        .orderBy(desc(zoomMeetings.createdAt))
        .limit(1);

      console.log('Active meeting fetch result:', result);

      if (result.length === 0) {
        return null;
      }

      const meeting = result[0];
      return {
        id: meeting.zoomId,
        topic: meeting.topic,
        join_url: meeting.joinUrl,
        start_url: meeting.startUrl,
        password: meeting.password,
        start_time: meeting.startTime,
      };
    } catch (err: any) {
      this.logger.error('Failed to fetch active meeting from DB', err?.message);
      return null;
    }
  }

  async getMeetingByZoomId(zoomId: string) {
    try {
      const result = await this.db.db
        .select()
        .from(zoomMeetings)
        .where(eq(zoomMeetings.zoomId, zoomId))
        .limit(1);

      if (!result || result.length === 0) return null;
      const meeting = result[0];
      return {
        id: meeting.zoomId,
        topic: meeting.topic,
        join_url: meeting.joinUrl,
        start_url: meeting.startUrl,
        password: meeting.password,
        start_time: meeting.startTime,
      };
    } catch (err: any) {
      this.logger.error('Failed to fetch meeting by zoomId', err?.message);
      return null;
    }
  }
}
