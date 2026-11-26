import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

// PATCH: every field is optional
export class UpdateSavingsGoalDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'goalName must not be empty.' })
  @MaxLength(100, { message: 'goalName must be at most 100 characters.' })
  goalName?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'targetAmount must be a number with up to 2 decimal places.' })
  @IsPositive({ message: 'targetAmount must be greater than 0.' })
  @Max(99999999.99, { message: 'targetAmount is too large.' })
  targetAmount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'currentAmount must be a number with up to 2 decimal places.' })
  @Min(0, { message: 'currentAmount must be 0 or more.' })
  @Max(99999999.99, { message: 'currentAmount is too large.' })
  currentAmount?: number;

  @IsOptional()
  @IsDateOnly()
  targetDate?: string;

  @IsOptional()
  @IsIn(['Active', 'Completed', 'Cancelled'], { message: "status must be 'Active', 'Completed', or 'Cancelled'." })
  status?: 'Active' | 'Completed' | 'Cancelled';
}
