import { createRoot } from "react-dom/client";
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

function initAnalytics() {
  const ymId = import.meta.env.VITE_YANDEX_METRIKA_ID;
  if (ymId) {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(m,e,t,y){
        m['yacounters']=m['yacounters']||{};
        m['yacounters'][y]={init:function(){(m['yacounters'][y].a=m['yacounters'][y].a||[]).push(arguments)}};
        m['yacounters'][y].init({
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
        var n=e.getElementsByTagName(t)[0];
        var a=e.createElement(t);
        a.async=true;
        a.src="https://mc.yandex.ru/metrika/tag.js";
        n.parentNode.insertBefore(a,n);
      })(window,document,"script","${ymId}");
    `;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${ymId}" style="position:absolute;left:-9999px" alt="" /></div>`;
    document.body.appendChild(noscript);
  }

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

initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
