const fs = require("fs");
const gulp = require("gulp");
const gutil = require("gutil");
const path = require("path");
const webpack = require("webpack");

gulp.task("make-output-folder", () => {
	const outputFolder = path.join(__dirname, "dist");
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder);
	}
});

gulp.task("build-server", () => {
	const config = require('./webpack.config.server.js');
	webpack(config, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({}) );
	});
});

gulp.task("build-client", () => {
	const config = require('./webpack.config.client.js');
	webpack(config, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({}) );
	});
});

gulp.task("copy-views", () => {
	const viewFolder = path.join(__dirname, "views");
	const outputFolder = path.join(__dirname, "dist", "views");
	
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder);
	}

	const fileNames = fs
		.readdirSync(viewFolder)
		.filter((file) => { return file.endsWith(".html"); });

	for (let fileName of fileNames) {
		const inputFile = path.join(viewFolder, fileName);
		const outputFile = path.join(outputFolder, fileName);
		fs.createReadStream(inputFile).pipe(fs.createWriteStream(outputFile));
	}
});

gulp.task("copy-styles", () => {
	const styleFolder = path.join(__dirname, "styles");
	const outputFolder = path.join(__dirname, "dist", "static");
	
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder);
	}

	const fileNames = fs
		.readdirSync(styleFolder)
		.filter((file) => { return file.endsWith(".css"); });

	for (let fileName of fileNames) {
		const inputFile = path.join(styleFolder, fileName);
		const outputFile = path.join(outputFolder, fileName);
		fs.createReadStream(inputFile).pipe(fs.createWriteStream(outputFile));
	}
});


gulp.task("build", [
	"make-output-folder", 
	"build-server", 
	"build-client",
	"copy-styles", 
	"copy-views"
]);