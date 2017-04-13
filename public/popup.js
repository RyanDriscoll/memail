const EmailController = class EmailController {
  constructor() {
    this.data = {
      url: '',
      title: '',
      email: ''
    };
  }

  getData() {
    const getEmail = new Promise((resolve, reject) => {
      chrome.identity.getProfileUserInfo(user => {
        const email = user.email;
        this.data.email = email;
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
    xhr.open('POST', 'http://localhost:8080/send');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(this.data));
  }

  renderStatus(responseObj) {
    const
      msgContainer = document.getElementById('msg-container'),
      success = 'MeMail sent!',
      error = 'uh oh, something went wrong...',
      statusMessage = responseObj.status === 'success' ? success : error;
    msgContainer.innerHTML = `<h1 class="msg">${statusMessage}</h1>`;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const MeMail = new EmailController();

  MeMail.getData()
  .then(() => MeMail.sendEmail(MeMail.renderStatus));
});
