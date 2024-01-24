async function getCurrentTab() {
  const res = await chrome.runtime.sendMessage({
    messageType: 'getTab',
  });
  return res.data.tab;
}

async function saveMarker(data) {
  const res = await chrome.runtime.sendMessage({
    messageType: 'saveMarker',
    data,
  });
  return res.data;
}

(async function () {
  const { url } = await getCurrentTab();
  const curScrollPosnY = window.scrollY;
  const data = {
    url,
    pos: curScrollPosnY,
  };
  const res = await saveMarker(data);
  console.log(url);
  console.log(window.scrollY);
  console.log(res.value);
})();
