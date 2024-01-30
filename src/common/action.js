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

  static async getFromStorage(key) {
    return chrome.storage.local.get([key]);
  }
}
