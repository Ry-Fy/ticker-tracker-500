import { ITicker as Ticker } from "../../shared/ticker";

export interface ITickerDataSource {
	getAll(): Promise<Array<Ticker>>; 
	getFiltered(filter: string): Promise<Array<Ticker>>;
}