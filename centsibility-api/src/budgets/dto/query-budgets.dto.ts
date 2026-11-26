import { IsOptional } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';

export class QueryBudgetsDto {
  @IsOptional()
  @IsDateOnly()
  budgetMonth?: string;
}
