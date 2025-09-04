if (window.hasLinkedExtensionRun) {
  console.log("Content script already injected.");
} else {
  window.hasLinkedExtensionRun = true;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "receiveBlob") {
      const { buffer, mimeType, name } = message;
      if (Array.isArray(buffer)) {
        const arrayBuffer = new Uint8Array(buffer).buffer; // Reconstruct the ArrayBuffer
        // Reconstruct Blob
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        let company_postfix = name.replace(/\s+/g, "_");
        // Trigger download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = window.userPrefix + "_" + company_postfix + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);

        sendResponse({
          success: true,
          message: "Blob processed and file downloaded!",
        });
      } else {
        sendResponse({ success: false, error: "Invalid buffer format." });
      }

      return true; // Allow async response
    }
  });


  chrome.storage.local.get(["TemplatesArray", "userPrefix"], (result) => {
    if (chrome.runtime.lastError) {
      createUI(["Error Occurred", "Please Refresh"]);
    } else {
      const arrOfObjects = result.TemplatesArray || ["No API Key", "Please set in Options"];
      const namesArray = arrOfObjects.map(item => item.name);
      createUI(namesArray);
      window.userPrefix = result.userPrefix || "Please_set_in_Options";
    }
  });

  // 你的脚本逻辑在这里运行
}

async function commitInfo(templateName) {
  let hostName = document.location.hostname;
  if (hostName.indexOf("seek.co") !== -1) {
    commitInfoSeek(templateName);
  } else if (hostName.indexOf("linkedin.com") !== -1) {
    await commitInfoLinkedIn(templateName);
  }
}


async function commitInfoSeek(templateName) {
  const companyName = document.querySelector(
    '[data-automation="advertiser-name"]'
  );

  let positionName = document.querySelector(
    '[data-automation="job-detail-title"]'
  );

  let cityName = document.querySelector(
    '[data-automation="job-detail-location"]'
  );

  let jobDesc = document.querySelector('[data-automation="jobAdDetails"]');

  let hireManager = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div.hirer-card__hirer-information > a > span > span:nth-child(1) > strong"
  );
  hireManager = hireManager ? hireManager.innerText : "Hiring Manager";

  const data = {
    company: companyName.innerText,
    position: positionName.innerText,
    manager: hireManager,
    city: cityName.innerText,
    templateName: templateName,
    jobDesc: jobDesc.innerText,
    source: "seek",
  };

  chrome.runtime.sendMessage(
    { action: "sendData", payload: data },
    (response) => {
    }
  );
}

// Add an event listener for keypress
// 查找所有按钮并为每个按钮添加点击事件监听器
async function commitInfoLinkedIn(templateName) {
  let companyName = document.querySelector(
    ".job-details-jobs-unified-top-card__company-name"
  );

  let positionName = document.querySelector(
    ".job-details-jobs-unified-top-card__job-title"
  );

  let cityName = document.querySelector(
    ".job-details-jobs-unified-top-card__primary-description-container"
  );

  cityName = cityName.querySelectorAll("span")[0];

  let hireManager = document.querySelector(
    ".hirer-card__hirer-information > a"
  );

  hireManager = hireManager ? hireManager.innerText.trim() : "Hiring Manager";

  let jobDesc = document.querySelector("#job-details");

  const data = {
    company: companyName.innerText,
    position: positionName.innerText,
    manager: hireManager,
    city: cityName.innerText,
    templateName: templateName,
    jobDesc: jobDesc.innerText,
    source: "LinkedIn",
  };

  chrome.runtime.sendMessage(
    { action: "sendData", payload: data },
    (response) => {
    }
  );
}

function createUI(menus) {
  let container = document.querySelector("#LinkedinHelper");
  if (container) {
    return;
  }

  const divContainer = document.createElement("div");

  divContainer.id = "LinkedinHelper";
  divContainer.style.position = "fixed"; // 固定定位
  divContainer.style.right = "1.5vh"; // 距离页面右侧 20px
  divContainer.style.top = "50%"; // 距离页面顶部 50%
  divContainer.style.transform = "translateY(-50%)"; // 垂直居中调整
  divContainer.style.backgroundColor = "#AAAAAA33"; // 按钮背景颜色
  divContainer.style.color = "white"; // 按钮文字颜色
  divContainer.style.padding = "10px 20px"; // 按钮内边距
  divContainer.style.borderRadius = "5px"; // 圆角效果
  divContainer.style.zIndex = "1000"; // 确保按钮浮动在页面内容上方
  divContainer.style.display = "flex";
  divContainer.style.flexDirection = "column";
  divContainer.style.gap = "10px"; // 每个按钮之间的间距

  // 创建关闭按钮
  const closeButton = document.createElement("div");
  closeButton.innerText = "X"; // 设置关闭图标
  closeButton.style.position = "absolute"; // 绝对定位
  closeButton.style.top = "0px"; // 距离顶部 10px
  closeButton.style.right = "0px"; // 距离右边 10px
  closeButton.style.transform = "translate(50%, -50%)"; // 垂直居中调整
  closeButton.style.width = "2.0vh"; // 宽度
  closeButton.style.height = "2.0vh"; // 高度
  closeButton.style.padding = "2px"; // 高度
  closeButton.style.fontSize = "0.8rem";
  closeButton.style.borderRadius = "50%"; // 圆形
  closeButton.style.backgroundColor = "#ff4d4f"; // 红色背景
  closeButton.style.color = "white"; // 文字颜色
  closeButton.style.display = "flex"; // 使内容居中
  closeButton.style.justifyContent = "center"; // 水平居中
  closeButton.style.alignItems = "center"; // 垂直居中
  closeButton.style.cursor = "pointer"; // 鼠标悬停时显示手型
  closeButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"; // 按钮阴影

  // 添加鼠标悬停效果
  closeButton.addEventListener("mouseover", () => {
    closeButton.style.backgroundColor = "#ff7875"; // 悬停时背景变浅
  });
  closeButton.addEventListener("mouseout", () => {
    closeButton.style.backgroundColor = "#ff4d4f"; // 恢复原始背景颜色
  });

  // 为关闭按钮添加点击事件
  closeButton.addEventListener("click", () => {
    //divContainer.remove(); // 点击时移除主 div
    let container = document.querySelector("#LinkedinHelper");
    if (container) {
      window.hasLinkedExtensionRun = false;
      container.remove();
    }
  });

  divContainer.appendChild(closeButton);
  menus.forEach((value, index) => {
    const button = document.createElement("div");

    // 设置按钮样式
    button.style.backgroundColor = "#007bff"; // 按钮背景颜色
    button.style.color = "white"; // 按钮文字颜色
    button.style.padding = "10px 20px"; // 按钮内边距
    button.style.borderRadius = "5px"; // 圆角效果
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)"; // 按钮阴影
    button.style.cursor = "pointer"; // 鼠标悬停时显示手型

    // 设置按钮文本
    button.innerText = value;
    // 添加鼠标悬停效果
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#0056b3"; // 悬停时背景变深
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#007bff"; // 恢复原始背景颜色
    });

    button.addEventListener("click", async () => {
      await commitInfo(value);
      //alert("Menu " + value + " is clicked.");
    });

    divContainer.appendChild(button);
  });

  document.body.appendChild(divContainer);
}

