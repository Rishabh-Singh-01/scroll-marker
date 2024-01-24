import { Tab } from './tab.js';

const saveButtonEl = document.getElementById('saveButton');

async function execFn(tab) {
  console.log('this is working');
  console.log(window);
  chrome.runtime.sendMessage(
    { messageType: 'saveMarker', tabId: tab.id },
    function (response) {
      console.log(response);
    }
  );
}

async function saveBtnOnClickHandler() {
  const tab = await Tab.getCurrentTab();

  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      // func: execFn,
      // args: [tab],
      files: ['src/content-script.js'],
    });
  } catch (err) {
    console.error(`failed to execute script: ${err}`);
  }
}
saveButtonEl.addEventListener('click', (e) => saveBtnOnClickHandler());
