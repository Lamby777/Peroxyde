const Express = require("express");
const request = require("request");
const stream = require("stream");
const ejs = require("ejs");
const app = new Express();
const port = 3040;
let timesUsed = 0;
let lastReset = new Date();

app.set("view engine", "ejs");
app.use(Express.static("src"));

function TransformStream(mods) {
	return stream.Transform({
		writableObjectMode: true,
		transform: mods
	});
}

function pipeToMod(piper, url) {
	let mod = new TransformStream(function(chunk, _, callback) {
		console.log(chunk);
		//let resrc = /src="[^"]+"/ig;
		let tsc = chunk.toString();
		callback(null, chunk.replace(/bruh/g));
	});
	return piper.pipe(mod);
}

app.listen(port, () => {
	console.log(`Proxy server running on port ${port}`);
});

app.get("/", (req, res) => {
	let bypass = req.query.s;
	if (bypass) {
		if (!(bypass.slice(0, 7) === "http://" || bypass.slice(0, 8) === "https://")) {
			bypass = "https://" + bypass;
			console.log("fixed big boi haxxor url");
		}
		pipeToMod(request(bypass), bypass).pipe(res); // Important
		timesUsed++;
	} else {
		res.render("home", { uses: timesUsed, lastReset: lastReset });
	}
	//res.end();
});