import * as express from "express";
import api from "../../shared/api";
import FakeDataSource from "../dataSources/fakeDataSource";
import YahooDataSource from "../dataSources/yahooDataSource";
import { DataSourceType } from "../constants/dataSourceType";
import { ITickerDataSource } from "../interfaces/ITickerDataSource";

export default class TickerApiHandler {
	private tickerDataSource: ITickerDataSource;
	private defaultSkip = 0;
	private defaultTake = 24;

	constructor(private app: express.Application, dataSourceType: DataSourceType) {
		this.tickerDataSource = this.resolveDataSource(dataSourceType);
	}
	
	getAll = async (request: express.Request, response: express.Response): Promise<void> => {
		const tickers = await this.tickerDataSource.getAll();
		response.json({tickers});		
	}

	getFiltered = async (request: express.Request, response: express.Response): Promise<void> => {
		const filter = request.query.f || "";
		const tickers = await this.tickerDataSource.getFiltered(filter);
		response.json({tickers});				
	}

	registerRoutes = (): void => {
		this.app.get(api.tickers.getAll, this.getAll);
		this.app.get(api.tickers.getFiltered(null), this.getFiltered);
	}

	private resolveDataSource = (dataSourceType: DataSourceType): ITickerDataSource => {
		let dataSource: ITickerDataSource;
		switch (dataSourceType) {
			case DataSourceType.Yahoo: {
				dataSource = new YahooDataSource();
				break;
			}
			default: {
				dataSource = new FakeDataSource();
			}
		}
		return dataSource;
	}
}
