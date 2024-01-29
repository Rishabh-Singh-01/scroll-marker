import { Tab } from './tab.js';

function scrollTo(pos) {
  window.scrollTo(0, parseInt(pos));
}

async function renderPopup(url, id) {
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
    btn.setAttribute('data-scroll', markersArr[i]);
    btn.addEventListener('click', (e) => {
      chrome.scripting.executeScript(
        {
          target: {
            tabId: id,
          },
          func: scrollTo,
          args: [markersArr[i]],
        },
        () => console.log('scrolled')
      );
    });
    markersElArr.push(btn);
  }
  markerEl.replaceChildren(...markersElArr);
}

const saveButtonEl = document.getElementById('saveButton');
const showMarkerBtnEl = document.getElementById('showMarkersBtn');

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

async function showMarkerBtnOnClickHandler() {
  const tab = await Tab.getCurrentTab();
  const id = tab.id;
  const url = tab.url;
  renderPopup(url, id);
  // .then(() => reply({ status: 'ok' }))
  // .catch((err) => console.error(err));
}
showMarkerBtnEl.addEventListener('click', () => showMarkerBtnOnClickHandler());

async function updatePopup({ data }) {
  if (Object.keys(data).length !== 1) {
    console.error('More than one updates in local storage');
    return;
  }

  const url = Object.keys(data)[0];
  const tab = await Tab.getCurrentTab();
  await renderPopup(url, tab.id);
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
