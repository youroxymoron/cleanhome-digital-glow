import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getYmId = () => import.meta.env.VITE_YANDEX_METRIKA_ID;

export function YandexMetrika() {
  const location = useLocation();

  useEffect(() => {
    const ymId = getYmId();
    if (!ymId) return;

    if (typeof window === "undefined") return;
    const w = window as unknown as Record<string, unknown>;
    if (w.ym) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${encodeURIComponent(ymId)}','ym');ym(${encodeURIComponent(ymId)},'init',{defer:true,ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const ymId = getYmId();
    if (!ymId || typeof window === "undefined") return;

    const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
    ym?.(Number(ymId), "hit", window.location.href, {
      title: document.title,
      referer: document.referrer,
    });
  }, [location.pathname, location.search]);

  return null;
}

export default YandexMetrika;
