import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * The ?page= and ?limit= query parameters, shared by every list that is paginated.
 */
export class PaginationDto {
  // Optional: when the client does not send it, the default below is used (page 1, 10 items).
  @IsOptional()
  // Query strings are text, so convert to a number before validating.
  @Type(() => Number)
  @IsInt({ message: 'page must be a whole number.' })
  @Min(1, { message: 'page must be 1 or more.' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number.' })
  @Min(1, { message: 'limit must be between 1 and 100.' })
  @Max(100, { message: 'limit must be between 1 and 100.' })
  limit: number = 10;
}
