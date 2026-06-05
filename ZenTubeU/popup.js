const button = document.getElementById("toggleBtn");
const statusText = document.getElementById("statusText");
const statusCard = document.getElementById("statusCard");

const DEFAULT_FOCUS_MODE = true;

chrome.storage.local.get(["focusMode"], (result) => {
  let focusMode = result.focusMode;

  if (focusMode === undefined) {
    focusMode = DEFAULT_FOCUS_MODE;
    chrome.storage.local.set({ focusMode });
  }

  updateButton(focusMode);
});

button.addEventListener("click", () => {
  chrome.storage.local.get(["focusMode"], (result) => {
    const currentFocusMode =
      result.focusMode === undefined ? DEFAULT_FOCUS_MODE : result.focusMode;
    const focusMode = !currentFocusMode;

    chrome.storage.local.set({
      focusMode,
    });

    updateButton(focusMode);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.url?.includes("youtube.com")) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            focusMode,
          },
          () => {
            // Ignore errors when no content script is active on the current page.
            void chrome.runtime.lastError;
          },
        );
      }
    });
  });
});

function updateButton(focusMode) {
  if (focusMode) {
    button.textContent = "Turn Focus Mode Off";
    statusText.textContent = "ON";
    statusText.classList.remove("is-off");
    statusText.classList.add("is-on");
    statusCard.dataset.state = "on";
  } else {
    button.textContent = "Turn Focus Mode On";
    statusText.textContent = "OFF";
    statusText.classList.remove("is-on");
    statusText.classList.add("is-off");
    statusCard.dataset.state = "off";
  }
}
