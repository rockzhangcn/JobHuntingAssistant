// background.js
function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['apiKey'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.apiKey || null);
      }
    });
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "sendData") {
    const data = message.payload;
    sendResponse({ success: true });
    const apiKey = await getApiKey();
    if (!apiKey) {
      sendResponse({ text: "API key not found." });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => alert("API Key not found")
        });
      });
      return true;
    }

    const response = await fetch("https://languagetojob.com/api/job/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
      })
      .then((blob) => {
        // Convert Blob to ArrayBuffer
        blob.arrayBuffer().then((buffer) => {
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
        sendResponse({ success: false });
      });

    return true;
  }
});
