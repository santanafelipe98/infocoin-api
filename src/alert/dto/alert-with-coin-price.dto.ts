import { CoinPriceDto } from "../../coin/dto/coin-price.dto";
import { Alert } from "../entities/alert.entity";

export class AlertAndCoinPriceDto {
    coinPrice: CoinPriceDto;
    alert: Alert;
}