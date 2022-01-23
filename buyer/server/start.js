const net = require('net');
const { getDisplayCartResponseMSG, getSearchItemsResponseMSG, getRequestCompletedMSG } = require('../messages');
const { getData, updateData } = require('./data');
const details = require('../hostDetails');

const handleRequests = async (req, client) => {
	switch(req.msgId) {
		case "DISPLAY_CART":
			const cart = await getData('cart');
			client.write(JSON.stringify(getDisplayCartResponseMSG(cart)));
			break;
		case "SEARCH_ITEMS":
			const { category, keywords } = req.data;
			const products = await getData('products');
			const filteredProducts = products.filter(p => p.itemCategory === category && (keywords.length === 0 || keywords.filter(k => p.keywords.indexOf(k.toLowerCase()) !== -1).length > 0))
			client.write(JSON.stringify(getSearchItemsResponseMSG(filteredProducts)));
			break;
		case "ADD_TO_CART":
			const { itemId, quantity } = req.data;
			const newCart = await getData('cart');
			newCart.push({ itemId, quantity });
			await updateData('cart', newCart);
			client.write(JSON.stringify(getRequestCompletedMSG("ADD_TO_CART")));
			break;
		case "REMOVE_FROM_CART":
			const { itemId: iId, quantity: q } = req.data;
			var oldCart = await getData('cart');
			const index = oldCart.findIndex(i => i.itemId === iId);
			if (oldCart[index].quantity > q) {
				oldCart[index].quantity -= q;
			} else {
				oldCart = oldCart.filter(o => o.itemId !== iId);
			}
			await updateData('cart', oldCart);
			client.write(JSON.stringify(getRequestCompletedMSG("REMOVE_FROM_CART")));
			break;
		case "CLEAR_CART":
			await updateData('cart', []);
			client.write(JSON.stringify(getRequestCompletedMSG("CLEAR_CART")));
			break;
	}
}

const serverInstance = net.createServer(function(client) {
	console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
    client.setEncoding('utf-8');
    client.setTimeout(1000);
    // When receive client data.
    client.on('data', function (data) {
        console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);
		const req = JSON.parse(data);
		handleRequests(req, client);
    });
    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.');
        // Get current connections count.
        serverInstance.getConnections(function (err, count) {
            if(!err) {
				// Print current connection count in server console.
				console.log("There are %d connections now. ", count);
            } else {
                console.error(JSON.stringify(err));
            }
        });
    });
    // When client timeout.
    client.on('timeout', function () {
        // console.log('Client request time out. ');
    });
});

const start = () => {
	serverInstance.listen(details.buyer.port, function () {
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

module.exports = start;