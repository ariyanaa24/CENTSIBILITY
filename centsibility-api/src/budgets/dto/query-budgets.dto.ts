import { IsOptional } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

/**
 * Optional query string: ?budgetMonth=2026-11-01.
 */
export class QueryBudgetsDto {
  @IsOptional()
  @IsDateOnly()
  budgetMonth?: string;
}
