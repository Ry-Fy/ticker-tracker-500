import * as express from "express";
import * as path from "path";
import TickerApiHandler from "./handlers/tickerApiHandler";
import ViewHandler from "./handlers/viewHandler";
import { DataSourceType } from "./constants/dataSourceType";


export default class Server {
	private app: express.Application;
	private port: string;
	private viewHandler: ViewHandler;
	private tickerApiHandler: TickerApiHandler;

	constructor(dataSource: DataSourceType) {
		this.app = express();
		this.setPort();
		this.setStaticFolder();
		this.viewHandler = new ViewHandler(this.app);
		this.viewHandler.registerRoutes();
		this.tickerApiHandler = new TickerApiHandler(this.app, dataSource);
		this.tickerApiHandler.registerRoutes();
	}

	start(): void {
		this.app.listen(this.port, () => {
			console.log(`Ticker Tracker has begun listeing on port ${this.port}`);
		});
	}

	private setPort(): void {
		this.port = process.env.PORT || "8080";
	}

	private setStaticFolder(): void {
		const projectRoot = path.join(__dirname, "..");
		this.app.use(express.static(path.join(projectRoot, "dist", "static")));
	}
}

const server = new Server(DataSourceType.Yahoo);
server.start();