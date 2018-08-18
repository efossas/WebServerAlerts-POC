
exports.route = function(request,response) {
  let html = `
  <ul style="font-size:1.4em">
    <li>Notification API request permission: <kbd>q</kbd></li>
    <li>Notification API demo: <kbd>a</kbd></li>
    <br>
    <li>SSE start: <kbd>w</kbd></li>
    <li>SSE stop: <kbd>s</kbd></li>
    <br>
    <li>Push API subscribe: <kbd>e</kbd></li>
    <li>Push API unsubscribe: <kbd>d</kbd></li>
    <br>
    <li>WebSocket connect: <kbd>r</kbd></li>
    <li>WebSocket disconnect: <kbd>f</kbd></li>
  </ul>`;
    
  response.render('template',{
    html: html
  });
};