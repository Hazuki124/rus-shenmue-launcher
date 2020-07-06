export default class Notificator {
  static notify(title: string, body: string) {
    try {
      new Notification(title, {
        body
      });
    } catch (e) {
      // do nothing
    }
  }
}
