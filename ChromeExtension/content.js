// Add an event listener for keypress
// 查找所有按钮并为每个按钮添加点击事件监听器

document.addEventListener("DOMContentLoaded", () => {
  console.warn("We in the listener");
  let companyName = document.querySelector(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.align-items-center > div.display-flex.align-items-center.flex-1 > div > a"
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

  console.log(
    "We get companyName " +
      companyName.innerText +
      " posistion name " +
      positionName.innerText +
      " city name " +
      cityName.innerText +
      " hiring manager " +
      hireManager.innerText
  );
});

const observeDOM = (selector, callback) => {
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      observer.disconnect(); // 找到元素后停止观察
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

console.warn("We are running in content.js");
// 监听 LinkedIn 页面中的目标元素
observeDOM(
  "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.jobs-search__job-details--container > div > div:nth-child(1) > div > div:nth-child(1) > div > div.relative.job-details-jobs-unified-top-card__container--two-pane > div > div.display-flex.align-items-center > div.display-flex.align-items-center.flex-1 > div > a",
  (element) => {
    console.log("Company Name:", element.innerText);
  }
);
