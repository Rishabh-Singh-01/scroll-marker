import { Action } from './common/action.js';
import { Marker } from './common/marker.js';
import { Events } from './utils/events.js';
import { Helper } from './utils/helper.js';

chrome.runtime.onMessage.addListener((request, sender, reply) => {
  if (request.messageType === Events.saveMarker) {
    const pos = Math.floor(request.data.pos);
    const { url } = sender.tab;
    Helper.sendReply(() => Marker.save(url, pos), reply);
  } else if (request.messageType === Events.getMarkers) {
    const { url } = request.data;
    Helper.sendReply(() => Marker.get(url), reply);
  } else if (request.messageType === Events.deleteMarker) {
    const { url, scrollPos } = request.data;
    Helper.sendReply(() => Marker.delete(url, scrollPos), reply);
  } else if (request.messageType === Events.clearMarkers) {
    const { url } = request.data;
    Helper.sendReply(() => Marker.clearAll(url), reply);
  } else {
    Helper.sendReply(
      () => Promise.reject(`No message found with type ${request.messageType}`),
      reply
    );
  }
  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;

  Action.sendMessage('onChangedStorage', changes)
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
});
