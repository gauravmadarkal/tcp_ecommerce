const net = require('net');
const details = require('../hostDetails');
const { getSellersMSGResponse, displayItemsForSellerMSGResponse, getRequestCompletedMSG, getServerMessage } = require('../messages');
const { getData, updateData } = require('./data');

const handleRequests = async (req, client) => {
	const sellerId = req.sellerId;
	const productData = await getData('products');
	const sellersData = await getData('sellers');
	const sellersProductsData = await getData('sellers_products');
	switch(req.msgId) {
		case "DISPLAY_ITEMS_FOR_SELLER":
			const productIds = sellersProductsData[sellerId];
			const products = [];
			productIds.map(productId => {
				products.push(productData.filter(p => p.itemId === productId)[0])
				return productId;
			});
			client.write(JSON.stringify(displayItemsForSellerMSGResponse(sellerId, products)));
			break;
		case "PUT_ITEM_SALE":
			const item = req.item;
			const existingCount = productData.filter(p => p.itemCategory === item.itemCategory).length;
			const id = `${item.itemCategory.substr(0,1).toLowerCase()}${existingCount + 1}`;
			item.itemId = id;
			productData.push(item);
			sellersProductsData[sellerId].push(id);
			await updateData('products', productData);
			await updateData('sellers_products', sellersProductsData)
			client.write(JSON.stringify(getRequestCompletedMSG("PUT_ITEM_SALE", sellersData)))
			break;
		case "CHANGE_SALE_PRICE":
			console.log(req.data)
			const { itemId, newSalePrice } = req.data;
			const index = productData.findIndex(x => x.itemId === itemId);
			if (index !== -1) {
				productData[index].salePrice = newSalePrice;
				await updateData('products', productData);
				client.write(JSON.stringify(getRequestCompletedMSG("CHANGE_SALE_PRICE", sellersData)))
			} else {
				client.write(JSON.stringify(getServerMessage
					("product not found", sellersData)))
			}
			break;
		case "REMOVE_ITEM_FROM_SALE":
			const { itemId: iId, quantity } = req.data;
			const i = productData.findIndex(x => x.itemId === iId);
			if (i !== -1) {
				if (productData[i].quantity >= quantity) {
					productData[i].quantity -= quantity;
				} else {
					productData[i].quantity = 0;
				}
				await updateData('products', productData);
			}
			client.write(JSON.stringify(getRequestCompletedMSG("REMOVE_ITEM_FROM_SALE", sellersData)))
			break;
	}
}

const serverInstance = net.createServer(function(client) {
	console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
    client.setEncoding('utf-8');
    // When receive client data.
    client.on('data', async function (data) {
        console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);
		const req = JSON.parse(data)
		if (req.msgId === 'GET_SELLERS') {
			const sellersData = await getData('sellers')
			const response = getSellersMSGResponse(sellersData)
			client.write(JSON.stringify(response))
		} else {
			handleRequests(req, client)
		} 
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
	serverInstance.listen(details.seller.port, function () {
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