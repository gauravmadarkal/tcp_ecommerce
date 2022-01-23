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
		newData
	}
}

const GET_SELLER_MSG = {
	msgId: "GET_SELLERS"
}

const getSellersMSGResponse = (sellers) => {
	return {
		msgId: "GET_SELLERS",
		data: sellers
	}
}

const putItemForSaleMSG = (item, sellerId) => {
	return {
		msgId: "PUT_ITEM_SALE",
		sellerId,
		item
	}
}

const displayItemsForSellerMSG = (sellerId) => {
	return {
		msgId: "DISPLAY_ITEMS_FOR_SELLER",
		sellerId
	}
}

const displayItemsForSellerMSGResponse = (sellerId, data) => {
	return {
		msgId: "DISPLAY_ITEMS_FOR_SELLER",
		sellerId,
		data
	}
}

const getRequestCompletedMSG = (completedRequestId, data) => {
	return {
		msgId: "REQUEST_COMPLETED",
		completedRequestId,
		data
	}
}

const changeSalePriceMSG = (sellerId, data) => {
	return {
		msgId: "CHANGE_SALE_PRICE",
		data,
		sellerId
	}
}

const removeItemFromSaleMSG = (sellerId, data) => {
	return {
		msgId: "REMOVE_ITEM_FROM_SALE",
		data,
		sellerId
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