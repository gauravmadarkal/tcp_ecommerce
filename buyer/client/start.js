const net = require('net');
const { getSearchItemsMSG, addItemToCartMSG, removeItemFromCartMSG, getClearCartMSG, getDisplayCartMSG } = require('../messages');
const readline = require('readline');
const details = require('../hostDetails');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const printOptions = (clientConnection) => {
	rl.question(`
		1. Search items for sale\n
		2. Add item to cart\n
		3. Remove item from cart\n
		4. Clear cart
		5. Display cart\n`, 
		function (option) {
			switch(option) {
				case "1":
					rl.question(`Enter a Category and upto 5 keywords \n
						separated by semicolon, Category;keyword1,keyword2,keyword3 etc..\n`, function (details) {
						const input = details.split(";");
						const category = input[0];
						const keywords = [];
						for (let i=1; i < input.length; i++) {
							if (input[i].length > 0) {
								keywords.push(input[i]);
							}
						}
						clientConnection.write(JSON.stringify(getSearchItemsMSG({ category, keywords })))
					});
					break;
				case "2":
					rl.question(`Enter ItemId and Quantity seperated by semicolon. \n
					ItemId;Quantity\n`, function (details) {
						const input = details.split(";");
						clientConnection.write(JSON.stringify(addItemToCartMSG({ itemId: input[0], quantity: input[1] })))
					});
					break;
				case "3":
					rl.question(`Enter ItemId and quantity \n
					ItemId;Quantity\n`, function (details) {
						const input = details.split(";");
						clientConnection.write(JSON.stringify(removeItemFromCartMSG({ itemId: input[0], quantity: input[1] })))
					});
					break;
				case "4":
					clientConnection.write(JSON.stringify(getClearCartMSG()))
					break;
				default:
					clientConnection.write(JSON.stringify(getDisplayCartMSG()));
					break;
			}
		}
	);
};

const handleResponse = (res, client) => {
	switch(res.msgId) {
		case "DISPLAY_CART":
		case "SEARCH_ITEMS":
			console.log(res.data);
			break;
		case "REQUEST_COMPLETED":
			console.log('-----------REQUEST COMPLETED-----------')
			break;
	}
	printOptions(client);
}

function getConnection(connName){
    const option = {
        host: details.buyer.host,
        port: details.buyer.port
    }
    const client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });
    client.setEncoding('utf8');
    client.on('data', function (response) {
        // console.log('Server return data : ' + response);
		res = JSON.parse(response)
		handleResponse(res, client);
    });
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });
    client.on('timeout', function () {
        // console.log('Client connection timeout. ');
    });
    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });
    return client;
}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

const start = async () => {
	const clientConnection = getConnection('clientConnection');
	await sleep(2000);
	printOptions(clientConnection)
}

module.exports = start;