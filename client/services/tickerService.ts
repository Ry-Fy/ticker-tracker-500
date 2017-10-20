import api from "../../shared/api";
import { ITicker as Ticker } from "../../shared/ticker";

export default class TickerService {
	static async getAll(): Promise<Array<Ticker>> {
		const response = await fetch(api.tickers.getAll);
		const data = await response.json();
		return data.tickers;
	}

	static async getFiltered(filter: string): Promise<Array<Ticker>> {
		if (filter == null) return new Array<Ticker>();
		const response = await fetch(api.tickers.getFiltered(filter));
		const data = await response.json();
		return data.tickers;
	}}