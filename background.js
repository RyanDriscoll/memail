// chrome.identity.getAuthToken({
//     interactive: true
// }, function(token) {
//     if (chrome.runtime.lastError) {
//         alert(chrome.runtime.lastError.message);
//         return;
//     }
//     var x = new XMLHttpRequest();
//     x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
//     x.onload = function() {
//         alert(x.response);
//     };
//     x.send();
// });
import axios from 'axios';

chrome.extension.onConnect.addListener(function(port) {
    console.log('Connected .....');
    port.onMessage.addListener(function(msg) {
        // console.log('message recieved ' + msg);
        // port.postMessage('Hi Popup.js');
        if (msg === 'send') {
          axios.post('http://localhost:8080/send')
          .catch(err => console.error(err));
        }
    });
});

// chrome.runtime.onMessage.addListener(function(request, sender, response) {
//     if (request.type === 'send'){
//       axios.post('localhost:8080/send');
//       console.log('in chrome runtime msg');
//     }
//   });
