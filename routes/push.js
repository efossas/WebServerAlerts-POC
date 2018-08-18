
exports.route = function(request,response) {
  let subscriptions = request.app.get('subscriptions');
  console.log(request.body.subscription);
  if (request.body.action === 'subscribe') {
    
    let sub = request.body.subscription;
    if (!subscriptions[sub.endpoint]) {
      subscriptions[sub.endpoint] = sub;
    }
    response.sendStatus(201);
    
  } else if (request.body.action === 'unsubscribe') {
    
    let sub = request.body.subscription;
    if (subscriptions[sub.endpoint]) {
      delete subscriptions[sub.endpoint];
    }
    response.sendStatus(201);
    
  } else {
    response.status(400);
    response.end('Invalid Action');
  }
};