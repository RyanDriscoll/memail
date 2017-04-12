import React from 'react';
import axios from 'axios';
import rootPath from './rootPath';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      url: '',
      title: '',
      success: '',
      error: '',
      count: 5
    };
    this.countdown = this.countdown.bind(this);
  }

  componentDidMount() {
    this.getEmail();
    this.getTab();
    this.interval = setInterval(this.countdown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countdown() {
    console.log(this.state);
    this.setState({count: this.state.count - 1});
    if (this.state.count <= 0) {
      clearInterval(this.interval);
    }
  }

  getEmail() {
    chrome.identity.getProfileUserInfo(user => {
      const email = user.email;
      this.setState({email});
    });
  }

  getTab() {
    const config = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(config, tabs => {
      const url = tabs[0].url;
      const title = tabs[0].title;
      this.setState({url, title});
    });
  }

  sendEmail() {
    const {email, url, title} = this.state;
    axios.post(rootPath + 'send', {email, url, title})
      .then(success => this.setState({success}))
      .catch(error => this.setState({error}));
  }

  render() {
    return (
      <div>
        {
          this.state.count
        }
      </div>
    );
  }
}

export default Popup;
