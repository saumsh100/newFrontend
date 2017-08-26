
/**
 * Vanilla JS Modal
 *
 * @param modalBody
 * @constructor
 */
function Modal({ modalBody }) {
  const overlay = document.createElement('div');
  overlay.className = 'CareCruModal';

  const inner = document.createElement('div');
  inner.className = 'CareCruModalInner';

  const body = document.getElementsByTagName('body')[0];

  inner.appendChild(modalBody);
  overlay.appendChild(inner);
  body.appendChild(overlay);

  this.overlay = overlay;
  this.inner = inner;
}

Modal.prototype.open = function() {
  this.overlay.className = `${this.overlay.className} active`;
  this.inner.className = `${this.inner.className} active`;
};

Modal.prototype.close = function() {
  this.overlay.className = this.overlay.className.replace('active', '');
  this.inner.className = this.inner.className.replace('active', '');
};

export default Modal;
