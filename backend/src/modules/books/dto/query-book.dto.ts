import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class QueryBooksDto {
    @IsOptional()
    @IsString()
    search?: string;
  
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number = 1;
  
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;
  
    @IsOptional()
    @IsString()
    sortBy?: string = 'title';
  
    @IsOptional()
    @IsString()
    order?: 'ASC' | 'DESC' = 'ASC';
  }