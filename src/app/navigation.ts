import { useEffect, useState } from "react";

export type AppPath = "/" | "/planner" | "/map" | "/trips" | "/alerts";
export type Navigate = (path: AppPath) => void;

const paths: AppPath[] = ["/", "/planner", "/map", "/trips", "/alerts"];

export function useRoute(): [AppPath, Navigate] {
  const readPath = (): AppPath => {
    const path = window.location.pathname as AppPath;
    return paths.includes(path) ? path : "/";
  };
  const [path, setPath] = useState<AppPath>(readPath);

  useEffect(() => {
    const handlePopState = () => setPath(readPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate: Navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [path, navigate];
}
