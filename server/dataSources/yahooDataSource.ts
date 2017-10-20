import fetch from "node-fetch";
import { ITickerDataSource } from "../interfaces/ITickerDataSource";
import { ITicker as Ticker } from "../../shared/ticker";
import { sp500symbols } from "../constants/sp500symbols";
import { YahooQuote } from "../interfaces/yahooQuoteObject";

export default class YahooDataSource implements ITickerDataSource {
	private yahooPathBase = "https://query.yahooapis.com/v1/public/yql?q=";
	
	getAll = async (): Promise<Ticker[]> => {
		try {
			const query = this.getAllTickersQuery();
			const options = "&format=json&env=store://datatables.org/alltableswithkeys";
			const requestUrl = this.yahooPathBase + encodeURI(query + options);
			const response = await fetch(requestUrl);
			const json = await response.json();
			const quotes = json.query.results.quote as Array<YahooQuote>;
			return this.mapYahooQuotesToTickers(quotes);
		} catch (error) {
			console.log(`There was a problem with getAll in the Yahoo Data Source.`);
			console.log(`Error text: ${error}`);
			return new Array<Ticker>();
		}
	}

	getFiltered = async (filter: string): Promise<Ticker[]> => {
		if (filter === "") return this.getAll();
		
		const matchingSymbols = this.getSymbolsMatchingFilter(sp500symbols, filter);
		if (matchingSymbols.length === 0) return new Array<Ticker>();

		try {
			const query = this.getFilteredTickersQuery(matchingSymbols);
			const options = "&format=json&env=store://datatables.org/alltableswithkeys";
			const requestUrl = this.yahooPathBase + encodeURI(query + options);
			const response = await fetch(requestUrl);
			const json = await response.json();
			const quotes = await (json.query.count > 1 
				? json.query.results.quote 
				: [json.query.results.quote]) as Array<YahooQuote>;
			return this.mapYahooQuotesToTickers(quotes);
		} catch (error) {
			console.log(`There was a problem with getFiltered in the Yahoo Data Source for filter=${filter}.`);
			console.log(`Error text: ${error}`);
			return new Array<Ticker>();
		}
	}

	private getAllTickersQuery = (): string => {
		const query = `
select
	Change,
	ChangeinPercent,
	Name,
	symbol,
	LastTradePriceOnly
from
	yahoo.finance.quotes
where
	symbol in(${this.getSymbolsForQueryString(sp500symbols)})
| sort(field="symbol", descending="false")
		`
		return query;
	}

	private getFilteredTickersQuery = (matchingSymbols: Array<string>): string => {
		const query = `
select
	Change,
	ChangeinPercent,
	Name,
	symbol,
	LastTradePriceOnly
from
	yahoo.finance.quotes
where
	symbol in(${this.getSymbolsForQueryString(matchingSymbols)})
| sort(field="symbol", descending="false")
		`
		return query;
	}

	private getSymbolsForQueryString = (symbols: Array<string>): string => {
		let symbolString = "";
		for (let symbol of symbols) {
			symbolString += `"${symbol}"`;
			symbolString += symbols.lastIndexOf(symbol) === symbols.length - 1 ? "" : ",";
		}
		return symbolString;
	}

	private getSymbolsMatchingFilter = (symbols: Array<string>, filter: string): Array<string> => {
		return symbols.filter((symbol) => {
			return symbol.toUpperCase().startsWith(filter.toUpperCase())
		});
	}

	private mapYahooQuotesToTickers = (quotes: Array<YahooQuote>): Array<Ticker> =>{
		return quotes.map((quote: YahooQuote) => {
			const change = quote.Change != null
				? Number(quote.Change.slice(1)) * (quote.Change.charAt(0) === "-" ? -1 : 1)
				: 0.0;
			const changePct = quote.ChangeinPercent != null
				? Number(quote.ChangeinPercent.slice(1, quote.ChangeinPercent.length - 1)) * (quote.ChangeinPercent.charAt(0) === "-" ? -1 : 1)
				: 0.0;
			const lastPrice = quote.LastTradePriceOnly != null
				? Number(quote.LastTradePriceOnly)
				: 0.0;
			return {
				dayGain: change,
				dayGainPct: changePct,
				name: quote.Name || "",
				price: lastPrice,
				symbol: quote.symbol || "",
			} as Ticker;
		});
	}
}