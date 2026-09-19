import { useState } from "react";

export function useShareJourney(title: string, text: string) {
  const [shared, setShared] = useState(false);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, text, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2500);
    } catch { setShared(false); }
  };
  return { shared, share };
}
