export default function runOnDemandSync(e) {
  e.preventDefault();
  alert('Would you like to sync with the PMS?');
  window.socket.emit('onDemandSync');
}
