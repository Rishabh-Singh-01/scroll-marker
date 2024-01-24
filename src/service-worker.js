async function saveMarker(url, pos) {
  await chrome.storage.local.set({
    [url]: pos,
  });
  const val = await chrome.storage.local.get([url]);
  console.log(val[url]);
  return val[url];
}

chrome.runtime.onMessage.addListener((request, sender, reply) => {
  console.log(request);
  console.log(sender);
  if (request.messageType === 'getTab') {
    reply({
      status: 'success',
      data: {
        tab: sender.tab,
      },
    });
  } else if (request.messageType === 'saveMarker') {
    const { pos } = request.data;
    const { url } = sender.tab;
    saveMarker(url, pos).then((res) =>
      reply({
        status: 'success',
        data: {
          value: res,
        },
      })
    );
  }
  return true;
});
