const net = require('net');
const { getDataMSG, updateDataMSG } = require("../../seller/messages");
const details = require('../hostDetails');

function getConnection(connName){
    const option = {
        host: details.database.host,
        port: details.database.port
    }
    const client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });
    client.setEncoding('utf8');
    
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
const getData = async (dataId) => {
	return new Promise((resolve, reject) => {
		const connection = getConnection("dataConnection");
		connection.write(JSON.stringify(getDataMSG(dataId)))
		connection.on('data', function (response) {
			res = JSON.parse(response);
			resolve(res);
		});
	});	
};

const updateData = async (dataId, newData) => {
	return new Promise((resolve, reject) => {
		const connection = getConnection("updateDataConnection");
		connection.write(JSON.stringify(updateDataMSG(dataId, newData)))
		resolve()
	});	
};

module.exports = { 
	getData,
	updateData
};