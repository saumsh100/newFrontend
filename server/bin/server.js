
const http = require('http');
const globals = require('../config/globals');
const app = require('./app');
const Availability = require('../models/Availability');
const Patient = require('../models/Patient');

const server = http.createServer(app);

const io = require('socket.io')(server);

// TODO: implement Thinky!!!
io.on('connection', (socket) => {
  console.log('a new socket connected');
  socket.on('fetchAvailabilities', () => {
    Availability.run()
      .then((availabilities) => {
        socket.emit('receiveAvailabilities', availabilities);
      });
  });
  
  socket.on('fetchPatients', () => {
    Patient.run()
      .then((patients) => {
        socket.emit('receivePatients', patients);
      });
  });
  
  socket.on('addAvailability', (data) => {
    new Availability(data).save().then((availability) => {
      io.sockets.emit('availabilityAdded', availability);
    });
  });
  
  socket.on('removeAvailability', (data) => {
    Availability.get(data.id).then((availability) => {
      availability.delete()
        .then((result) => {
          io.sockets.emit('availabilityRemoved', result);
        });
    });
  });
  
  socket.on('syncClientTrigger', (data) => {
    console.log('sync client triggers!', 'data:', data);
  });
});

server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
});
