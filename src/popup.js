const saveButtonEl = document.getElementById('saveButton');

async function getCurrentTab() {
  let wind = await chrome.windows.getCurrent();
  let queryOptions = { active: true, windowId: wind.id };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function saveBtnOnClickHandler() {
  let tab = await getCurrentTab();
  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      func: () => {
        document.body.style.border = '5px solid green';
        console.log('this is working');
        console.log(window);
        console.log(window.scrollY);
      },
    });
  } catch (err) {
    console.error(`failed to execute script: ${err}`);
  }
}
saveButtonEl.addEventListener('click', (e) => saveBtnOnClickHandler());
