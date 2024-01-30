export class Action {
  static async sendMessage(type, data) {
    return chrome.runtime.sendMessage({
      messageType: type,
      data,
    });
  }

  static async getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  /**
   * @param {string} url url of the current active tab
   * @returns {{display:boolean,markers:number[]} | undefined} info about the current tab
   */
  static async getFromStorage(key) {
    const k = [key];
    const item = await chrome.storage.local.get(k);
    return item[key];
  }

  static async setInStorage(url, data) {
    return chrome.storage.local.set({
      [url]: data,
    });
  }

  static async clearFromStorage(key) {
    return chrome.storage.local.remove(key);
  }
}
