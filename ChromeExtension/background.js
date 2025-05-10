chrome.runtime.onInstalled.addListener(() => {
  chrome.scripting.registerContentScripts([
    {
      id: "JobApplyHelper",
      matches: [
        "https://www.linkedin.com/",
        "https://linkedin.com/",
        "https://www.seek.com.au/",
        "https://www.seek.co.nz/",
        "https://manyouglobal.com/",
      ], // Replace with the specific website's URL
      js: ["content.js"],
      runAt: "document_end",
    },
  ]);

  console.log("We are running here in background.js");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    (tab.url.includes("linkedin.com/jobs") || tab.url.includes("seek.co"))
  ) {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"],
      },
      () => console.log("Script injected once.")
    );
  }
});

chrome.action.onClicked.addListener((tab) => {
  console.log("User click the browser icon");
  if (
    tab.url &&
    (tab.url.includes("linkedin.com/jobs") || tab.url.includes("seek.co"))
  ) {
    console.log("Injecting script into:", tab.url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } else {
    console.warn("Active tab is not a valid target:", tab.url);
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "doSomething") {
    console.log("Popup triggered an action.");
    sendResponse({ status: "Action completed" });
  } else if (message.action === "sendData") {
    const data = message.payload;

    // // 转发消息给所有打开的 popup
    // chrome.runtime.sendMessage(message, (response) => {
    //   sendResponse(response); // 返回响应给 content.js
    // });
    // return true; // 表示异步响应
    sendResponse({ success: true });
    const response = await fetch("http://localhost:5218/position_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 设置请求头，声明发送的是 JSON 数据
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Rockzhang Response status:", response.status);
        console.log("Rockzhang Response headers:", [...response.headers]);
        return response.blob();
      })
      .then((blob) => {
        console.log("Rockzhang Blob size:", blob.size); // Should be greater than 0
        console.log("Rockzhang Blob type:", blob.type);

        // Convert Blob to ArrayBuffer
        blob.arrayBuffer().then((buffer) => {
          console.log("Rockzhang ArrayBuffer length:", buffer.byteLength);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "receiveBlob",
                buffer: Array.from(new Uint8Array(buffer)),
                mimeType: blob.type, // Pass Blob's MIME type
                name: data.company,
              });
            }
          });
        });

        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Rockzhang Download failed:", error);
        sendResponse({ success: false });
      });

    // 表示异步响应
    return true;
  }
});
