const getSearchItemsMSG = (data) => {
	return {
		msgId: "SEARCH_ITEMS",
		data,
		timestamp: Date.now()
	}
}

const getSearchItemsResponseMSG = (data, timestamp=Date.now()) => {
	return {
		msgId: "SEARCH_ITEMS",
		data,
		timestamp
	}
} 

const addItemToCartMSG = (data) => {
	return {
		msgId: "ADD_TO_CART",
		data,
		timestamp: Date.now()
	}
}

const removeItemFromCartMSG = (data) => {
	return {
		msgId: "REMOVE_FROM_CART",
		data,
		timestamp: Date.now()
	}
}

const getClearCartMSG = () => {
	return {
		msgId: "CLEAR_CART",
		timestamp: Date.now()
	}
}

const getDisplayCartMSG = () => {
	return {
		msgId: "DISPLAY_CART",
		timestamp: Date.now()
	}
}

const getDisplayCartResponseMSG = (data, timestamp=Date.now()) => {
	return {
		msgId: "DISPLAY_CART",
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

module.exports = {
	getSearchItemsMSG,
	getSearchItemsResponseMSG,
	addItemToCartMSG,
	removeItemFromCartMSG,
	getClearCartMSG,
	getDisplayCartMSG,
	getDisplayCartResponseMSG,
	getRequestCompletedMSG
}