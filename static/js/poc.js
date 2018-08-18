/* random initialization */

if (document.onkeypress !== null) {
  document.keypresses = [document.onkeypress];
} else {
  document.keypresses = [];
}

document.onkeypress = (e) => {
  e = e || window.event;
  for (let func of document.keypresses) {
    func(e);
  }
};

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
 
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/* POC object */

function POC() {
  
};

/* client side proof of concepts definitions */

POC.notification = () => {
  document.keypresses.push((e) => {
    if (e.keyCode === 113 && window.Notification) {
      if (Notification.permission === "denied") {
        window.alert("You previously denied Notifications. To allow them, you must click the icon to the left of the URL and change your Notification settings for this site.");
      } else if (Notification.permission === "granted") {
        window.alert("Notifications are enabled.");
      } else {  
        Notification.requestPermission((status) => {
      		new Notification('Notification Title', { 
      			body: 'Notification body text',
      			icon: '/img/favicon.png'
      		}); 
      	});
      }
    } else if (e.keyCode === 97 && window.Notification && Notification.permission === "granted") {
      new Notification('Notification Title', { 
  			body: 'Notification body text',
  			icon: '/img/favicon.png'
  		});
    }
  });
};

POC.sse = () => { 
  POC.sseSrc = null; // used to ensure we have only one connection
  document.keypresses.push((e) => {
    if (e.keyCode === 115) {
      if (POC.sseSrc !== null) {
        POC.sseSrc.close();
        POC.sseSrc = null;
        alertify.message("SSE Closed");
      }
    } else if (e.keyCode === 119) {
      if (POC.sseSrc === null) {
        POC.sseSrc = new EventSource("http://web.docker.localhost/sse");
  
        POC.sseSrc.onopen = function() {
          alertify.message("SSE Opened");
        };
        
        POC.sseSrc.onmessage = function(e) {
          // "lastEventId" has the "id"
          // "data" has the "data"
          alertify.success(e.data);
        };
        
        POC.sseSrc.onerror = function(e) {
          alertify.error('SSE Error');
        };
        
        alertify.message("SSE Started");
      }
    }
  });
  
  /*
    alternatively, if the server uses this format:
    
    event: ping
    data: some data
    
    then we can use an event listener on 'ping' to get specific server side events
  */
};

POC.push = () => {
  // undefined
  if (!POC.pushSub) {
    POC.pushSub = null;
  }
  
  document.keypresses.push((e) => {
    if (e.keyCode === 101) {
      // subscribe
      if (!POC.pushSub) {
        navigator.serviceWorker.ready.then(async function(registration) {
          const response = await fetch('pushKey');
          const vapidPublicKey = await response.text();
          
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          }).then((subscription) => {
            POC.pushSub = subscription;
            alertify.message('Subscribed');
            fetch('push', {
              method: 'POST',
              headers: { 'Content-type': 'application/json' },
              body: JSON.stringify({ action: 'subscribe', subscription: subscription })
            });
          });
        });
      }
    } else if (e.keyCode === 100) {
      // unsubscribe
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            subscription.unsubscribe().then(() => {
              POC.pushSub = null;
              alertify.message('Unsubscribed');
              fetch('push', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ action: 'unsubscribe', subscription: subscription })
              });
            });
          }
        });
      });
    }
  });
};

POC.ws = () => {
  document.keypresses.push((e) => {
    if (e.keyCode === 114) {
      if (!window.socket) {
        window.socket = io();
        window.socket.on('ws event', function(msg) {
          alertify.success(msg);
        });
        alertify.message('Web Socket Connected');
      } else {
        if(!window.socket.connected) {
          window.socket = io.connect( 'http://web.docker.localhost/', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
          });
          
          window.socket.on('ws event', function(msg) {
            alertify.success(msg);
          });
          alertify.message('Web Socket Connected');
        }
      }
    } else if (e.keyCode === 102) {
      if (window.socket) {
        window.socket.emit('ws disconnect','');
        window.socket.destroy();
        delete window.socket;
        alertify.message('Web Socket Disonnected');
      }
    }
  });  
};

/* calling the proof of concept functions */

// this is for Push API, register service worker, when ready, request push subscription
navigator.serviceWorker.register('push-service-worker.js');
navigator.serviceWorker.ready.then((registration) => {
  registration.pushManager.getSubscription().then((subscription) => {
    if (subscription) {
      alertify.message('Already Subscribed');
      POC.pushSub = subscription;
    }
  });
});

POC.sse();
POC.notification();
POC.push();
POC.ws();








