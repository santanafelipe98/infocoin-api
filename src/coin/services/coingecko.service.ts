import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CoinGeckoCoinDto } from "../dto/coingecko-coin.dto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { CoinGeckoCoinPriceDto } from "../dto/coingecko-coin-price.dto";
import { CoinGeckoReadCoinPriceDto } from "../dto/coingecko-read-coin-price.dto";

@Injectable()
export class CoinGeckoService {
    private readonly logger = new Logger(CoinGeckoService.name);

    constructor(private readonly httpService: HttpService) {}

    async getCoinsList(): Promise<CoinGeckoCoinDto[]> {
        const endpointPath = '/coins/list';
        const { data } = await firstValueFrom(
            this.httpService.get<CoinGeckoCoinDto[]>(endpointPath).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);

                    throw new BadRequestException("Falha ao obter lista de criptomoedas - CoinGecko!");
                })
            )
        );

        return data;
    }

    async getCoinPriceByIds(dto: CoinGeckoReadCoinPriceDto): Promise<CoinGeckoCoinPriceDto> {
        const endpointPath = '/simple/price';

        console.log(dto);

        const { data } = await firstValueFrom(
            this.httpService.get<CoinGeckoCoinPriceDto>(endpointPath, {
                params: dto
            }).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);

                    throw new BadRequestException("Falha ao obter preço de criptomoedas - CoinGecko!");
                })
            )
        )

        return data;
    }
 }