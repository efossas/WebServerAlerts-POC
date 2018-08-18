# WebServerAlerts-POC
POC of Notification API, SSE, Web Sockets, & Push API.

## How To use
You need Docker installed.

Then, just run `sh compose.sh`. That will build the image and run docker compose.

The default end point is `http://web.docker.localhost`. You need to use DNS to route that domain to your localhost.

## Differences

### Notification API

UI Only

This is purely front-end code. The notification appears using the machine's notification UI, so the user does not have to be looking at your web page or even have their browser visible to see the notification.

### Server Side Events

One Way: Server -> Client 

A client creates a connection to the server and holds the connection. The server can then send data to the client when it wants. However, the client cannot send data to the server.

### Web Sockets

Two Way: Server <-> Client

A client creates a connection to the server and holds the connection. Both the server and the client can send data to each other when they want. *socket.io* makes it very simple to set up. It took me less time to set up web sockets than it did to set up server side events.

### Push API

Two Way: Server <-> Client

The big difference here is that Push API uses a service worker, which means that *the user doesn't have to have your web page open* to receive data.

## Cross-Browser Compatibility

[Notification API](https://developer.mozilla.org/en-US/docs/Web/API/notification#Browser_compatibility)

IE, Mobile Safari, & Android do not support it.

[Server Side Events](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Browser_compatibility)

IE & Edge do not support it.

[Web Sockets](https://caniuse.com/#search=websocket)

Pretty much compatible with all browsers, even IE.

[Push API](https://caniuse.com/#search=push%20api)

IE, Safari, & Mobile Safari do not support it.



