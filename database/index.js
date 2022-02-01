const net = require("net");
var productData = require('./data/products.json');
var sellersData = require('./data/sellers.json');
var sellersProductsData = require('./data/seller_products.json');
var cart = [];

const serverInstance = net.createServer(function(client) {
	client.setEncoding('utf-8');
    // When receive client data.
    client.on('data', function (request) {
		const req = JSON.parse(request);
		console.log(`New Data request ${req.msgId} ${req.dataId}`);
        if (req.msgId === 'UPDATE_DATA') {
			switch(req.dataId) {
				case "products":
					productData = req.newData;
					break;
				case "sellers":
					sellersData = req.newData;
					break;
				case "sellers_products":
					sellersProductsData = req.newData;
					break;
				case "cart":
					cart = req.newData
					break;
			}
		} else if (req.msgId === 'GET_DATA') {
			switch(req.dataId) {
				case "products":
					client.write(JSON.stringify(productData));
					break;
				case "sellers":
					client.write(JSON.stringify(sellersData));
					break;
				case "sellers_products":
					client.write(JSON.stringify(sellersProductsData));
					break;
				case "cart":
					client.write(JSON.stringify(cart));
					break;
			}
		}
    });
    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.');
    });
    // When client timeout.
    client.on('timeout', function () {
        // console.log('Client request time out. ');
    });
	client.on("error", function(err) {
		console.log(err.message);
	});
});

const start = () => {
	serverInstance.listen(9000, function () {
		// Get server address info.
		var serverInfo = serverInstance.address();
		var serverInfoJson = JSON.stringify(serverInfo);
		console.log('TCP server listen on address : ' + serverInfoJson);
		serverInstance.on('close', function () {
			console.log('TCP server socket is closed.');
		});
		serverInstance.on('error', function (error) {
			console.error(JSON.stringify(error));
		});
	});
}

start()