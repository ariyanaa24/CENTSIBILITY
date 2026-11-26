import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

export class CreateTransactionDto {
  @IsInt({ message: 'categoryId must be a whole number.' })
  categoryId: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must be a number with up to 2 decimal places.' })
  @IsPositive({ message: 'amount must be greater than 0.' })
  @Max(99999999.99, { message: 'amount is too large.' })
  amount: number;

  @IsDateOnly()
  transactionDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'description must be at most 255 characters.' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'receiptImagePath must be at most 255 characters.' })
  receiptImagePath?: string;
}
