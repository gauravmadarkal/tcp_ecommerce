const readline = require('readline');
const startServer = require("./server/start");
const startClient = require("./client/start");

console.log("Application started");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('1. start buyer client, 2. start buyer server, 3. exit \n ', function (option) {
	if (option === "1") {
		startClient();
	} else if (option === "2") {
		startServer();
	} else {
		console.log("incorrect option");
		process.exit(0);
	}
});