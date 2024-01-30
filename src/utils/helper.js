import { Status } from './status.js';

export class Helper {
  static sendReply(fn, reply) {
    fn()
      .then((data) => {
        reply({
          status: Status.success,
          data,
        });
      })
      .catch((err) => {
        reply({
          status: Status.fail,
          error: err,
        });
      });
  }
}
