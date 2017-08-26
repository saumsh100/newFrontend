
import EventEmitter from 'event-emitter';

let i;
function CareCru(config) {
  this.on('open', () => {
    console.log('heyyyy', i++);
  });
}

CareCru.prototype = Object.create(EventEmitter.prototype);

export default CareCru;
