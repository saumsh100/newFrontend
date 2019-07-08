
import Push from 'push.js';

const NotificationConfiguration = {
  body: '',
  timeout: 4000,
  icon: '/images/logo_notext.png',
};

export default class DesktopNotification {
  static requestPermission() {
    Push.Permission.request().catch(console.error);
  }

  static showNotification(message, config = {}) {
    Push.create(message, {
      ...NotificationConfiguration,
      ...config,
    });
  }
}
