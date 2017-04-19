
const EmailController = class EmailController {
  constructor() {
    this.settings = false;
    this.data = {
      url: '',
      title: '',
      email: ''
    };
  }
  getEmail() {
    const emailPromise = new Promise((resolve) => {
      chrome.identity.getProfileUserInfo(user => {
        const email = user.email;
        this.setEmail = email;
        resolve(email);
      });
    });
    return emailPromise;
  }

  set setEmail(email) {
    this.data.email = email;
  }

  getTab() {
    const tabPromise = new Promise((resolve) => {
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
    return tabPromise;
  }

  sendEmail(done) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const responseObj = JSON.parse(xhr.responseText);
        done(responseObj);
      }
    };
    xhr.open('POST', 'https://guarded-shore-88310.herokuapp.com/send');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(this.data));
  }

  renderSettings(email) {
    const
      input = $('input'),
      button = $('button'),
      store = localStorage;
    $('#msg-container').children().hide();
    $('#settings').fadeIn();
    input.val(email);
    input.change(event => {
      input.val(event.target.value);
    });
    button.click(event => {
      event.preventDefault();
      const value = input.val();
      store.setItem('email', value);
      this.setEmail = value;
      this.settings = false;
      this.renderSending(value);
      this.sendEmail(this.renderStatus);
    });
  }

  renderSending(email) {
    $('#msg-container').children().hide();
    $('#sending').fadeIn();
    $('#title').text(this.data.title);
    $('#email').text(email);
  }

  renderStatus(responseObj) {
    if (this.settings) return;
    $('#msg-container').children().hide();
    $('#status').fadeIn();
    const
      success = 'MEmail sent!',
      error = 'uh oh, something went wrong...',
      statusMessage = responseObj.status === 'success' ? success : error;

    $('#status').text(statusMessage);
    // setTimeout(window.close, 1000);
  }

  renderCog() {
    $('#cog').click(event => {
      event.preventDefault();
      this.settings = true;
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        this.renderSettings(storedEmail);
      } else {
        this.getEmail().then(fetchedEmail => {
          this.renderSettings(fetchedEmail);
        });
      }
    });
  }
};

$(document).ready(function() {
  const
    store = localStorage,
    MEmail = new EmailController();
  MEmail.renderCog();
  MEmail.getTab().then(function() {
    const storedEmail = store.getItem('email');
    if (storedEmail) {
      MEmail.setEmail = storedEmail;
      MEmail.renderSending(storedEmail);
      setTimeout(() => {
        if (!MEmail.settings) {
          MEmail.sendEmail(MEmail.renderStatus.bind(MEmail));
        }
      }, 1000);
    } else {
      MEmail.getEmail().then(fetchedEmail => {
        MEmail.renderSettings(fetchedEmail);
      });
    }
  });
});
