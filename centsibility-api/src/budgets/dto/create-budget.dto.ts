import { IsInt, IsNumber, IsOptional, IsPositive, Matches, Max, Min } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

/**
 * Body for setting a budget. alertThreshold is optional (default 80).
 */
export class CreateBudgetDto {
  @IsInt({ message: 'categoryId must be a whole number.' })
  categoryId: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'monthlyLimit must be a number with up to 2 decimal places.' })
  @IsPositive({ message: 'monthlyLimit must be greater than 0.' })
  @Max(99999999.99, { message: 'monthlyLimit is too large.' })
  monthlyLimit: number;

  @IsDateOnly()
  // budgetMonth must be the first day of a month, for example 2026-11-01.
  @Matches(/^\d{4}-\d{2}-01$/, { message: 'budgetMonth must be the first day of the month (YYYY-MM-01).' })
  budgetMonth: string;

  @IsOptional()
  @IsInt({ message: 'alertThreshold must be a whole number.' })
  @Min(1, { message: 'alertThreshold must be between 1 and 100.' })
  @Max(100, { message: 'alertThreshold must be between 1 and 100.' })
  alertThreshold?: number;
}
