const EmailController = class EmailController {
  constructor() {
    this.data = {
      url: '',
      title: '',
      email: ''
    };
  }

  getData() {
    const getEmail = new Promise((resolve) => {
      chrome.identity.getProfileUserInfo(user => {
        const email = user.email;
        this.data.email = email;
        resolve(email);
      });
    });
    const getTab = new Promise((resolve) => {
      const config = {
        active: true,
        currentWindow: true
      };
      chrome.tabs.query(config, tabs => {
        const tab = tabs[0];
        this.data.url = tab.url;
        this.data.title = tab.title;
        resolve(tab);
      });
    });
    return Promise.all([getEmail, getTab]);
  }

  sendEmail(done) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const responseObj = JSON.parse(xhr.responseText);
        done(responseObj);
      }
    };
    xhr.open('POST', 'https://guarded-shore-88310.herokuapp.com/snd');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(this.data));
  }

  renderSettings() {

  }

  renderSending() {
    const
      title = document.getElementById('title'),
      titleText = document.createTextNode(this.data.title),
      email = document.getElementById('email'),
      emailText = document.createTextNode(this.data.email);
    title.appendChild(titleText);
    email.appendChild(emailText);
  }

  renderStatus(responseObj) {
    const
      msgContainer = document.getElementById('msg-container'),
      success = 'MEmail sent!',
      error = 'uh oh, something went wrong...',
      statusMessage = responseObj.status === 'success' ? success : error;
    msgContainer.innerHTML = `<div id="status" class="msg animate">${statusMessage}</div>`;
    setTimeout(window.close, 1000);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const store = localStorage;

  store.setItem('test', 'did this work?');

  const test = store.getItem('email');
  console.log('!!!!!!!!!!!!!!!!!!!!!!!', test);

  const MEmail = new EmailController();

  MEmail.getData()
    .then(() => {
      MEmail.renderSending();
      MEmail.sendEmail(MEmail.renderStatus);
    });
});
