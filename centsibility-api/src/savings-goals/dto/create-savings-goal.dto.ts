import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

/**
 * Body for creating a goal. The saved amount starts at 0 and the status at Active, so they are not sent.
 */
export class CreateSavingsGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'goalName is required.' })
  @MaxLength(100, { message: 'goalName must be at most 100 characters.' })
  goalName: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'targetAmount must be a number with up to 2 decimal places.' })
  @IsPositive({ message: 'targetAmount must be greater than 0.' })
  @Max(99999999.99, { message: 'targetAmount is too large.' })
  targetAmount: number;

  @IsOptional()
  @IsDateOnly()
  targetDate?: string;
}
