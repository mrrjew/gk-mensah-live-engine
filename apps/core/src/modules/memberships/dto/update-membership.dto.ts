import { PartialType } from '@nestjs/graphql';
import { CreateMembershipDto } from './create-membership.dto';

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {
  id: string;
}
