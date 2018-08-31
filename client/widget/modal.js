
/**
 * Vanilla JS Modal
 * @constructor
 */

function Modal() {
  const overlay = document.createElement('div');
  overlay.className = 'CareCruModal';

  const inner = document.createElement('div');
  inner.className = 'CareCruModalInner';

  const spinner = document.createElement('div');
  spinner.className = 'CareCruSpinner';
  spinner.innerHTML =
    '<div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><span>Loading</span>';

  inner.appendChild(spinner);

  const body = document.getElementsByTagName('body')[0];

  overlay.appendChild(inner);
  body.appendChild(overlay);

  this.overlay = overlay;
  this.inner = inner;
}

Modal.prototype.open = function () {
  const oc = this.overlay.className;
  const ic = this.inner.className;
  const overlayAlreadyActive = oc.indexOf('CareCruActive') > -1;
  const innerAlreadyActive = ic.indexOf('CareCruActive') > -1;
  this.overlay.className = overlayAlreadyActive ? oc : `${oc} CareCruActive`;
  this.inner.className = innerAlreadyActive ? ic : `${ic} CareCruActive`;
  document.documentElement.style.setProperty('overflow', 'hidden');
  document.documentElement.style.setProperty('position', 'fixed');
  document.documentElement.style.setProperty('left', '0');
  document.documentElement.style.setProperty('right', '0');
  document.documentElement.style.setProperty('top', '0');
  document.documentElement.style.setProperty('bottom', '0');
};

Modal.prototype.close = function () {
  this.overlay.className = this.overlay.className.replace(' CareCruActive', '');
  this.inner.className = this.inner.className.replace(' CareCruActive', '');
  document.documentElement.style.setProperty('overflow', '');
  document.documentElement.style.setProperty('position', '');
};

export default Modal;
