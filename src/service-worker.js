import { Action } from './common/action.js';
import { Marker } from './common/marker.js';
import { Status } from './utils/status.js';
import { Events } from './utils/events.js';

chrome.runtime.onMessage.addListener((request, sender, reply) => {
  if (request.messageType === Events.saveMarker) {
    const pos = Math.floor(request.data.pos);
    const { url } = sender.tab;
    Marker.save(url, pos)
      .then((i) => {
        return reply({
          status: Status.success,
        });
      })
      .catch((err) =>
        reply({
          status: Status.fail,
          error: err,
        })
      );
  } else if (request.messageType === Events.getMarkers) {
    const { url } = request.data;
    Marker.get(url)
      .then((data) =>
        reply({
          status: Status.success,
          data,
        })
      )
      .catch((err) =>
        reply({
          status: Status.fail,
          error: err,
        })
      );
  } else if (request.messageType === Events.deleteMarker) {
    const { url, scrollPos } = request.data;
    Marker.delete(url, scrollPos)
      .then((data) =>
        reply({
          status: Status.success,
          data,
        })
      )
      .catch((err) =>
        reply({
          status: Status.fail,
          error: err,
        })
      );
  } else if (request.messageType === Events.clearMarkers) {
    const { url } = request.data;
    Marker.clearAll(url)
      .then((data) =>
        reply({
          status: Status.success,
          data,
        })
      )
      .catch((err) =>
        reply({
          status: Status.fail,
          error: err,
        })
      );
  } else {
    reply({
      status: Status.fail,
      error: `No message found with type ${request.messageType}`,
    });
  }
  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  console.log(changes);
  console.log(area);
  if (area !== 'local') return;

  Action.sendMessage('onChangedStorage', changes)
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
});
