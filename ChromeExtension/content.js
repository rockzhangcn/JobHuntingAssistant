// Add an event listener for keypress
// 查找所有按钮并为每个按钮添加点击事件监听器
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
  //   await requestPdf(
  //     companyName.innerText,
  //     positionName.innerText,
  //     hireManager,
  //     cityName.innerText
  //   );
  //   console.log(
  //     "Rockzhang We get companyName " +
  //       companyName.innerText +
  //       " posistion name " +
  //       positionName.innerText +
  //       " city name " +
  //       cityName.innerText +
  //       " hiring manager " +
  //       hireManager
  //   );

  console.log("We run start to commit  message");
}

const observer = new MutationObserver(() => {
  let container = document.querySelector("#LinkedinHelper");
  if (!container) {
    createUI();
    console.warn("ROCK UI created.");
  }
});

// 开始监听页面的 DOM 变化
observer.observe(document.body, { childList: true, subtree: true });

function createUI() {
  let container = document.querySelector("#LinkedinHelper");
  if (container) {
    console.warn("UI already exists, skipping creation.");
    return;
  }

  const menus = ["C++", "Full Stack", "FrontEnd(Android)"];

  const divContainer = document.createElement("div");

  divContainer.id = "LinkedinHelper";
  divContainer.style.position = "fixed"; // 固定定位
  divContainer.style.right = "2px"; // 距离页面右侧 20px
  divContainer.style.top = "50%"; // 距离页面顶部 50%
  divContainer.style.transform = "translateY(-50%)"; // 垂直居中调整
  divContainer.style.backgroundColor = "#AAAAAA"; // 按钮背景颜色
  divContainer.style.color = "white"; // 按钮文字颜色
  divContainer.style.padding = "10px 20px"; // 按钮内边距
  divContainer.style.borderRadius = "5px"; // 圆角效果
  divContainer.style.zIndex = "1000"; // 确保按钮浮动在页面内容上方
  divContainer.style.display = "flex";
  divContainer.style.flexDirection = "column";
  divContainer.style.gap = "10px"; // 每个按钮之间的间距

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
      await commitInfo();
    });

    divContainer.appendChild(button);
  });

  document.body.appendChild(divContainer);
}

// createUI();
// const observeDOM = (selector, callback) => {
//   const observer = new MutationObserver(() => {
//     const element = document.querySelector(selector);
//     if (element) {
//       callback(element);
//       observer.disconnect(); // 找到元素后停止观察
//     }
//   });

//   observer.observe(document.body, { childList: true, subtree: true });
// };

// console.warn("We are running in content.js");
// // 监听 LinkedIn 页面中的目标元素
// observeDOM(
//   "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.align-items-center > div.display-flex.align-items-center.flex-1 > div > a",
//   (element) => {
//     console.log("Company Name:", element.innerText);
//   }
// );
