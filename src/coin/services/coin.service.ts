import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Coin } from "../entities/coin.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CoinService {
    constructor(
        @InjectRepository(Coin)
        private readonly coinRepository: Repository<Coin>
    ) {}

    async getCoinsList(): Promise<Coin[]> {
        return this.coinRepository
            .find();
    }
}