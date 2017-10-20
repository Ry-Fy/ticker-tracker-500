const nodeExternals = require("webpack-node-externals");
const path = require("path");
module.exports = {
	target: "node",
	entry: {
		"server": path.join(__dirname, "server", "server.ts")
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "server.js"
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
		]
	},
	node: {
		__dirname: true
	}
}