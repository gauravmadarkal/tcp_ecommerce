const getSearchItemsMSG = (data) => {
	return {
		msgId: "SEARCH_ITEMS",
		data
	}
}

const getSearchItemsResponseMSG = (data) => {
	return {
		msgId: "SEARCH_ITEMS",
		data
	}
} 

const addItemToCartMSG = (data) => {
	return {
		msgId: "ADD_TO_CART",
		data
	}
}

const removeItemFromCartMSG = (data) => {
	return {
		msgId: "REMOVE_FROM_CART",
		data
	}
}

const getClearCartMSG = () => {
	return {
		msgId: "CLEAR_CART"
	}
}

const getDisplayCartMSG = () => {
	return {
		msgId: "DISPLAY_CART"
	}
}

const getDisplayCartResponseMSG = (data) => {
	return {
		msgId: "DISPLAY_CART",
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