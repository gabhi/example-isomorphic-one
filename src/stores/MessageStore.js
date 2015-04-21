var createStore = require('fluxible/addons/createStore');

var MessageStore = createStore({
  storeName: 'MessageStore',

  handlers: {
    'FETCH_MESSAGES_SUCCESS': 'setMessages'
  },

  initialize: function() {
    this.messagesbyContactId = {};
  },

  setMessages: function(payload) {
    this.messagesbyContactId[payload.contactId] = payload.messages;
    this.emitChange();
  },

  getMessages: function(contactId) {
    return this.messagesbyContactId[contactId] || [];
  },

  dehydrate: function() {
    return {
      messagesbyContactId: this.messagesbyContactId
    };
  },

  rehydrate: function(state) {
    this.messagesbyContactId = state.messagesbyContactId;
  }
});

module.exports = MessageStore;
