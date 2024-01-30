import { Events } from '../utils/events.js';
import { Action } from './action.js';

// Special function as its called like content-script executing fn for active tabs
function scrollTo(pos) {
  window.scrollTo({
    top: parseInt(pos),
    left: 0,
    behavior: 'smooth',
  });
}

export class Popup {
  static #createMarkerBtn(btnNo, scrollPosArgs, tabId) {
    const btn = document.createElement('button');
    btn.classList.add('marker-button');
    btn.innerHTML = `Marker ${btnNo}`;
    btn.addEventListener('click', () => {
      return chrome.scripting.executeScript({
        target: {
          tabId,
        },
        func: scrollTo,
        args: [scrollPosArgs],
      });
    });
    return btn;
  }

  static #createDeleteMarkerBtn(url, scrollPos) {
    const deleteBtnEl = document.createElement('img');
    deleteBtnEl.src = '../public/delete.png';
    deleteBtnEl.classList.add('delete-marker-button');
    deleteBtnEl.innerText = 'Delete';
    deleteBtnEl.addEventListener('click', () =>
      Action.sendMessage(Events.deleteMarker, {
        url,
        scrollPos,
      })
    );
    return deleteBtnEl;
  }

  static #createParentContainer(btn1, btn2) {
    const divEl = document.createElement('div');
    divEl.classList.add('marker-btn-container');
    divEl.insertAdjacentElement('beforeend', btn1);
    divEl.insertAdjacentElement('beforeend', btn2);
    return divEl;
  }

  static #createNoMarkerFoundEl() {
    const noMarkerFoundEl = document.createElement('div');
    noMarkerFoundEl.innerText = 'No Marker Found';
    noMarkerFoundEl.classList.add('no-marker');
    return noMarkerFoundEl;
  }

  static #createClearAllMarkersBtn(url) {
    const clearBtn = document.createElement('button');
    clearBtn.innerText = 'Clear All Markers';
    clearBtn.classList.add('clear-button');
    clearBtn.addEventListener('click', () =>
      Action.sendMessage(Events.clearMarkers, {
        url,
      })
    );
    return clearBtn;
  }

  static async #renderDropdown(url, id) {
    const markerEl = document.getElementById('markers-container');
    const tabMarkerInfo = await Action.sendMessage(Events.getMarkers, {
      url,
    });
    const markersElArr = [];
    const markersArr = tabMarkerInfo.data.markers;

    for (let i = 0; i < markersArr.length; i++) {
      const btn = this.#createMarkerBtn(i + 1, markersArr[i], id);
      const deleteBtn = this.#createDeleteMarkerBtn(url, markersArr[i]);
      const divEl = this.#createParentContainer(btn, deleteBtn);
      markersElArr.push(divEl);
    }

    if (!markersElArr.length) {
      const noMarkerFoundEl = this.#createNoMarkerFoundEl();
      markersElArr.push(noMarkerFoundEl);
    } else {
      const clearBtn = this.#createClearAllMarkersBtn(url);
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
      return Promise.reject('Unable to update due to data length not equal 1');
    }
    const { id, url } = await Action.getCurrentTab();
    return await this.#renderDropdown(url, id);
  }
}
