import React, { useEffect } from "react";

/**
 * Adsterra – Banner Nativo
 * Usa o snippet:
 * <script async data-cfasync="false" src="//pl27547235.revenuecpmgate.com/771ef4cfef8da2cd7cb1ff580e2492fb/invoke.js"></script>
 * <div id="container-771ef4cfef8da2cd7cb1ff580e2492fb"></div>
 */
export default function AdBannerNativo() {
  const containerId = "container-771ef4cfef8da2cd7cb1ff580e2492fb";
  const src = "//pl27547235.revenuecpmgate.com/771ef4cfef8da2cd7cb1ff580e2492fb/invoke.js";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // evita duplicar quando o React re-renderiza
    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = src;

    container.appendChild(script);

    // cleanup ao desmontar
    return () => {
      try {
        container.innerHTML = "";
      } catch {}
    };
  }, []);

  // container onde o Adsterra vai injetar o widget
  return (
    <div
      id={containerId}
      style={{
        width: "100%",
        margin: "12px auto",
        textAlign: "center",
      }}
      aria-label="Publicidade"
    />
  );
}
