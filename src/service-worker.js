/**
 *
 * @param {string} url url of the current active tab
 * @returns {{display:boolean,markers:number[]}} info about the current tab
 */
async function getCurrentTabInfo(url) {
  return new Promise((resolve, reject) => {
    console.log(chrome.storage.local);
    const key = [url];
    chrome.storage.local.get(key, function (item) {
      console.log(item);
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
        return;
      } else {
        // const len = Object.keys(item).length;
        // if (!len) {
        //   const prevVal = {};
        //   prevVal.display = false;
        //   prevVal.markers = [];
        //   resolve(prevVal);
        //   return;
        // }
        resolve(item[url]);
        return;
      }
    });
  });
}

/**
 *
 * @param {string} url url of the current active tab
 * @param {boolean} display indicates whether the current info page is displayed or not
 * @param {number[]} markers array to set
 */
async function setCurrentTabInfo(url, display, markers) {
  await chrome.storage.local.set({
    [url]: {
      display,
      markers,
    },
  });
}

/**
 *
 * @param {number} pos position to add to array in ascending order
 * @param {number[]} markers array in which position is going to get added
 * @returns array with poition added in ascending order, empty in case somthing went wrong
 */
async function addNumToMarkerMutate(pos, prevVal) {
  return new Promise((resolve) => {
    const markers = prevVal.markers;
    const markersLen = markers.length;
    if (!markersLen) {
      const arr = [];
      arr.push(pos);
      resolve(arr);
      return;
    }
    if (pos > markers[markersLen - 1]) {
      markers.push(pos);
      resolve(markers);
      return;
    }
    if (pos < markers[0]) {
      markers.unshift(pos);
      resolve(markers);
      return;
    }
    for (let i = 0; i < markersLen - 1; i++) {
      if (pos === markers[i] || pos === markers[i + 1]) {
        resolve(markers);
        return;
      }
      if (pos > markers[i] && pos < markers[i + 1]) {
        markers.splice(i + 1, 0, pos);
        resolve(markers);
        return;
      }
    }
    resolve([]);
    return;
  });
}

/**
 *
 * @param {url} url url of the current active tab
 * @param {pos} pos total pixels scrolled from the top
 * @returns
 */
async function saveMarker(url, pos) {
  let prevVal = await getCurrentTabInfo(url);
  if (!prevVal)
    prevVal = {
      display: false,
      markers: [],
    };
  console.log(prevVal);
  const newMarkers = await addNumToMarkerMutate(pos, prevVal);
  await setCurrentTabInfo(url, prevVal.display, newMarkers);

  // const val = await chrome.storage.local.get([url]);
  // console.log(val[url]);
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
    const pos = Math.floor(request.data.pos);
    const { url } = sender.tab;
    saveMarker(url, pos)
      .then(() =>
        reply({
          status: 'success',
        })
      )
      .catch((err) =>
        reply({
          status: 'fail',
          error: err,
        })
      );
  }
  return true;
});
