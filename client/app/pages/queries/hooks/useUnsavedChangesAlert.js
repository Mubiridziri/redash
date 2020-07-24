import { useRef, useEffect } from "react";
import location from "@/services/location";

export default function useUnsavedChangesAlert(shouldShowAlert = false) {
  const shouldShowAlertRef = useRef();
  shouldShowAlertRef.current = shouldShowAlert;

  useEffect(() => {
    const unloadMessage = "Если вы выйдете, Ваши изменения будут утеряны.";
    const confirmMessage = `${unloadMessage}\n\nВы уверены, что хотите покинуть эту страницу?`;
    // store original handler (if any)
    const savedOnBeforeUnload = window.onbeforeunload;

    window.onbeforeunload = function onbeforeunload() {
      return shouldShowAlertRef.current ? unloadMessage : undefined;
    };

    const unsubscribe = location.confirmChange((nextLocation, currentLocation) => {
      if (shouldShowAlertRef.current && nextLocation.path !== currentLocation.path) {
        return confirmMessage;
      }
    });

    return () => {
      window.onbeforeunload = savedOnBeforeUnload;
      unsubscribe();
    };
  }, []);
}
