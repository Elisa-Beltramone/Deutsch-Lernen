// Time traker

let startTime = Date.now();

function sendTime() {
  const duration = Date.now() - startTime;

  navigator.sendBeacon("/api/track-time", JSON.stringify({
    page: window.location.pathname,
    duration: duration
  }));
}

window.addEventListener("beforeunload", sendTime);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendTime();
  }
});