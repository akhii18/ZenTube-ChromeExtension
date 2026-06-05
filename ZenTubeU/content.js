const DEFAULT_FOCUS_MODE = true;
let currentFocusMode = DEFAULT_FOCUS_MODE;
let applyFocusModeTimeout;

function enableFocusMode() {
  // Hide sidebar recommendations
  const secondary = document.getElementById("secondary");

  if (secondary) {
    secondary.style.display = "none";
  }

  // Hide comments
  const comments = document.getElementById("comments");

  if (comments) {
    comments.style.display = "none";
  }

  // Hide shorts
  const shorts = document.querySelectorAll("ytd-reel-shelf-renderer");

  shorts.forEach((item) => {
    item.style.display = "none";
  });
}

function disableFocusMode() {
  const secondary = document.getElementById("secondary");

  if (secondary) {
    secondary.style.display = "block";
  }

  const comments = document.getElementById("comments");

  if (comments) {
    comments.style.display = "block";
  }

  const shorts = document.querySelectorAll("ytd-reel-shelf-renderer");

  shorts.forEach((item) => {
    item.style.display = "block";
  });
}

function applyFocusMode(focusMode) {
  currentFocusMode = focusMode;

  if (focusMode) {
    enableFocusMode();
  } else {
    disableFocusMode();
  }
}

function scheduleApplyFocusMode() {
  clearTimeout(applyFocusModeTimeout);
  applyFocusModeTimeout = setTimeout(() => {
    applyFocusMode(currentFocusMode);
  }, 120);
}

/* LOAD SAVED MODE */

chrome.storage.local.get(["focusMode"], (result) => {
  let focusMode = result.focusMode;

  if (focusMode === undefined) {
    focusMode = DEFAULT_FOCUS_MODE;
    chrome.storage.local.set({ focusMode });
  }

  applyFocusMode(focusMode);
});

/* LISTEN FOR BUTTON CLICK */

chrome.runtime.onMessage.addListener((message) => {
  if (typeof message.focusMode === "boolean") {
    applyFocusMode(message.focusMode);
  }
});

// YouTube is a single-page app; re-apply mode after dynamic updates/navigation.
const observer = new MutationObserver(() => {
  scheduleApplyFocusMode();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
