
exports.route = async function(request,response) {
  let data = request.app.get('data');
   
  // server side events require mime type 'text/event-stream'
  response.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  var connectionAlive = true;
  request.connection.on('close',() => {    
     connectionAlive = false;
     console.log('SSE connection closed');
  });

  var sseCount = 0;
  while(connectionAlive) {
    sseCount++;
    
    let str = "";
    str += `id: ${sseCount}\n`; // id is associated with this SSE
    str += `retry: 5000\n`; // if client fails to retrieve data, client will retry in 5 seconds
    str += `data: Server Side Event ${sseCount}\n\n`; // server side events require 2 new lines at the end
    response.write(str);
    
    await sleep(5000); // server will send an event out every 5 seconds
  }
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve,ms)
  });
};