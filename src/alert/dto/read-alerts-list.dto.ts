import { IsBoolean, IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class ReadAlertsListDto {
    @IsNotEmpty()
    @IsOptional()
    userId?: string;

    @IsNotEmpty()
    @IsOptional()
    coinId?: number;

    @IsNotEmpty()
    @IsOptional()
    isActive?: boolean;
}