chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
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
    const { url, pos } = request.data;
    try {
      await chrome.storage.local.set({
        url: 'one',
      });
    } catch (e) {
      console.error(e);
    }
    const val = await chrome.storage.local.get(['url']);
    console.log(val.url);
    reply({
      status: 'success',
      data: {
        value: val.url,
      },
    });
  }
  return true;
});
