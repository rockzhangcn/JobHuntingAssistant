chrome.runtime.onInstalled.addListener(() => {
  chrome.scripting.registerContentScripts([
    {
      id: "JobApplyHelper",
      matches: [
        "https://www.linkedin.com/",
        "https://linkedin.com/",
        "https://manyouglobal.com/",
      ], // Replace with the specific website's URL
      js: ["content.js"],
      runAt: "document_end",
    },
  ]);

  console.log("We are running here in background.js");
});
