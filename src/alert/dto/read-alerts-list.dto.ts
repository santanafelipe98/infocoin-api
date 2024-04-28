import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class ReadAlertsListDto {
    @IsNotEmpty()
    @IsOptional()
    userId?: string;

    @IsNotEmpty()
    @IsOptional()
    coinId?: number;

    @IsBoolean()
    @IsOptional()
    @Transform(({ obj, key }) => {
       if (obj[key] === 'true' || obj[key] === '1')
            return true;
       else if (obj[key] === 'false' || obj[key] === '0')
            return false;
       else
            return obj[key];
    })
    isActive?: boolean;
}