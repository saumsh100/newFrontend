/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
if (window !== window.top) window._fs_is_outer_script = true;

const _fs_host = 'fullstory.com';
window._fs_debug = window.debug || false;
window._fs_host = _fs_host;
window._fs_org = 'MVWBF';
window._fs_namespace = 'FS';

function fullStory(m, n, e, t, l, o, g, y) {
  if (e in m) {
    if (m.console && m.console.log) {
      m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
    }
    return;
  }
  g = m[e] = function (a, b, s) {
    g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
  };
  g.q = [];
  o = n.createElement(t);
  o.async = 1;
  o.crossOrigin = 'anonymous';
  o.src = `https://${_fs_host}/s/fs.js`;
  y = n.getElementsByTagName(t)[0];
  y.parentNode.insertBefore(o, y);
  g.identify = function (i, v, s) {
    g(l, { uid: i }, s);
    if (v) g(l, v, s);
  };
  g.setUserVars = function (v, s) {
    g(l, v, s);
  };
  g.event = function (i, v, s) {
    g('event', {
      n: i,
      p: v,
    }, s);
  };
  g.shutdown = function () {
    g('rec', !1);
  };
  g.restart = function () {
    g('rec', !0);
  };
  g.log = function (a, b) {
    g('log', [a, b]);
  };
  g.consent = function (a) {
    g('consent', !arguments.length || a);
  };
  g.identifyAccount = function (i, v) {
    o = 'account';
    v = v || {};
    v.acctId = i;
    g(o, v);
  };
  g.clearUserCookie = () => {};
}

fullStory(window, document, window._fs_namespace, 'script', 'user');
