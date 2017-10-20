import { ITicker as Ticker } from "../../shared/ticker";

export interface TickerTrackerState {
	tickers: Array<Ticker>,
	searchText: string,
	loading: boolean
}