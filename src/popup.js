import { Tab } from './tab.js';

async function renderPopup(url) {
  const markerEl = document.getElementById('markers');
  const tabMarkerInfo = await chrome.runtime.sendMessage({
    messageType: 'getMarkerInfo',
    data: {
      url,
    },
  });
  console.log(tabMarkerInfo);
  const markersElArr = [];
  const markersArr = tabMarkerInfo.data.markers;
  for (let i = 0; i < markersArr.length; i++) {
    const btnNo = i + 1;
    const btn = document.createElement('button');
    btn.innerHTML = `Marker ${btnNo}`;
    markersElArr.push(btn);
  }
  markerEl.replaceChildren(...markersElArr);
}

const saveButtonEl = document.getElementById('saveButton');

async function saveBtnOnClickHandler() {
  const tab = await Tab.getCurrentTab();

  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ['src/content-script.js'],
    });
  } catch (err) {
    console.error(`failed to execute script: ${err}`);
  }
}
saveButtonEl.addEventListener('click', (e) => saveBtnOnClickHandler());

async function updatePopup({ data }) {
  if (Object.keys(data).length !== 1) {
    console.error('More than one updates in local storage');
    return;
  }

  const url = Object.keys(data)[0];
  await renderPopup(url);
}

chrome.runtime.onMessage.addListener((request, sender, reply) => {
  if (request.messageType === 'onChangedStorage') {
    console.log('this is onchange event');
    console.log(request.data);
    updatePopup(request)
      .then(() => reply({ status: 'ok' }))
      .catch((err) => console.error(err));
  }
  console.log('this is from popup');
  return true;
});
