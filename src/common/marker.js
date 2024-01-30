import { Action } from './action.js';

export class Marker {
  /**
   *
   * @param {string} url url of the current active tab
   * @param {boolean} display indicates whether the current info page is displayed or not
   * @param {number[]} markers array to set
   */
  static async #set(url, markers) {
    return Action.setInStorage(url, {
      markers,
    });
  }

  /**
   * @param {number} pos position to add to array in ascending order
   * @param {number[]} markers array in which position is going to get added
   * @returns array with poition added in ascending order, empty in case somthing went wrong
   */
  static async #addNumToMarkerMutate(pos, prevVal) {
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
   * @param {string} url url of the current active tab
   * @returns {{display:boolean,markers:number[]}} info about the current tab
   */
  static async get(url) {
    let prevVal = await Action.getFromStorage(url);
    if (!prevVal)
      prevVal = {
        markers: [],
      };
    return new Promise((resolve) => resolve(prevVal));
  }

  /**
   * @param {url} url url of the current active tab
   * @param {pos} pos total pixels scrolled from the top
   * @returns
   */
  static async save(url, pos) {
    let prevVal = await this.get(url);
    const newMarkers = await this.#addNumToMarkerMutate(pos, prevVal);
    await this.#set(url, newMarkers);
  }

  static async delete(url, scrollPos) {
    const info = await this.get(url);
    if (!info.markers.length)
      return new Promise((_, reject) =>
        reject('No marker found when deleting marker')
      );
    if (!info.markers.includes(scrollPos))
      return new Promise((_, reject) =>
        reject('No marker with this view is found when deleting marker')
      );

    const updatedMarkersArr = info.markers.filter(
      (marker) => marker !== scrollPos
    );

    return this.#set(url, updatedMarkersArr);
    // return new Promise((resolve) => resolve('Marker deleted successfully'));
  }

  static async clearAll(url) {
    return Action.clearFromStorage(url);
  }
}
