import { useState } from "react";

// Dish photos are hosted on third-party sites and can disappear. Instead of a
// broken-image icon, fall back to a neutral placeholder.
const FALLBACK_SRC =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'>" +
      "<rect width='640' height='480' fill='#f1e6d8'/>" +
      "<text x='320' y='270' font-size='110' text-anchor='middle'>🍲</text></svg>"
  );

export default function FoodImage({ src, alt, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const useFallback = !src || failedSrc === src;
  return <img src={useFallback ? FALLBACK_SRC : src} alt={alt} onError={() => setFailedSrc(src)} {...props} />;
}
