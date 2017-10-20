const path = require("path");
module.exports = {
	entry: {
		"client": path.join(__dirname, "client", "app.tsx")
	},
	output: {
		filename: "client.js",
		path: __dirname + "/dist/static"
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
		]
	},
}