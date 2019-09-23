
import Push from 'push.js'; // eslint-disable-line import/extensions

const NotificationConfiguration = {
  body: '',
  timeout: 4000,
  icon: '/images/logo_notext.png',
};

export default class DesktopNotification {
  static requestPermission() {
    Push.Permission.request().catch(err => err && console.error(err));
  }

  static showNotification(message, config = {}) {
    Push.create(message, {
      ...NotificationConfiguration,
      ...config,
    });
  }
}
