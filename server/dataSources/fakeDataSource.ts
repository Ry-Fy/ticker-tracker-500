import { ITickerDataSource } from "../interfaces/ITickerDataSource";
import { ITicker as Ticker } from "../../shared/ticker";

export default class FakeDataSource implements ITickerDataSource {
	getAll = async (): Promise<Array<Ticker>> => {
		const tickers = await this.getFakeTickers(500);
		return tickers;
	}

	getFiltered = async (filter: string): Promise<Array<Ticker>> => {
		throw new Error("Method not implemented.");
	}

	private getFakeTickers = (count: number): Array<Ticker> => {
		const fakeTickers = new Array<Ticker>();
		for (let i = 0; i < count; i++) {
			let fakeTicker = {
				name: this.getFakeName(),
				symbol: this.getFakeSymbol(),
				price: this.getRandomFloat(5.0, 500.00),
				dayGain: this.getRandomInt(0, 10) % 2 === 0 ? this.getRandomFloat(0.0, 3.0) : -this.getRandomFloat(0.0, 4.0)
			} as Ticker;
			fakeTicker.dayGainPct = (fakeTicker.dayGain / fakeTicker.price) * 100;

			fakeTickers.push(fakeTicker);
		}
		return fakeTickers;
	}

	private getFakeSymbol = (): string => {
		let symbol = "";
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (let i = 0; i < this.getRandomInt(3, 5); i++) {
			symbol += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return symbol;
	}

	private getFakeName = (): string => {
		let name = "";
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz       ";
		for (var i = 0; i < this.getRandomInt(10, 50); i++) {
			name += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return name;
	}

	private getRandomInt = (min: number, max: number): number => {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	private getRandomFloat = (min: number, max: number): number => {
		return Math.random() * (max - min) + min;
	}
}