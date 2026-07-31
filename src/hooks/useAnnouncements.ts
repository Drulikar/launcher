import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useState } from "react";

import { commands, type HubAnnouncement } from "../bindings";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<HubAnnouncement[]>([]);

  const fetchAnnouncements = useCallback(async () => {
    const result = await commands.getAnnouncements();
    if (result.status === "ok") {
      setAnnouncements(result.data);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    const unlisten = listen<HubAnnouncement[]>("announcements-updated", (event) => {
      setAnnouncements(event.payload);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [fetchAnnouncements]);

  return announcements;
}
