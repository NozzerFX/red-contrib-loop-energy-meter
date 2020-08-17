const io = require('socket.io-client');

module.exports = function (RED) {

  let node = null;

  function LoopEnergyMeterNode (config) {
    RED.nodes.createNode(this, config);
    node = this;

    if (!node.socket) {
      node.status(node.CONNECTING);
      node.connect(function (event, error) {
        if (event == "created") {
					node.socket.on('electric_realtime', function (data) { 
            node.send({
							payload: data
						});
          });
				} else if(event == "connected") {
					node.status(node.CONNECTED);
          node.socket.emit("subscribe_electric_realtime", {
            serial: node.credentials.serial,
            clientIp: '127.0.0.1',
            secret: node.credentials.secret
          });
				} else if(event == "error") {
					node.log('Something went wrong', error)
					node.status(node.ERROR);
				}
      });
    }

  }
  
  RED.nodes.registerType("Loop Energy Meter", LoopEnergyMeterNode, {
    credentials : {
      serial : { type: 'text' },
      secret : { type: 'password' }
    }
  });

  LoopEnergyMeterNode.prototype.close = function () {
		if (node.socket) {
			node.log("Disconnecting...");
			node.socket.close();
		}
	};

  LoopEnergyMeterNode.prototype.connect = function (callback) {
    if (!node.socket) {
      try {
        node.socket = io.connect('https://www.your-loop.com', {reconnect: true});
        
        node.socket.on('connect', function () {
          callback('connected');
        });

        node.socket.on('disconnect', function () {
          node.status(node.ERROR);
          node.log('Socket was disconnected');
        });

        callback('created');
      } catch (e) {
        node.log(e);
        callback('error', e);
      }

    } else {
      callback('ready');
    }
  };

  LoopEnergyMeterNode.prototype.CONNECTING = {
		fill : "yellow",
		shape : "ring",
		text : "connecting..."
	};

	LoopEnergyMeterNode.prototype.CONNECTED = {
		fill : "green",
		shape : "ring",
		text : "connected"
	};

	LoopEnergyMeterNode.prototype.ERROR = {
		fill : "red",
		shape : "ring",
		text : "error"
	};
}
