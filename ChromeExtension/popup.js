const input = document.getElementById('apiKey');
const saveBtn = document.getElementById('saveBtn');
const updateMenu = document.getElementById('updateMenu');

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      input.value = "********************************"; // Masked display
    }
  });
});

saveBtn.addEventListener('click', () => {
  const apiKey = input.value;
  if (apiKey.trim() === '' || apiKey.length < 10 || apiKey.includes('***')) {
    alert('Please enter a valid API key.');
    return;
  }
  chrome.storage.local.set({ apiKey }, () => {
    alert('Key Saved!');
  });
});

updateMenu.addEventListener('click', () => {
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      fetch('https://languagetojob.com/api/template/all', {
        method: 'GET',
        headers: {
          Authorization:
            "Bearer " + result.apiKey, // 使用从 storage 中获取的 API 密钥
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          chrome.storage.local.set({ TemplatesArray: data.data, userPrefix: data.prefix }, () => {
            console.log("Saved user menus");
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0] && tabs[0].id) {
                chrome.tabs.reload(tabs[0].id, {}, () => {
                  console.log("Current tab reloaded");
                });
              }
            });

          });
        })
        .catch(err => {
          console.error('Fetch failed:', err);
        });
    }
  });
});
