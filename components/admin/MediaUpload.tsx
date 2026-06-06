"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "uploading" | "done" | "error";

type Props = {
  /** Nombre del input oculto que recibe la URL pública resultante. */
  name: string;
  label: string;
  /** Carpeta dentro del bucket: "videos" | "posters". */
  folder: string;
  accept?: string;
};

const BUCKET = "media";

/** Sube un archivo a Supabase Storage y deja su URL pública en un input. */
export function MediaUpload({
  name,
  label,
  folder,
  accept = "video/*",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setFileName(file.name);

    const supabase = createSupabaseBrowserClient();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      setStatus("error");
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("done");
  }

  return (
    <div className="space-y-1.5">
      <input type="hidden" name={name} value={url} readOnly />
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-gold/50">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {status === "uploading" ? (
          <Loader2 className="size-5 shrink-0 animate-spin text-gold" aria-hidden />
        ) : status === "done" ? (
          <CheckCircle2 className="size-5 shrink-0 text-gold" aria-hidden />
        ) : status === "error" ? (
          <AlertCircle className="size-5 shrink-0 text-danger" aria-hidden />
        ) : (
          <UploadCloud className="size-5 shrink-0 text-muted" aria-hidden />
        )}
        <span className="min-w-0 flex-1 truncate text-muted">
          {status === "uploading"
            ? `Subiendo ${fileName}…`
            : status === "done"
              ? `Listo: ${fileName}`
              : status === "error"
                ? "Error al subir. Inténtalo de nuevo."
                : label}
        </span>
      </label>
    </div>
  );
}
