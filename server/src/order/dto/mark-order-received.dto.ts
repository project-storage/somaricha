import { ApiProperty } from '@nestjs/swagger';

export class MarkOrderReceivedDto {
  @ApiProperty({ description: 'Comment star rating (1-5)', example: 5, required: false })
  comemnt_star?: number;
}