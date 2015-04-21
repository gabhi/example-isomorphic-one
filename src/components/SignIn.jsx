var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var AuthStore = require('../stores/AuthStore');
var signIn = require('../actions/signIn');

var SignIn = React.createClass({
  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [AuthStore]
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      isSigningIn: this.getStore(AuthStore).isSigningIn(),
      error: this.getStore(AuthStore).getSignInError()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <h1>Sign in</h1>
        <form>
          <p><input ref="username" name="username" placeholder="username" defaultValue="joe@example.com"/></p>
          <p>
            <input ref="password" name="password" type="password" placeholder="password"/>
            {' (hint: password1)'}
          </p>
          <p>{this.renderButton()}</p>
        </form>
        {this.renderError()}
      </div>
    );
  },

  renderButton: function() {
    var disabled;
    var text = 'Sign in';

    if (this.state.isSigningIn) {
      disabled = true;
      text = 'Signing in...';
    }

    return (
      <button
        type="submit"
        onClick={this.handleSignIn}
        disabled={disabled}>
        {text}
      </button>
    );
  },

  handleSignIn: function(e) {
    e.preventDefault();
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    this.executeAction(signIn, {
      username: username,
      password: password
    });
  },

  renderError: function() {
    var error = this.state.error;
    if (!error) {
      return null;
    }

    var text;
    if (error.name === 'BadCredentials') {
      text = 'Wrong username or password';
    }
    else {
      text = 'An error occured while signing in';
    }

    return <p style={{color: 'red'}}>{text}</p>;
  }
});

module.exports = SignIn;
