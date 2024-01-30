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
  return await saveMessage(data);
})();
