'use strict';

const {Server} = require('@techiev2/node_http_server');

// Base route handler to render the example view template
async function rootViewHandler(req, res) {
  return res.renderTemplate(`${__dirname}/templates/index.html`);
}

// Stream respose handler function.
// Initialises an event stream response and sends out the first response
// Additionally, creates a timed response via the helper function that
// writes the response stream.
async function streamHandler(req, res) {
  // Set the content-type header once, when the first response is sent.
  res.setHeader('Content-Type', 'text/event-stream');
  await respondToStream(res);
  setInterval(async () => {
    await respondToStream(res);
  }, 2000);
}

// This function writes to the client like any other. If this interfaces
// with a DB/depends on some external data source, an async function is
// a better choice.
// Two important points to note here
//  - "data: " should prefix the response that is to be sent out
//  - Two new lines "\n\n" need to suffix the response for the client
//    to identify the end of message (a la a walkie talkie) or padding
//    fields in case of file uploads.
async function respondToStream(res) {
  const response = (new Date()).toUTCString();
  res.write(`data: ${response}\n\n`);
}


(async () => {
  Server
    .create({
      '/': rootViewHandler,
      '/stream': streamHandler,
    })
    .setResponseType('html')
    .addStaticRoot(`${__dirname}/css`)
    .addStaticRoot(`${__dirname}/js`)
    .start(4000);
})();
