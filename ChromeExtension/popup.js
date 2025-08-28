document.getElementById("actionButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      },
      () => {
        console.log("Content script injected.");
      }
    );
  });

  // 向 background.js 发送消息
  chrome.runtime.sendMessage({ action: "doSomething" }, (response) => {
    document.getElementById("status").innerText = `Inject success`;
  });
});

