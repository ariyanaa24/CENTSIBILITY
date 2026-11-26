import { IsInt, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

// PATCH: only the limit and the alert percentage can change
export class UpdateBudgetDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'monthlyLimit must be a number with up to 2 decimal places.' })
  @IsPositive({ message: 'monthlyLimit must be greater than 0.' })
  @Max(99999999.99, { message: 'monthlyLimit is too large.' })
  monthlyLimit?: number;

  @IsOptional()
  @IsInt({ message: 'alertThreshold must be a whole number.' })
  @Min(1, { message: 'alertThreshold must be between 1 and 100.' })
  @Max(100, { message: 'alertThreshold must be between 1 and 100.' })
  alertThreshold?: number;
}
