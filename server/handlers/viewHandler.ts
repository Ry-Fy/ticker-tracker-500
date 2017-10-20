import * as express from "express";
import * as path from "path";

export default class ViewHandler {
	constructor(private app: express.Application) { }

	index(request: express.Request, response: express.Response): void {
		response.sendfile(path.join("views", "index.html"));		
	}

	registerRoutes(): void {
		this.app.get("/", this.index);
	}
}