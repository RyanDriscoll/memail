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
      success: {},
      error: {},
      showCountdown: true,
      count: 3
    };
    this.countdown = this.countdown.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.renderSending = this.renderSending.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getEmail();
    this.getTab();
    this.interval = setInterval(this.countdown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleClick() {
    console.log('state', this.state, typeof this.state.error);
  }

  handleFocus() {
    console.log('focus happening');
    clearInterval(this.interval);
    this.setState({
      showCountdown: false
    });
  }

  handleChange(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  countdown() {
    this.setState({count: this.state.count - 1});
    if (this.state.count <= 0) {
      clearInterval(this.interval);
      this.sendEmail();
      // window.close();
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
    axios.post(rootPath + 'snd', {email, url, title})
      .then(success => this.setState({success, sent: true}))
      .catch(error => this.setState({error}));
  }

  renderSending() {
    return (
      <div>
        <h2>Sending MeMail to:</h2>
        <form>
          <input tabIndex="-1" value={this.state.email} onChange={this.handleChange} onFocus={this.handleFocus} />
        </form>
      </div>
    );
  }

  render() {
    const success = Object.keys(this.state.success).length;
    const error = Object.keys(this.state.error).length;
    return (
      <div>
        <h1>MeMail</h1>
        {
          this.state.count > 0 && this.state.showCountdown ? this.state.count : null
        }
        {
          !success && !error ? this.renderSending() : null
        }
        {
          success ? <h1>Success!</h1> : null
        }
        {
          error ? <h1>Email failed to send</h1> : null
        }
        <button onClick={this.handleClick} />
      </div>
    );
  }
}

export default Popup;
