/* globals */

'use strict';

const morgan = require('morgan')
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const fs = require('fs');
const path = require('path');
const webPush = require('web-push');

let routes = {};
routes.landing = require('./routes/landing.js').route;
routes.sse = require('./routes/sse.js').route;
routes.push = require('./routes/push.js').route;

function server() {
  /* get express server object */
  var app = express();
  
  /* disable this http header */
  app.disable('x-powered-by');
  
  /* enable json & x-www-form-urlencoded bodies */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  /* enable static assets directory */
  app.use('/',express.static(__dirname + '/static'));
  
  /* enable morgan for access logs */
  // app.use(morgan('combined'));
  
  /* enable ejs for templating */
  app.set('view engine', 'ejs');
  
  /* enable redis for sessions */
  const sessionStore = new RedisStore({
  	host: "localhost",
  	port: 6379,
  	client: redis.createClient(),
  	db: 0,
  	disableTTL: true,
  	prefix: 'session:'
  });
  
  if(sessionStore !== null) {
  	app.use(session({
  		key : "crud_key",
  		secret: "crud_secret",
  		resave: false,
  		saveUninitialized: false,
  		store: sessionStore
  	}));
  } else {
    console.error('Error creating Redis session store\n');
    process.exit();
  }
  
  /* set data object in app */
  app.set('data',{});
  
  /* set up for Push API */
  const vapidKeys = webPush.generateVAPIDKeys();
  process.env.VAPID_PUBLIC_KEY = vapidKeys.publicKey;
  process.env.VAPID_PRIVATE_KEY = vapidKeys.privateKey;
  
  webPush.setVapidDetails(
    'http://http://web.docker.localhost/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  
  app.set('subscriptions',{});
  
  /* this will send push notifications every 5 seconds */
  setInterval(() => {
     Object.values(app.settings['subscriptions']).forEach((subscription) => {
      webPush.sendNotification(subscription,'Notification Payload').then(() => {}).catch((e) => {
        //// console.log(e);
        delete app.settings['subscriptions'][subscription.endpoint];
      });
    });
  }, 5000);
  
  /* LANDING */
  
  app.get('/',routes.landing);
  
  /* PUSH API */
  
  app.post('/push',routes.push);
  app.get('/pushKey',(request, response) => { response.send(process.env.VAPID_PUBLIC_KEY); });
  
  /* SERVER SIDE EVENTS */
  
  app.get('/sse',routes.sse); // SSE only supports GET requests
  
  /* WEB SOCKETS */
	
	const hs = http.createServer(app);
	const io = socketio(hs);
	
	io.on('connection', function(socket) {
  	// connection
  	let cnt = 0;
  	let sId = setInterval(() => {
    	io.emit('ws event', 'Web Socket Notification ' + (cnt++));
    }, 5000);

    socket.on('disconnect', function() {
      // disconnection
      clearInterval(sId);
    });
  });
  
  /* catch all and start the server */
  
  app.all('*',function(request,response) {
		response.status(404);
		response.end("CRUD Path Not Found");
	});
	
	hs.listen(80,function() {
		console.log("CRUD http server listening at 80");
	});

  process.on('SIGINT',function() {
  	// place any clean up here
      process.exit();
  });
}

server();





















