'use strict';

var state = [],
    focus = undefined,
    buffer = undefined;

function save(i, data) {
  state[i] = Object.assign({}, state[i], data);
}

function load(i) {
  return state[i] || { iterations: 7, pattern: [0.5,0.5,0.5,0.5], phase:undefined, lastphaseOnScreen:undefined };
}

function toJSON() {
  //var selector = function(key,value) { if (key === "cantor") { return undefined; } else { return value;} }
  var selector = ["iterations", "pattern", "amp", "pitch", "phase"];
  return JSON.stringify(state, selector);
}

function setFromJSON(json) {
  state = JSON.parse(json);
}

// state -> url
function saveToURL() {
  var data = encodeURI(toJSON());
  // var url = window.location.protocol
  //     + "//"
  //     + window.location.hostname
  //     + ":"
  //     + window.location.port
  //     + "/"
  //     + "#"
  //     + data;

  window.location.href = "#STATE:"+data;
  return window.location.href;
}


// url -> state
function loadFromURL(url) {
  var url = url || window.location.href;
  var json = decodeURI(url).split(/#STATE:/)[1];
  if (json !== undefined) {
    setFromJSON(json);
    return true;
  }
  else {
    return false;
  }
}

function copytobuffer(i) {
  buffer = Object.assign ({}, state[i]);
  buffer.phase = buffer.lastphaseOnScreen = undefined; // don't copy these for now
}

function savefrombuffer(i) {
  if (!buffer) return false;
  state[i] = buffer;
  state[i].pattern = buffer.pattern.slice(0);
  return state[i];
}

function getActiveStateIds() {
  var active = [];
  for (var i=0; i<state.length; i++) {
    if (state[i]) {
      active.push(i);
    }
  }
  return active;
}


export default { save, load, focus, copytobuffer, savefrombuffer, toJSON, setFromJSON, saveToURL, loadFromURL, getActiveStateIds};
