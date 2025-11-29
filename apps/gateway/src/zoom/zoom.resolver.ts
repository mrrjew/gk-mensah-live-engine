import {
  Args,
  InputType,
  Field,
  Int,
  ObjectType,
  Resolver,
  Mutation,
  Query,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { AdminGuard } from './admin.guard';

@InputType()
class CreateMeetingInput {
  @Field({ nullable: true })
  topic?: string;

  @Field(() => Int, { nullable: true })
  type?: number;

  @Field({ nullable: true })
  start_time?: string;

  @Field({ nullable: true })
  start_url?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  timezone?: string;

  @Field(() => String, { nullable: true })
  settings?: any;
}

@ObjectType()
class ZoomMeeting {
  @Field()
  id: string;

  @Field({ nullable: true })
  topic?: string;

  @Field({ nullable: true })
  start_time?: string;

  @Field({ nullable: true })
  start_url?: string;

  @Field({ nullable: true })
  join_url?: string;

  @Field({ nullable: true })
  password?: string;
}

@Resolver(() => ZoomMeeting)
export class ZoomResolver {
  constructor(private readonly zoomService: ZoomService) {}

  @UseGuards(AdminGuard)
  @Mutation(() => ZoomMeeting, { name: 'createZoomMeeting' })
  async create(@Args('input') input: CreateMeetingInput): Promise<any> {
    try {
      const payload = {
        topic: input.topic || 'Live stream',
        type: input.type ?? 2,
        start_time: input.start_time,
        duration: input.duration ?? 60,
        timezone: input.timezone ?? 'UTC',
        settings: input.settings ?? { join_before_host: false },
      };

      const res = await this.zoomService.createMeeting(payload);
      return res;
    } catch (error) {
      throw new Error(`Failed to create Zoom meeting: ${error.message}`);
    }
  }

  @Query(() => ZoomMeeting, { name: 'zoomMeeting', nullable: true })
  async getActive() {
    const meeting = await this.zoomService.getActiveMeeting();
    return meeting ?? null;
  }

  @UseGuards(AdminGuard)
  @Query(() => ZoomMeeting, { name: 'adminZoomMeeting', nullable: true })
  async adminZoomMeeting(@Args('zoomId') zoomId: string) {
    const meeting = await this.zoomService.getMeetingByZoomId(zoomId);
    return meeting ?? null;
  }
}
