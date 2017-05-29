
import jwt from 'jwt-decode';

export default function connectSocketToStore(socket) {
  const jwtToken = localStorage.getItem('token');
  const decodedToken = jwt(jwtToken);
  console.log(`[INFO] account=${decodedToken.activeAccountId}`);
  console.log('[INFO] jwt token: ', jwtToken);

  socket
    .emit('authenticate', {token: jwtToken})
    .on('authenticated', () => {
      console.log('Socket connected and authenticated');
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
}
