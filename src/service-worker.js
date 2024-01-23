importScripts('src/tab.js');
chrome.runtime.onMessage.addListener((some) => console.log(some));
