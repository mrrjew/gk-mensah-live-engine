import * as authSchema from '../../../../apps/core/src/modules/users/entities';
import { Memberships } from '../../../../apps/core/src/modules/memberships/entities/memberships.entities';
import { Subscriptions } from '../../../../apps/core/src/modules/subscriptions/entities/subscriptions';
import * as paymentSchema from '../../../../apps/payment/src/entities';
import { zoomMeetings } from '../../../../apps/gateway/src/zoom/zoom.entities';

export default {
  schema: [authSchema, Memberships, Subscriptions, paymentSchema, zoomMeetings],
};
