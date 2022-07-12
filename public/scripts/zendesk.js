const zendesk = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src =
      'https://static.zdassets.com/ekr/snippet.js?key=64f1aaff-945f-42a5-ab35-b4552a3aa4a1';
    script.async = false;
    document.body.appendChild(script);
    script.onload = function () {
      resolve();
    };
    script.onerror = function (err) {
      reject(err);
    };
  });
};

export default zendesk;
