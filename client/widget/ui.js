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

  bookingButton(__CARECRU_WIDGET_BUTTON_LABEL__) {
    // Create the Book Online Button
    let buttonLabelText = __CARECRU_WIDGET_BUTTON_LABEL__;
    if (
      buttonLabelText === 'undefined' ||
      buttonLabelText === '' ||
      buttonLabelText === undefined
    ) {
      buttonLabelText = 'Book Online';
    }
    const buttonLabel = buttonLabelText.split(' ');
    const CalendarSVG =
      '<svg class="CareCruButtonIconSVG" viewBox="0 0 184 167" xmlns="http://www.w3.org/2000/svg"><path d="M170.486 6.775c7.462 0 13.511 6.049 13.511 13.511v132.935c0 7.462-6.049 13.512-13.511 13.512H13.931c-7.461 0-13.51-6.05-13.51-13.512V20.284c0-7.461 6.048-13.509 13.509-13.509h22.038V1.954c0-.809.655-1.465 1.465-1.465h18.999c.809 0 1.465.656 1.465 1.465v4.821h66.853V1.954c0-.809.656-1.465 1.465-1.465h19.001c.81 0 1.465.656 1.465 1.465v4.821h23.805zm-3.843 147.071a3.611 3.611 0 0 0 3.609-3.613V44.279a3.61 3.61 0 0 0-3.609-3.613H18.374a3.61 3.61 0 0 0-3.609 3.613v105.954a3.611 3.611 0 0 0 3.609 3.613h148.269zm-40.331-72.672a3.358 3.358 0 0 1 0 4.745l-38.846 38.846c-.371.37-.811.608-1.275.769-1.004.739-2.403.698-3.311-.212l-24.406-24.404a2.569 2.569 0 0 1 0-3.631l7.598-7.597a2.567 2.567 0 0 1 3.631 0l15.19 15.19 30.19-30.189a3.355 3.355 0 0 1 4.746 0l6.483 6.483z" fill="#FFFFFE" fill-rule="evenodd"/></svg>';

    const bookingButton = document.createElement('div');
    bookingButton.innerHTML = `<div class="CareCruButtonIcon">${CalendarSVG}</div><div><strong class="CareCruButtonIconBook">${buttonLabel[0]}</strong> ${buttonLabel[1]}</div>`;
    bookingButton.className = `CareCruFadeIn CareCruButton ${buttonLabel[0]}`;

    // Append at bottom of body
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(bookingButton);
    return bookingButton;
  },
};
