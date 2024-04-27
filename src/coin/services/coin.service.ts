import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Coin } from "../entities/coin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateCoinDto } from "../dto/update-coin.dto";
import { CoinNotFoundException } from "../exceptions/coin-not-found.exception";
@Injectable()
export class CoinService {
    constructor(
        @InjectRepository(Coin)
        private readonly coinRepository: Repository<Coin>
    ) {}

    async getCoinById(coinId: string): Promise<Coin> {
        const coin = await this.coinRepository.findOne({
            where: {
                id: coinId
            }
        });

        if (!coin)
            throw new CoinNotFoundException("Coin not found!");

        return coin;
    }

    async getCoinsList(): Promise<Coin[]> {
        return this.coinRepository
            .find();
    }

    async updateCoinsList(coinsList: UpdateCoinDto[]): Promise<void> {
        await this.coinRepository.save(coinsList);
    }
}