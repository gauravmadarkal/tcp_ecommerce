const getDataMSG = (dataId) => {
	return {
		msgId: "GET_DATA",
		dataId
	};
};

const updateDataMSG = (dataId, newData) => {
	return {
		msgId: "UPDATE_DATA",
		dataId,
		newData,
		timestamp: Date.now()
	}
}

const GET_SELLER_MSG = {
	msgId: "GET_SELLERS"
}

const getSellersMSGResponse = (sellers, timestamp=Date.now()) => {
	return {
		msgId: "GET_SELLERS",
		data: sellers,
		timestamp
	}
}

const putItemForSaleMSG = (item, sellerId) => {
	return {
		msgId: "PUT_ITEM_SALE",
		sellerId,
		item,
		timestamp: Date.now()
	}
}

const displayItemsForSellerMSG = (sellerId) => {
	return {
		msgId: "DISPLAY_ITEMS_FOR_SELLER",
		sellerId,
		timestamp: Date.now()
	}
}

const displayItemsForSellerMSGResponse = (sellerId, data, timestamp=Date.now()) => {
	return {
		msgId: "DISPLAY_ITEMS_FOR_SELLER",
		sellerId,
		data,
		timestamp
	}
}

const getRequestCompletedMSG = (completedRequestId, data, timestamp=Date.now()) => {
	return {
		msgId: "REQUEST_COMPLETED",
		completedRequestId,
		data,
		timestamp
	}
}

const changeSalePriceMSG = (sellerId, data) => {
	return {
		msgId: "CHANGE_SALE_PRICE",
		data,
		sellerId,
		timestamp: Date.now()
	}
}

const removeItemFromSaleMSG = (sellerId, data) => {
	return {
		msgId: "REMOVE_ITEM_FROM_SALE",
		data,
		sellerId,
		timestamp: Date.now()
	}
}

const getServerMessage = (message, data) => {
	return {
		msgId: "SERVER_MSG",
		message,
		data
	}
}

module.exports = {
	getDataMSG,
	updateDataMSG,
	GET_SELLER_MSG,
	getSellersMSGResponse,
	putItemForSaleMSG,
	displayItemsForSellerMSG,
	displayItemsForSellerMSGResponse,
	getRequestCompletedMSG,
	changeSalePriceMSG,
	removeItemFromSaleMSG,
	getServerMessage
}