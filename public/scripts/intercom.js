(function intercon() {
  const w = window;
  const ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    // eslint-disable-next-line no-undef
    ic('update', intercomSettings);
  } else {
    const d = document;
    const i = function(...args) {
      i.c(...args);
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args);
    };
    w.Intercom = i;
    const s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://js.intercomcdn.com/shim.latest.js';
    const x = d.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }
})();
