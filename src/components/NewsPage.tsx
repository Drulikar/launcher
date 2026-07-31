import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

import type { HubAnnouncement } from "../bindings";
import { useSettingsStore } from "../stores";

function truncateBody(body: string, maxLines = 3): string {
  return body.split("\n").slice(0, maxLines).join("\n");
}

interface NewsPageProps {
  announcements: HubAnnouncement[];
}

export const NewsPage = ({ announcements }: NewsPageProps) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const news = announcements.filter((a) => a.kind === "announcement");
  const saveLastRead = useSettingsStore((s) => s.saveLastReadAnnouncement);

  useEffect(() => {
    if (news.length > 0) {
      saveLastRead(news[0].id);
    }
  }, [news[0]?.id]);

  return (
    <div className="news-page">
      {news.length === 0 && <div className="news-empty">{t("news.empty")}</div>}
      {news.map((a) => {
        const expanded = expandedId === a.id;
        const needsTruncation = a.body.split("\n").length > 3;

        return (
          <div key={a.id} className="news-item">
            <div className="news-item__header">
              <span className="news-item__title">{a.title}</span>
              <span className="news-item__date">
                {new Date(a.active_from).toLocaleDateString()}
              </span>
            </div>
            {a.body && (
              <div className="news-item__body">
                <Markdown>{expanded || !needsTruncation ? a.body : truncateBody(a.body)}</Markdown>
                {needsTruncation && (
                  <button
                    type="button"
                    className="news-item__toggle"
                    onClick={() => setExpandedId(expanded ? null : a.id)}
                  >
                    {expanded ? t("news.showLess") : t("news.readMore")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
