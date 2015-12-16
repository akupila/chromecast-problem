window.Sender = function(el, debug, applicationID, namespace) {
  log('Starting Sender for app id ' + applicationID + ' with namespace ' + namespace);

  var session = null;

  window.__onGCastApiAvailable = function(loaded, errorInfo) {
    if (loaded) {
      var sessionRequest = new chrome.cast.SessionRequest(applicationID);
      var apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        onRequestSessionSuccess,
        receiverListener
      );
      chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
    } else {
      log('Chromecast API not available');
    }
  };

  function onInitSuccess() {
    log('Cast initialized');
  }

  function onInitError(message) {
    log('Cast init error: ' + message);
  }

  function onRequestSessionSuccess(_session) {
    session = _session;

    if (session) {
      log('Session connected: ' + JSON.stringify(session));

      startPingPong();
    }
  }

  function onLaunchError(error) {
    log('Session error: ' + JSON.stringify(error));
  }

  function receiverListener(event) {
    switch (event) {
      case chrome.cast.ReceiverAvailability.AVAILABLE:
        log('Receiver available');
        var connect = document.createElement('button');
        connect.addEventListener('click', startSession, false);
        connect.innerHTML = 'Connect';
        el.appendChild(connect);
        break;
      case chrome.cast.ReceiverAvailability.UNAVAILABLE:
        log('Receiver unavailable');
        break;
      default:
        log('Unhandled receiverListener event: ' + event);
        break;
    }
  }

  function startSession() {
    log('Starting session');

    window.chrome.cast.requestSession(
      onRequestSessionSuccess,
      onLaunchError
    );
  }

  // -----------------------------------------------------

  function startPingPong() {
    session.addMessageListener(namespace, function(_namespace, message) {
      log('Received ' + message);
      schedulePing();
    });
    schedulePing();
  }

  function schedulePing() {
    setTimeout(function() {
      session.sendMessage(
        namespace,
        'ping',
        function() {
          log('Sent ping');
        }, function(error) {
          log('Message send error ' + JSON.stringify(error));
        }
      );
    }, 1000);
  }

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

    debug.innerHTML = timestamp + ': ' + msg + '\n' + debug.innerHTML;
  }
};