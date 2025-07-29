import { useEffect } from "react";

export function usePreventTabClose(shouldPrevent: boolean) {
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (shouldPrevent) {
        event.preventDefault();
        // event.returnValue = ""; // required for most browsers to show the dialog
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPrevent]);
}
