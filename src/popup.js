import { Tab } from './tab.js';

const saveMarkerButtonEl = document.getElementById('save-marker-button');
const showMarkerBtnEl = document.getElementById('show-markers-button');

function scrollTo(pos) {
  window.scrollTo(0, parseInt(pos));
}

async function renderPopup(url, id) {
  const markerEl = document.getElementById('markers-container');
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
    const divEl = document.createElement('div');
    divEl.classList.add('marker-btn-container');
    const btn = document.createElement('button');
    const deleteBtnEl = document.createElement('img');
    deleteBtnEl.src = '../public/delete.png';
    btn.classList.add('marker-button');
    btn.innerHTML = `Marker ${btnNo}`;
    btn.setAttribute('data-scroll', markersArr[i]);
    btn.addEventListener('click', () => {
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

    // adding delete button to remove the markers
    deleteBtnEl.classList.add('delete-marker-button');
    deleteBtnEl.innerText = 'Delete';
    deleteBtnEl.setAttribute('data-scroll', markersArr[i]);
    deleteBtnEl.addEventListener('click', () => {
      chrome.runtime
        .sendMessage({
          messageType: 'deleteMarker',
          data: {
            url,
            scrollPos: markersArr[i],
          },
        })
        .then((res) => console.log(res))
        .catch((e) => console.error(e));
    });
    divEl.insertAdjacentElement('beforeend', btn);
    divEl.insertAdjacentElement('beforeend', deleteBtnEl);

    // adding the tbn to markersElArr
    markersElArr.push(divEl);
  }
  let noMarkerFoundFlag = false;
  if (!markersElArr.length) {
    const noMarkerFoundEl = document.createElement('div');
    noMarkerFoundEl.innerText = 'No Marker Found';
    noMarkerFoundEl.classList.add('no-marker');
    markersElArr.push(noMarkerFoundEl);
    noMarkerFoundFlag = true;
  }

  // adding clear the whole webpage markers
  if (!noMarkerFoundFlag) {
    const clearBtn = document.createElement('button');
    clearBtn.innerText = 'Clear All Markers';
    clearBtn.classList.add('clear-button');
    clearBtn.addEventListener('click', () => {
      chrome.runtime
        .sendMessage({
          messageType: 'clearMarkers',
          data: {
            url,
          },
        })
        .then((res) => console.log(res))
        .catch((e) => console.error(e));
    });
    markersElArr.push(clearBtn);
  }

  markerEl.replaceChildren(...markersElArr);
}

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
saveMarkerButtonEl.addEventListener('click', (e) => saveBtnOnClickHandler());

async function showMarkerBtnOnClickHandler() {
  const tab = await Tab.getCurrentTab();
  const id = tab.id;
  const url = tab.url;
  renderPopup(url, id);
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
