import * as authSchema from '../../../../apps/core/src/modules/users/entities';
import {Memberships} from '../../../../apps/core/src/modules/memberships/entities/memberships.entities';
import {Subscriptions} from '../../../../apps/core/src/modules/subscriptions/entities/subscriptions';
import * as paymentSchema from '../../../../apps/payment/src/entities';

export default {schema: [authSchema,Memberships,Subscriptions,paymentSchema],}