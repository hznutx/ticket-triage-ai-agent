import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsISO8601,
  Matches,
  IsDefined,
  IsObject,
  IsIn,
  IsInt,
  Min,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TicketMessageDto {
  @ApiProperty({ example: '2026-11-17T10:00:00.000Z', format: 'date-time' })
  @IsISO8601({ strict: true })
  @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/)
  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @ApiProperty({
    example:
      "My payment failed when I tried to upgrade to Pro. Can you check what's wrong?",
  })
  @IsString()
  @IsNotEmpty()
  user_detail: string;
}

export class CustomerInfoDto {
  @ApiProperty({ enum: ['Free', 'Pro', 'Enterprise'], example: 'Free' })
  @IsIn(['Free', 'Pro', 'Enterprise'])
  planType: 'Free' | 'Pro' | 'Enterprise';

  @ApiPropertyOptional({
    example: 'demo-billing',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  id?: string | null;

  @ApiPropertyOptional({
    example: 'Demo Customer',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  userName?: string | null;

  @ApiPropertyOptional({ example: 'Thailand', type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  region?: string | null;

  @ApiPropertyOptional({
    example: 'First support contact',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;

  @ApiPropertyOptional({
    example: 45,
    type: Number,
    nullable: true,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number | null;

  @ApiPropertyOptional({ example: 4, type: Number, nullable: true, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  tenureMonths?: number | null;
}

export class TriageRequestDto {
  @ApiProperty({ type: CustomerInfoDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer_info: CustomerInfoDto;

  @ApiProperty({
    type: [TicketMessageDto],
    example: [
      {
        updatedAt: '2026-11-18T16:52:34.094Z',
        user_detail:
          "My payment failed when I tried to upgrade to Pro. Can you check what's wrong?",
      },
      {
        updatedAt: '2026-11-18T17:52:34.094Z',
        user_detail:
          "I have THREE charges of $29.99 now and I still don't have Pro access. I need this fixed NOW.",
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketMessageDto)
  messages: TicketMessageDto[];
}
