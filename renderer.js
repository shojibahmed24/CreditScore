document.addEventListener('DOMContentLoaded', () => {
  const monitorBtn = document.getElementById('monitorBtn');

  if (!monitorBtn) {
    console.error("monitorBtn not found!");
    return;
  }

  monitorBtn.onclick = async () => {
    console.log("Start Monitoring");
    try {
      const sources = await window.electronAPI.getDesktopSources();
      console.log("Screen Sources:", sources);
      const videoElement = document.getElementById('video');

      if (sources.length > 0) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[0].id,
            }
          }
        });
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (err) {
      console.error("স্ক্রিন ক্যাপচার ত্রুটি:", err);
    }
  };
});
