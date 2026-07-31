import { useState } from "react";
import Markdown from "react-markdown";

import type { HubAnnouncement } from "../bindings";

interface HubAnnouncementsProps {
  announcements: HubAnnouncement[];
}

export const HubAnnouncements = ({ announcements }: HubAnnouncementsProps) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const maintenance = announcements.filter((a) => a.kind === "maintenance");

  if (maintenance.length === 0) {
    return null;
  }

  return (
    <div className="hub-announcements">
      {maintenance.map((a) => {
        const collapsed = collapsedIds.has(a.id);
        return (
          <div
            key={a.id}
            className="hub-announcement hub-announcement--maintenance"
            onClick={() => toggleCollapse(a.id)}
          >
            <div className="hub-announcement__header">
              <span className="hub-announcement__collapse">{collapsed ? "▸" : "▾"}</span>
              <strong>{a.title}</strong>
              {a.active_until && (
                <span className="hub-announcement__until">
                  {" "}
                  &mdash; until {new Date(a.active_until).toLocaleString()}
                </span>
              )}
            </div>
            {!collapsed && a.body && (
              <div className="hub-announcement__body">
                <Markdown>{a.body}</Markdown>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
