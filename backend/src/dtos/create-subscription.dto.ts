import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  userId: string;

  @IsString()
  membershipId: string;

  @IsString()
  card_token_id: string;
}
