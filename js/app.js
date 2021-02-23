'use strict';

window.sse = null;
const {location: {origin}} = window;
const sseURL = `${origin}/stream`;

document.addEventListener('DOMContentLoaded', onPageLoad);

async function onPageLoad() {
  // Close up any event streams that are already open on the page
  // This would be useful in cases where there are multiple data
  // sources in the page (like a list of feeds/monitored resources)
  window.sse && window.sse.close();
  window.sse = new EventSource(sseURL);
  window.sse.onmessage = (e) => {
    timer.innerText = e.data;
  };
  window.sse.onerror = (e) => {
    console.error(e);
  };

}
