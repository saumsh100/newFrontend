
export default {
  iframe({ className, src }) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', 'yes');
    iframe.className = className;
    iframe.src = src;
    return iframe;
  },

  injectStyleText(styleText) {
    const style = document.createElement('style');
    style.textContent += styleText;

    const head = document.getElementsByTagName('head')[0];

    // Insert at top of head so that any consecutive style can override
    head.insertBefore(style, head.firstChild);
  },

  bookingButton() {
    // Create the Book Online Button
    const bookingButton = document.createElement('div');
    bookingButton.innerHTML = 'Book Online';
    bookingButton.className = 'CareCruButton';

    // Append at bottom of body
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(bookingButton);
    return bookingButton;
  },
};
