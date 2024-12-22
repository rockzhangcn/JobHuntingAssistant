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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "sendToPopData") {
    console.log("Message received in popup:", message.data);

    // 回复背景脚本，告知消息已成功处理
    sendResponse({ success: true });

    const response = await fetch("http://localhost:5218/position_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 设置请求头，声明发送的是 JSON 数据
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        const blob = new Blob([response.response], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "RockZhang_CoverLetter_" + data.company + ".pdf";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });

    // 表示异步响应
    return true;
  }
});
