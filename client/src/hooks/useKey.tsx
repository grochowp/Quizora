import { useEffect } from "react";

type ActionFunction = () => void;

export function useKey(action: ActionFunction, key: string) {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.code?.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [action, key]);
}
