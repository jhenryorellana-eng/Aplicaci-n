import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatDuration } from "@/lib/format";
import type { Episode } from "@/types/domain";

type Props = {
  episode: Episode;
  active?: boolean;
};

export function EpisodeRow({ episode, active = false }: Props) {
  const duration = formatDuration(episode.durationSeconds);

  return (
    <Link
      href={ROUTES.watch(episode.id)}
      className={`group flex items-center gap-3 rounded-xl p-2 transition-colors ${
        active ? "bg-surface-2" : "hover:bg-surface"
      }`}
    >
      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        {episode.thumbnailUrl && (
          <Image
            src={episode.thumbnailUrl}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="size-7 fill-white text-white" aria-hidden />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-sm font-bold text-faint">
            {episode.position}
          </span>
          <h4 className="truncate font-semibold text-foreground">
            {episode.title}
          </h4>
        </div>
        {duration && <p className="mt-0.5 text-xs text-muted">{duration}</p>}
      </div>
    </Link>
  );
}
