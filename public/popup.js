
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

  renderSettings(email) {
    const
      input = $('input'),
      button = $('button'),
      store = localStorage;
    input.val(email);
    input.change(event => {
      input.val(event.target.value);
    });
    console.dir(button);
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

  }
};

$(document).ready(function() {
  const
    store = localStorage,
    MEmail = new EmailController();

  MEmail.getTab().then(function() {
    const storedEmail = store.getItem('email');
    MEmail.renderSettings('test@gmail.com');
  });

});
