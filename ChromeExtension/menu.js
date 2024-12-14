const menus = ["C++", "Full Stack", "FrontEnd(Android)"];

const divContainer = document.createElement("div");

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

  divContainer.appendChild(button);
});

document.body.appendChild(divContainer);
