
function getDataAndSendEmail() {
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

document.addEventListener('DOMContentLoaded', function () {
  getDataAndSendEmail();

});
