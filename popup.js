function getUserEmail(callback) {
  chrome.identity.getProfileUserInfo(user => {
    const email = user.email;
    callback(email);
  });
}

function getTabAndEmail() {
  const getEmail = new Promise((resolve, reject) => {
    chrome.identity.getProfileUserInfo(user => {
      const email = user.email;
      resolve(email);
    });
  });
  const getTab = new Promise((resolve, reject) => {
    const config = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(config, tabs => {
      const tab = tabs[0];
      resolve(tab);
    });
  });
  Promise.all([getEmail, getTab])
  .then(values => {
    const data = {};
    data.url = values[1].url;
    data.title = values[1].title;
    data.email = values[0];

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/send');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
  });
}

function getCurrentTab(callback) {
  var config = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(config, tabs => {
    const tab = tabs[0];
    callback(tab);
  });
}

function renderEmail(email) {
  document.getElementById('email').value = email;
}

function renderSubject(tab) {
  document.getElementById('subject').value = tab.title;
}

function renderBody(tab) {
  const content = `${tab.title}

${tab.url}`;
  document.getElementById('body').value = content;
}

    // var port = chrome.extension.connect({
    //   name: 'Sample Communication'
    // });

document.addEventListener('DOMContentLoaded', function () {
  getTabAndEmail();
  window.close();
  // const data = {};
  // getCurrentTab(tab => {
  //   renderBody(tab);
  //   renderSubject(tab);
  //   data.url = tab.url;
  //   data.title = tab.title;
  // });
  // getUserEmail(email => {
  //   renderEmail(email);
  //   data.email = email;
  // });

  // document.getElementById('submit').addEventListener('click', function () {
    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', 'http://localhost:8080/send');
    // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    // xhr.send(JSON.stringify(data));
    // axios.post('http://localhost:8080/send').catch(err => console.error(err));
    // console.log('in click event');
    // port.postMessage('send');
    // port.onMessage.addListener(function (msg) {
    //   console.log('message recieved' + msg);
    // });
  // });
});
