const net = require('net');
const { GET_SELLER_MSG, putItemForSaleMSG, displayItemsForSellerMSG, changeSalePriceMSG, removeItemFromSaleMSG } = require('../messages');
const readline = require('readline');
const details = require('../hostDetails');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const printOptions = async (clientConnection, sellers, sid) => {
	const printMainOptions = (sellerId) => {
		rl.question(`
			1. Put an item for sale\n
			2. Change the sale price of an item\n
			3. Remove an item from sale\n
			4. Display items currently on sale put up by this seller\n`, 
			function (option) {
				switch(option) {
					case "1":
						rl.question(`Enter item details seperated by semicolon.
						ItemName;ItemCategory;keywords;condition;SalePrice;Quantity\n`, function (details) {
							const ans = details.split(';')
							const itemDetails = {}
							itemDetails.itemName = ans[0];
							itemDetails.itemCategory = ans[1];
							itemDetails.keywords = ans[2].indexOf(',') > 0 ? ans[2].split(',') : ans[2];
							itemDetails.condition = ans[3]
							itemDetails.salePrice = ans[4];
							itemDetails.quantity = ans[5];
							if (clientConnection) {
								clientConnection.write(JSON.stringify(putItemForSaleMSG(itemDetails, sellerId)));
							} else {
								console.log('client connection is empty');
							}
						});
						break;
					case "2":
						rl.question(`Enter item id and new sale price seperated by semicolon.
						ItemId;NewSalePrice\n`, function (details) {
							const data = {
								itemId: details.split(';')[0],
								newSalePrice: details.split(';')[1]
							};
							clientConnection.write(JSON.stringify(changeSalePriceMSG(sellerId, data)));
						});
						break;
					case "3":
						rl.question(`Enter item id and quantity seperated by semicolon.
						ItemId;Quantity\n`, function (details) {
							const data = {
								itemId: details.split(';')[0],
								quantity: details.split(';')[1]
							};
							clientConnection.write(JSON.stringify(removeItemFromSaleMSG(sellerId, data)));
						});
						break;
					default:
						clientConnection.write(JSON.stringify(displayItemsForSellerMSG(sellerId)));
						break;
				}
			}
		);
	}
	const sellerDetails = sellers?.map(s => { return { sellerName: s.sellerName, sellerId: s.sellerId } });
	if (sid === undefined || sid === "" || sid === null) {
		rl.question(`Select the seller id ${JSON.stringify(sellerDetails)} \n`, function (id) {
			printMainOptions(id);
		});
	} else {
		printMainOptions(sid);
	}

}

const handleResponse = (client, res) => {
	switch(res.msgId) {
		case "DISPLAY_ITEMS_FOR_SELLER":
			console.log(res.data);
			printOptions(client, null, res.sellerId);
			console.log(`Time for completion: ${Date.now() - res.timestamp}ms`);
	}
}

function getConnection(connName){
    const option = {
        host: details.seller.host,
        port: details.seller.port
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
		if (res.msgId === 'GET_SELLERS') {
			printOptions(client, res.data);
		} else if (res.msgId === 'REQUEST_COMPLETED') {
			console.log("---------------REQUEST COMPLETED---------------");
			console.log(`Time for completion: ${Date.now() - res.timestamp}ms`);
			printOptions(client, res.data);
		} else if (res.msgId === 'SERVER_MSG') {
			console.log("-----------RECEIVED MSG FROM SERVER-------------");
			console.log(res.message);
		} else {
			handleResponse(client, res);
		}
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

const start = () => {
	const clientConnection = getConnection('clientConnection');
	clientConnection.write(JSON.stringify(GET_SELLER_MSG));
}

module.exports = start;