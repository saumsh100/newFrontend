import createCallsSub from './Calls';

export default function createRabbitSub(context, io) {
  context.on('ready', () => {
    // Here we'll add more subs for other routes
    createCallsSub(context, io);
  });
}
