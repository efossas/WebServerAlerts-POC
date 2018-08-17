/* globals */

'use strict';

const morgan = require('morgan')
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const session = require('express-session');
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const fs = require('fs');
const path = require('path');

let routes = {};
routes.landing = require('./routes/landing.js').route;
routes.notification = require('./routes/notification.js').route;
routes.push = require('./routes/push.js').route;
routes.sse = require('./routes/sse.js').route;
routes.ws = require('./routes/ws.js').route;

function server() {
  /* get express server object */
  var app = express();
  
  /* disable this http header */
  app.disable('x-powered-by');
  
  /* enable json & x-www-form-urlencoded bodies */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  /* enable static assets directory */
  app.use('/static',express.static(__dirname + '/static'));
  
  /* enable morgan for access logs */
  app.use(morgan('combined'));
  
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
  
  /* grab the configuration file & create routes */
  
  app.get('/',routes.landing);
  app.get('/notification',routes.notification);
  app.get('/push',routes.push);
  app.get('/sse',routes.sse);
  app.get('/ws',routes.ws);
  
  app.all('*',function(request,response) {
		response.status(404);
		response.end("CRUD Path Not Found");
	});
	
	http.createServer(app).listen(80,function() {
		console.log("CRUD http server listening at 80");
	});
  
  process.on('SIGINT',function() {
  	// place any clean up here
      process.exit();
  });
}

server();





















