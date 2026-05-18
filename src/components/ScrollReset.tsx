import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollReset() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
}
