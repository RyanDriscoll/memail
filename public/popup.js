const EmailController = class EmailController {
  constructor() {
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

  getData(emailFromStore) {
    // const getEmail = emailFromStore ? emailFromStore :
    // new Promise((resolve) => {
    //   chrome.identity.getProfileUserInfo(user => {
    //     const email = user.email;
    //     this.data.email = email;
    //     resolve(email);
    //   });
    // });
    // const getTab = new Promise((resolve) => {
    //   const config = {
    //     active: true,
    //     currentWindow: true
    //   };
    //   chrome.tabs.query(config, tabs => {
    //     const tab = tabs[0];
    //     this.data.url = tab.url;
    //     this.data.title = tab.title;
    //     resolve(tab);
    //   });
    // });
    const email = emailFromStore ? emailFromStore : this.getEmail();
    return Promise.all([email, this.getTab()]);
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

  renderSettings(email) {
    const
      msgContainer = document.getElementById('msg-container'),
      fragment = document.createDocumentFragment(),
      form = document.createElement('form'),
      label = document.createElement('label'),
      labelText = document.createTextNode('Your email is set to:'),
      input = document.createElement('input'),
      button = document.createElement('button'),
      buttonText = document.createTextNode('UPDATE');
      // store = localStorage;

    label.appendChild(labelText);
    button.appendChild(buttonText);
    input.value = email;

    input.onchange = function(event) {
      input.value = event.target.value;
    };

    const self = this;
    const renderSending = this.renderSending.bind(this);
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const store = localStorage;
      store.setItem('email', input.value);
      self.setEmail = input.value;
      renderSending(input.value);
    });

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    fragment.appendChild(form);
    msgContainer.innerHTML = null;
    msgContainer.appendChild(fragment);
  }

  renderSending(email) {
    const
      msgContainer = document.getElementById('msg-container'),
      fragment = document.createDocumentFragment(),
      mainEl = document.createElement('div'),
      mainText = document.createTextNode('Sending'),
      titleEl = document.createElement('div'),
      titleText = document.createTextNode(this.data.title),
      toEl = document.createElement('div'),
      toText = document.createTextNode('to '),
      emailEl = document.createElement('span'),
      emailText = document.createTextNode(email);

    mainEl.appendChild(mainText);
    titleEl.appendChild(titleText);
    toEl.appendChild(toText);
    emailEl.appendChild(emailText);

    for (let i = 1; i <= 3; i++) {
      let
        dotText = document.createTextNode('.'),
        dotEl = document.createElement('span');
      dotEl.appendChild(dotText);
      dotEl.setAttribute('class', `dot dot-${i}`);
      mainEl.appendChild(dotEl);
    }

    toEl.appendChild(emailEl);

    fragment.appendChild(mainEl);
    fragment.appendChild(titleEl);
    fragment.appendChild(toEl);
    msgContainer.innerHTML = null;
    msgContainer.appendChild(fragment);
  }

  renderStatus(responseObj) {
    const
      msgContainer = document.getElementById('msg-container'),
      status = document.createElement('div').className = 'status',
      success = 'MEmail sent!',
      error = 'uh oh, something went wrong...',
      statusMessage = responseObj.status === 'success' ? success : error,
      statusText = document.createTextNode(statusMessage);
    status.appendChild(statusText);
    msgContainer.innerHTML = null;
    msgContainer.appendChild(status);
    setTimeout(window.close, 1000);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const
    store = localStorage,
    email = store.getItem('email'),
    MEmail = new EmailController();

    store.clear();

  MEmail.getTab().then(() => {
    if (email) {
      MEmail.renderSending(email);
      MEmail.sendEmail(MEmail.renderStatus);
    } else {
      MEmail.getEmail().then(fetchedEmail => {
        MEmail.renderSettings(fetchedEmail);
      });
    }
  });
});
