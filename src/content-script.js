async function getCurrentTab() {
  const res = await chrome.runtime.sendMessage({
    messageType: 'getTab',
  });
  return res.data.tab;
}

async function saveMessage(data) {
  const res = await chrome.runtime.sendMessage({
    messageType: 'saveMarker',
    data,
  });
  return res.data;
}

(async function () {
  const curScrollPosnY = window.scrollY;
  const data = {
    pos: curScrollPosnY,
  };
  const res = await saveMessage(data);
  console.log(window.scrollY);
  console.log(res.value);
})();
