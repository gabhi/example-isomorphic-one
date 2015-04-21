var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var AuthMixin = require('../utils/AuthMixin');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var ContactStore = require('../stores/ContactStore');
var MessageStore = require('../stores/MessageStore');
var FetchMessagesStore = require('../stores/FetchMessagesStore');
var fetchContact = require('../actions/fetchContact');
var fetchMessages = require('../actions/fetchMessages');
var Loading = require('./Loading.jsx');

var ContactMessages = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin, AuthMixin],

  statics: {
    storeListeners: [ContactStore, MessageStore, FetchMessagesStore],

    fetchData: function(context, params, query, done) {
      concurrent([
        context.executeAction.bind(context, fetchContact, {contactId: params.id}),
        context.executeAction.bind(context, fetchMessages, {contactId: params.id})
      ], done || function() {});
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      contact: this.getStore(ContactStore).getContact(this.getContactId()),
      messages: this.getStore(MessageStore).getMessages(this.getContactId()),
      loading: this.getStore(FetchMessagesStore).isLoadingMessages()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  getContactId: function() {
    return this.context.router.getCurrentParams().id;
  },

  render: function() {
    return (
      <div>
        <h1>Contact messages</h1>
        <p>
          <Link to="contacts">
            Back to contacts
          </Link>
          {' - '}
          <Link to="contact-details" params={{id: this.getContactId()}}>
            Contact details
          </Link>
        </p>
        {this.renderLoading()}
        {this.renderMessages()}
      </div>
    );
  },

  renderLoading: function() {
    if (!this.state.loading) {
      return null;
    }

    return <Loading />;
  },

  renderMessages: function() {
    var contact = this.state.contact;
    var messages = this.state.messages;
    return map(messages, function(message, index) {
      return (
        <p key={index}>
          <strong>{(message.to ? 'me' : contact.name) + ': '}</strong>
          {message.content}
        </p>
      );
    });
  }
});

module.exports = ContactMessages;
