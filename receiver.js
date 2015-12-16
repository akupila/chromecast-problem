window.Receiver = function(el, namespace) {
	log('Starting Receiver with namespace ' + namespace);

	var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

	var messageBus = castReceiverManager.getCastMessageBus(namespace);

	log('Waiting 5sec');
	setTimeout(function() {
		log('Starting CastReceiverManager');
		castReceiverManager.start();
		// This is where the error occurs in Chrome on iPhone
	}, 5000);

	castReceiverManager.onReady = function(event) {
		log('onReady ' + JSON.stringify(event.data));
	};

	castReceiverManager.onSenderConnected = function(event) {
		log('onSenderConnected ' + JSON.stringify(event.data));
	};

	castReceiverManager.onSenderDisconnected = function(event) {
		log('onSenderDisconnected ' + JSON.stringify(event.data));
	};

	castReceiverManager.onShutdown = function(event) {
		log('onShutdown ' + JSON.stringify(event.data));
	};

	castReceiverManager.onStandbyChanged = function(standby) {
		log('onStandbyChanged ' + JSON.stringify(standby));
	};

	castReceiverManager.onSystemVolumeChanged = function(event) {
		log('onSystemVolumeChanged ' + JSON.stringify(event.data));
	};

	castReceiverManager.onVisibilityChanged = function(event) {
		log('onVisibilityChanged ' + JSON.stringify(event.data));
	};

	messageBus.onMessage = function(event) {
		var senderId = event.senderId;
		log('message from ' + senderId + ': ' + event.data);

		if (event.data === 'ping') {
			log('responding to ' + senderId + ': pong');
			messageBus.send(senderId, 'pong');
		}
	};

	// -----------------------------------------------------

	function log(msg) {
		console.log(msg);
		if (typeof msg !== 'string') {
			msg = JSON.stringify(msg);
		}

		function pad(val, length) {
			val = val.toString();
			while (val.length < length) {
				val = '0' + val;
			}
			return val;
		}

		var now = new Date();
		var timestamp = pad(now.getHours(), 2) + ':' +
										pad(now.getMinutes(), 2) + ':' +
										pad(now.getSeconds(), 2) + '.' +
										pad(now.getMilliseconds(), 3);

		el.innerHTML = timestamp + ': ' + msg + '\n' + el.innerHTML;
	}
};