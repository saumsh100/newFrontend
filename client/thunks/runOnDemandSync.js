
export default function runOnDemandSync() {
  return (getState, dispatch) => {
    const confirmSync = confirm('Would you like to sync with the PMS?');

    // TODO: loading symbol dispatches etc. would be good!
    if (confirmSync) {
      console.log('Running on demand sync...');
      window.socket.emit('onDemandSync');
    }
  };
}
