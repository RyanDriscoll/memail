

function getUserEmail(callback) {
  chrome.identity.getProfileUserInfo(user => {
    const email = user.email;
    callback(email);
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


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab(tab => {
    renderBody(tab);
    renderSubject(tab);
  });
  getUserEmail(email => {
    renderEmail(email);
  });
});
