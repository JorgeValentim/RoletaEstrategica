import { useEffect } from "react";

export default function AdBanner({
  slot = "8827435481",
  format = "auto",
  responsive = "true",
  className = "",
  style,
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // silencioso em dev
    }
  }, [slot]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-8691122863343072"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
