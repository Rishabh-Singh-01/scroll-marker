import { Tab } from './tab.js';

const saveButtonEl = document.getElementById('saveButton');

async function execFn(tab) {
  document.body.style.border = '5px solid green';
  console.log('this is working');
  console.log(window);
  console.log(window.scrollY);
  console.log(tab);
  // chrome.storage.local.get([tab.url], function (items) {
  //   message('get_from_storage', items);
  // });
  // await chrome.storage.local.set({ foo: 'hello' }, function () {
  //   if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
  //   console.log('Settings saved');
  // });
  // chrome.storage.local
  //   .set({ lty_username: username })
  //   .then(() => chrome.storage.local.get(['lty_username']))
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log(error));
}

async function saveBtnOnClickHandler() {
  const tab = await Tab.getCurrentTab();

  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      func: execFn,
      args: [tab],
    });
  } catch (err) {
    console.error(`failed to execute script: ${err}`);
  }
}
saveButtonEl.addEventListener('click', (e) => saveBtnOnClickHandler());
