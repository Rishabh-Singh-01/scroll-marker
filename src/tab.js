export class Tab {
  static async getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  static async getFromStorage(key) {
    chrome.storage.local.get([key]).then((res) => console.log(res));
  }
}
