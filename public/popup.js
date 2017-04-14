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
    xhr.open('POST', 'http://localhost:8080/send');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(this.data));
  }

  render() {
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
      success = 'MeMail sent!',
      error = 'uh oh, something went wrong...',
      statusMessage = responseObj.status === 'success' ? success : error;
    msgContainer.innerHTML = `<div class="msg">${statusMessage}</div>`;
    setTimeout(window.close, 2000);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const MeMail = new EmailController();

  MeMail.getData()
  .then(() => {
    MeMail.render();
    MeMail.sendEmail(MeMail.renderStatus);
  });
});
