import { Popup } from './common/popup.js';
import { Events } from './utils/events.js';
import { Status } from './utils/status.js';
import { Action } from './common/action.js';

const saveMarkerButtonEl = document.getElementById('save-marker-button');

const showMarkerBtnEl = document.getElementById('show-markers-button');
showMarkerBtnEl.addEventListener('click', () => Popup.displayDropdown());

async function saveBtnOnClickHandler() {
  const tab = await Action.getCurrentTab();
  return chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    files: ['src/content-scripts/save-message.js'],
  });
}
saveMarkerButtonEl.addEventListener('click', () => saveBtnOnClickHandler());

chrome.runtime.onMessage.addListener((request, sender, reply) => {
  if (request.messageType === Events.onChangedStorage) {
    Popup.updateDropdown(request)
      .then(() => reply({ status: Status.success }))
      .catch((err) => console.error(err));
  }
  return true;
});
