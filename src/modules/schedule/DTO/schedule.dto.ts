import { IsDateString, IsOptional, IsString, Length } from "class-validator";
import { CompareDate } from "../../../common/decorators/compareDate.decorator";

export class CreateScheduleDTO {
    @IsDateString()
    startedAt: string;
  
    @CompareDate('startedAt', {
      message: 'endedAt must be larger than startedAt'
    })
    @IsDateString()
    endedAt: string;

    @IsString()
    @Length(1, 100)
    title: string;

    @IsString()
    @IsOptional()
    description: string;    
}

export class UpdateScheduleDTO {
  @IsDateString()
  @IsOptional()
  startedAt: string;

  @CompareDate('startedAt', {
    message: 'endedAt must be larger than startedAt'
  })
  @IsDateString()
  @IsOptional()
  endedAt: string;

  @IsString()
  @Length(1, 100)
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;    
}