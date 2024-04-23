import { IsNotEmpty, IsOptional } from "class-validator";

export class CoinGeckoReadCoinPriceDto {
    @IsNotEmpty()
    ids: string;

    @IsNotEmpty()
    vs_currencies: string;

    @IsOptional()
    include_market_cap?: boolean;

    @IsOptional()
    include_24hr_vol?: boolean;

    @IsOptional()
    include_24hr_change?: boolean;

    @IsOptional()
    include_last_updated_at?: boolean;

    @IsOptional()
    precision?: string;
}