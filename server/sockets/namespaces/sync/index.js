module.exports = function setupSyncNsp(io) {
  const syncNsp = io.of('/sync');

  syncNsp.on('connection', (socket) => {
    console.log('syncNsp connection');
  });
};
