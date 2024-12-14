// ==UserScript==
// @name         LinkedInHelper
// @namespace    http://tampermonkey.net/
// @version      2024-12-13
// @description  try to take over the world!
// @author       You
// @match        https://linkedin.com/*
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==
console.log("We Rockzhang are running on");

async function requestPdf(company, position, manager, city) {
  console.log("Rockzhang ============= send pdf request");

  GM_xmlhttpRequest({
    method: "POST",
    url: "http://localhost:5218/position_info",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      company,
      position,
      manager,
      city,
    }),
    responseType: "blob",
    onload: function (response) {
      const blob = new Blob([response.response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "RockZhang_CoverLetter_" + company + ".pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onerror: function (error) {
      console.error("Error sending request:", error);
    },
  });
}

async function commitInfo() {
  let companyName = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.align-items-center > div.display-flex.align-items-center.flex-1 > div"
  );

  let positionName = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.justify-space-between.flex-wrap.mt2 > div > h1"
  );

  let cityName = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.job-details-jobs-unified-top-card__primary-description-container > div > span:nth-child(1)"
  );

  let hireManager = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div.hirer-card__hirer-information > a > span > span:nth-child(1) > strong"
  );
  hireManager = hireManager ? hireManager.innerText : "Hiring Manager";
  await requestPdf(
    companyName.innerText,
    positionName.innerText,
    hireManager,
    cityName.innerText
  );
  console.log(
    "Rockzhang We get companyName " +
      companyName.innerText +
      " posistion name " +
      positionName.innerText +
      " city name " +
      cityName.innerText +
      " hiring manager " +
      hireManager
  );
}

(function () {
  "use strict";
  console.log("Rockzhang loaded!#559");
  // 创建按钮元素
  const button = document.createElement("div");

  // 设置按钮样式
  button.style.position = "fixed"; // 固定定位
  button.style.right = "20px"; // 距离页面右侧 20px
  button.style.top = "50%"; // 距离页面顶部 50%
  button.style.transform = "translateY(-50%)"; // 垂直居中调整
  button.style.backgroundColor = "#007bff"; // 按钮背景颜色
  button.style.color = "white"; // 按钮文字颜色
  button.style.padding = "10px 20px"; // 按钮内边距
  button.style.borderRadius = "5px"; // 圆角效果
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)"; // 按钮阴影
  button.style.cursor = "pointer"; // 鼠标悬停时显示手型
  button.style.zIndex = "1000"; // 确保按钮浮动在页面内容上方

  // 设置按钮文本
  button.innerText = "CoverLetter";

  // 添加鼠标悬停效果
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#0056b3"; // 悬停时背景变深
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#007bff"; // 恢复原始背景颜色
  });

  // 添加点击事件
  button.addEventListener("click", async () => {
    //await requestPdf("company", "position", "manager", "city");
    await commitInfo();
  });

  // 将按钮添加到页面
  document.body.appendChild(button);
})();
