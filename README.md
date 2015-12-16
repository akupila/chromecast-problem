# chromecast-problem

Example to replicate issue connecting to Chromecast from Chrome on iOS

Related to https://code.google.com/p/google-cast-sdk/issues/detail?id=714

## Problem

When connecting to a custom Chromecast app from Chrome on iOS the connection always fails. 

The iPhone can see the Chromecast being available but after connection has been established it receives an error. 
The error occurs when ``castReceiverManager.start();`` is called. How soon ``start()`` is called doesn't have any impact.

Log:

```
10:25:20.130: Session error: {"code":"channel_error","description":"The operation couldn’t be completed. (com.google.chrome.ios.cast error 2.)"} 
10:25:08.669: Starting session 
10:25:05.979: Receiver available 
10:25:05.942: Cast initialized 
10:25:05.851: Starting Sender for app id B030C4BA with namespace urn:x-cast:akupila.chromecast.test
```

## Expected

Chromecast should connect and start sending messages ping-pong

Log:

```
10:00:19.672: Received pong
10:00:19.325: Sent ping
10:00:18.315: Received pong
10:00:18.283: Sent ping
10:00:17.269: Session connected: {"sessionId":"5BD7E19C-252F-495D-AE19-AFD31ADFD53E","appId":"B030C4BA","displayName":"Autoplay Development [Local]","statusText":"Autoplay Development [Local]","receiver":{"label":"uuid:9k6QaBQMyj8iy4alZS4ZS_Ji3DA.","friendlyName":"Paco the Chromecast","capabilities":["video_out","audio_out"],"volume":{"level":1,"muted":false},"receiverType":"cast","isActiveInput":true,"displayStatus":null,"ipAddress":null},"senderApps":[],"namespaces":[{"name":"urn:x-cast:akupila.chromecast.test"}],"media":[],"status":"connected","transportId":"web-55"}
10:00:09.998: Starting session
09:59:58.568: Session error: {"code":"cancel","description":"User closed popup menu","details":null}
09:59:56.684: Starting session
09:59:55.120: Receiver available
09:59:55.115: Cast initialized
09:59:55.063: Starting Sender for app id B030C4BA with namespace urn:x-cast:akupila.chromecast.test
```

## System details

| Device      | OS                   | Chrome version        | Result          |
|-------------|----------------------|-----------------------|-----------------|
| MacBook Pro | OS X 10.11.1 (15B42) | 47.0.2526.80 (64-bit) | Works fine      |
| iPhone 5    | iOS 9.2 (13C75)      | 47.0.2526.70          | Session timeout |

## Steps to reproduce

  1. Create a Chromecast app and point it to a place where ``index.html`` is hosted
  2. Update the ``Application ID`` in ``sender.html``
  3. Open ``sender.html`` on iPhone
  4. Click connect
  5. Session times out

