// Tunnel Portal Effect by AROICE
// Triggers on secret key sequences
(function () {
  // --- CONFIG ---
  const REDIRECT_URL = "https://insight.aroice.in";
  const FINAL_BG = "#161618";
  const TRIGGER_SEQUENCES = [
    ["a", "r", "o", "i", "c", "e"],
    ["o", "m", "g"],
    ["w", "t", "f"],
    [" ", " ", " "],
    ["i", "n", "s", "i", "g", "h", "t"]
  ];
  // ---------------

  let keyBuffer = [];
  let portalActive = false;

  // Preload the tunnel video in the background for instant playback
  let tunnelPreload = document.createElement('link');
  tunnelPreload.rel = 'preload';
  tunnelPreload.as = 'video';
  tunnelPreload.href = 'media/tunnel.mp4';
  document.head.appendChild(tunnelPreload);

  function triggerTunnelPortal() {
    if (portalActive) return;
    portalActive = true;

    // 1. Blur the whole page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.classList.add("tunnel-portal-content");
 
    setTimeout(() => {
      document.body.classList.add("tunnel-portal-blur");
    }, 10);

    // 2. Fade in to total black
    const fadeBlack = document.createElement("div");
    fadeBlack.className = "tunnel-portal-fade-black";
    fadeBlack.style.position = "fixed";
    fadeBlack.style.inset = "0";
    fadeBlack.style.background = "#000";
    fadeBlack.style.opacity = "0";
    fadeBlack.style.zIndex = "100010";
    fadeBlack.style.transition = "opacity 0.7s cubic-bezier(.7,0,.3,1)";
    document.body.appendChild(fadeBlack);
    setTimeout(() => {
      fadeBlack.style.opacity = "1";
    }, 60);

    // 3. After fade, play tunnel video fullscreen
    setTimeout(() => {
      // Remove blur for video clarity
      document.body.classList.remove("tunnel-portal-blur");
      // Create video element
      const video = document.createElement("video");
      video.src = "media/tunnel.mp4";
      video.className = "tunnel-portal-video";
      video.style.position = "fixed";
      video.style.inset = "0";
      video.style.width = "100vw";
      video.style.height = "100vh";
      video.style.objectFit = "cover";
      video.style.zIndex = "100011";
      video.style.background = "#000";
      video.autoplay = true;
      video.volume = 0.5;
      video.controls = false;
      video.muted = false;
      video.playsInline = true;
      video.setAttribute("preload", "auto");
      video.setAttribute("tabindex", "-1");
      video.setAttribute("aria-hidden", "true");
      document.body.appendChild(video);
      // Remove black fade
      fadeBlack.style.transition = "opacity 0.5s";
      fadeBlack.style.opacity = "0";
      setTimeout(() => { fadeBlack.remove(); }, 600);
      // 4. On video end, fade to #161618 and redirect
      video.onended = () => {
        const fadeFinal = document.createElement("div");
        fadeFinal.className = "tunnel-portal-fade-final";
        fadeFinal.style.position = "fixed";
        fadeFinal.style.inset = "0";
        fadeFinal.style.background = FINAL_BG;
        fadeFinal.style.opacity = "0";
        fadeFinal.style.zIndex = "100012";
        fadeFinal.style.transition = "opacity 0.7s cubic-bezier(.7,0,.3,1)";
        document.body.appendChild(fadeFinal);
        setTimeout(() => {
          fadeFinal.style.opacity = "1";
        }, 30);
        setTimeout(() => {
          window.location.href = REDIRECT_URL;
        }, 900);
      };
      // Error handling: if video fails to load, fade to #161618 and redirect
      video.onerror = () => {
        const fadeFinal = document.createElement("div");
        fadeFinal.className = "tunnel-portal-fade-final";
        fadeFinal.style.position = "fixed";
        fadeFinal.style.inset = "0";
        fadeFinal.style.background = FINAL_BG;
        fadeFinal.style.opacity = "0";
        fadeFinal.style.zIndex = "100012";
        fadeFinal.style.transition = "opacity 0.7s cubic-bezier(.7,0,.3,1)";
        document.body.appendChild(fadeFinal);
        setTimeout(() => {
          fadeFinal.style.opacity = "1";
        }, 30);
        setTimeout(() => {
          window.location.href = REDIRECT_URL;
        }, 900);
      };
      // Prevent right-click/context menu on video
      video.addEventListener('contextmenu', e => e.preventDefault());
    }, 900);
  }

  // Listen for secret key sequences
  window.addEventListener("keydown", function (e) {
    if (portalActive) return;
    keyBuffer.push(e.key.toLowerCase());
    if (keyBuffer.length > 8) keyBuffer.shift();
    for (const seq of TRIGGER_SEQUENCES) {
      if (keyBuffer.slice(-seq.length).join("") === seq.join("")) {
        triggerTunnelPortal();
        break;
      }
    }
  });

  // Add minimal CSS for blur effect
  const style = document.createElement("style");
  style.innerHTML = `
    .tunnel-portal-content { filter: none; transition: filter 1.1s; }
    .tunnel-portal-blur { filter: blur(12px) brightness(0.6) saturate(1.7); transition: filter 1.1s; }
    .tunnel-portal-fade-black, .tunnel-portal-fade-final { pointer-events: all; }
    .tunnel-portal-video { pointer-events: none; }
  `;
  document.head.appendChild(style);
})();