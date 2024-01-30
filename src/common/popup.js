import { Events } from '../utils/events.js';
import { Action } from './action.js';

function scrollTo(pos) {
  window.scrollTo({
    top: parseInt(pos),
    left: 0,
    behavior: 'smooth',
  });
}
export class Popup {
  static async #renderDropdown(url, id) {
    const markerEl = document.getElementById('markers-container');
    const tabMarkerInfo = await chrome.runtime.sendMessage({
      messageType: Events.getMarkers,
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
        return chrome.scripting.executeScript({
          target: {
            tabId: id,
          },
          func: scrollTo,
          args: [markersArr[i]],
        });
      });

      // adding delete button to remove the markers
      deleteBtnEl.classList.add('delete-marker-button');
      deleteBtnEl.innerText = 'Delete';
      deleteBtnEl.setAttribute('data-scroll', markersArr[i]);
      deleteBtnEl.addEventListener('click', () => {
        chrome.runtime
          .sendMessage({
            messageType: Events.deleteMarker,
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
            messageType: Events.clearMarkers,
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

  static async displayDropdown() {
    const { id, url } = await Action.getCurrentTab();
    return await this.#renderDropdown(url, id);
  }

  static async updateDropdown({ data }) {
    if (Object.keys(data).length !== 1) {
      return new Promise((_, reject) =>
        reject('Unable to update due to data length not equal 1')
      );
    }
    const { id, url } = await Action.getCurrentTab();
    return await this.#renderDropdown(url, id);
  }
}
