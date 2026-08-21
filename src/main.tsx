import { hydrateRoot } from "react-dom/client";
import type { DehydratedState } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    VK: {
      init: (config: Record<string, unknown>) => void;
      Go: () => void;
    } | undefined;
  }
}

function initVkPixel() {
  const vkId = import.meta.env.VITE_VK_PIXEL_ID;
  if (vkId) {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(){
        var tag=document.createElement('script');
        tag.src='https://vk.com/js/extensions/pixel.js';
        tag.onload=function(){VK.init({pixel:'${vkId}'});VK.Go()};
        document.head.appendChild(tag);
      })();
    `;
    document.head.appendChild(script);
  }
}

initVkPixel();

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: DehydratedState;
  }
}

hydrateRoot(
  document.getElementById("root")!,
  <App dehydratedState={window.__REACT_QUERY_STATE__} />,
);
