/**
 * Datos de ejemplo (modo demo, sin Supabase/Mux).
 * Permiten correr y ver la app antes de conectar el backend real.
 * Los videos usan streams HLS públicos de prueba (horizontales): solo
 * sirven para validar la mecánica; el contenido real los reemplaza.
 */
import { EPISODE_STATUS, SECTION_KIND, TIER } from "@/lib/constants";
import type { Episode, FeedClip, Section, Series } from "@/types/domain";

// Streams HLS públicos de prueba.
const HLS = {
  bunny: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  ptsShift: "https://test-streams.mux.dev/pts_shift/master.m3u8",
  // Tercer stream: reutiliza uno confirmado estable (es solo contenido demo).
  bipbop: "https://test-streams.mux.dev/pts_shift/master.m3u8",
} as const;

const poster = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const seedSections: Section[] = [
  {
    id: "sec-ruta",
    slug: "ruta-del-exito",
    title: "La Ruta del Éxito",
    description:
      "El método de Henry, paso a paso. Síguelo en orden desde que llegas.",
    kind: SECTION_KIND.guidedPath,
    position: 1,
  },
  {
    id: "sec-vida",
    slug: "vida-diaria",
    title: "Vida diaria en EE.UU.",
    description: "Lo esencial para moverte y vivir bien desde el día uno.",
    kind: SECTION_KIND.topic,
    position: 2,
  },
  {
    id: "sec-dinero",
    slug: "dinero-y-negocio",
    title: "Dinero y negocio",
    description: "Crédito, impuestos y cómo levantar tu propio negocio.",
    kind: SECTION_KIND.topic,
    position: 3,
  },
];

export const seedSeries: Series[] = [
  // Ruta guiada (en orden)
  {
    id: "ser-30dias",
    sectionId: "sec-ruta",
    slug: "primeros-30-dias",
    title: "Tus primeros 30 días",
    description:
      "Qué hacer apenas llegas: prioridades, errores que debes evitar y tu plan de acción.",
    coverUrl: poster("primeros-30-dias", 800, 1000),
    position: 1,
    requiredTier: TIER.free,
    isPublished: true,
  },
  {
    id: "ser-documentos",
    sectionId: "sec-ruta",
    slug: "documentos-y-estatus",
    title: "Documentos y estatus",
    description:
      "Entiende tus documentos, tu estatus y cómo mantener todo en regla.",
    coverUrl: poster("documentos-y-estatus", 800, 1000),
    position: 2,
    requiredTier: TIER.premium,
    isPublished: true,
  },
  {
    id: "ser-trabajo",
    sectionId: "sec-ruta",
    slug: "tu-primer-trabajo",
    title: "Tu primer trabajo",
    description:
      "Cómo conseguir trabajo, tus derechos laborales y crecer rápido.",
    coverUrl: poster("tu-primer-trabajo", 800, 1000),
    position: 3,
    requiredTier: TIER.premium,
    isPublished: true,
  },
  // Vida diaria
  {
    id: "ser-licencia",
    sectionId: "sec-vida",
    slug: "licencia-de-conducir",
    title: "Licencia de conducir",
    description:
      "Paso a paso para sacar tu licencia: requisitos, examen y consejos.",
    coverUrl: poster("licencia-de-conducir", 800, 1000),
    position: 1,
    requiredTier: TIER.free,
    isPublished: true,
  },
  {
    id: "ser-credito",
    sectionId: "sec-vida",
    slug: "credito-desde-cero",
    title: "Crédito desde cero",
    description:
      "Cómo construir crédito en EE.UU. partiendo de nada, sin caer en trampas.",
    coverUrl: poster("credito-desde-cero", 800, 1000),
    position: 2,
    requiredTier: TIER.premium,
    isPublished: true,
  },
  // Dinero y negocio
  {
    id: "ser-impuestos",
    sectionId: "sec-dinero",
    slug: "impuestos-basicos",
    title: "Impuestos básicos",
    description:
      "Lo que todo inmigrante debe saber sobre taxes para no meterse en problemas.",
    coverUrl: poster("impuestos-basicos", 800, 1000),
    position: 1,
    requiredTier: TIER.premium,
    isPublished: true,
  },
  {
    id: "ser-negocio",
    sectionId: "sec-dinero",
    slug: "abre-tu-negocio",
    title: "Abre tu negocio (LLC)",
    description: "De la idea a tu LLC registrada y operando legalmente.",
    coverUrl: poster("abre-tu-negocio", 800, 1000),
    position: 2,
    requiredTier: TIER.premium,
    isPublished: true,
  },
];

const ep = (
  id: string,
  seriesId: string,
  position: number,
  title: string,
  duration: number,
  url: string,
  thumbSeed: string,
): Episode => ({
  id,
  seriesId,
  title,
  description: null,
  position,
  playbackId: null,
  videoUrl: null,
  durationSeconds: duration,
  thumbnailUrl: poster(thumbSeed, 640, 360),
  status: EPISODE_STATUS.ready,
  isPublished: true,
  demoPlaybackUrl: url,
});

export const seedEpisodes: Episode[] = [
  ep("ep-30d-1", "ser-30dias", 1, "Bienvenido: por dónde empezar", 312, HLS.bunny, "e30d1"),
  ep("ep-30d-2", "ser-30dias", 2, "Las 5 prioridades de tu primera semana", 428, HLS.ptsShift, "e30d2"),
  ep("ep-30d-3", "ser-30dias", 3, "Errores que te cuestan caro", 376, HLS.bipbop, "e30d3"),
  ep("ep-doc-1", "ser-documentos", 1, "Entiende tus documentos", 401, HLS.bunny, "edoc1"),
  ep("ep-doc-2", "ser-documentos", 2, "Mantén tu estatus en regla", 389, HLS.ptsShift, "edoc2"),
  ep("ep-trab-1", "ser-trabajo", 1, "Tu primer trabajo, paso a paso", 455, HLS.bipbop, "etrab1"),
  ep("ep-trab-2", "ser-trabajo", 2, "Tus derechos laborales", 333, HLS.bunny, "etrab2"),
  ep("ep-lic-1", "ser-licencia", 1, "Requisitos y documentos", 298, HLS.ptsShift, "elic1"),
  ep("ep-lic-2", "ser-licencia", 2, "El examen escrito sin miedo", 367, HLS.bipbop, "elic2"),
  ep("ep-cred-1", "ser-credito", 1, "¿Qué es el crédito y por qué importa?", 344, HLS.bunny, "ecred1"),
  ep("ep-cred-2", "ser-credito", 2, "Tu primera tarjeta segura", 401, HLS.ptsShift, "ecred2"),
  ep("ep-imp-1", "ser-impuestos", 1, "Taxes 101 para inmigrantes", 512, HLS.bipbop, "eimp1"),
  ep("ep-neg-1", "ser-negocio", 1, "De la idea a la LLC", 478, HLS.bunny, "eneg1"),
  ep("ep-neg-2", "ser-negocio", 2, "Cuentas, permisos y primeros clientes", 423, HLS.ptsShift, "eneg2"),
];

const clip = (
  id: string,
  series: Series,
  position: number,
  caption: string,
  url: string,
): FeedClip => ({
  id,
  seriesId: series.id,
  seriesSlug: series.slug,
  seriesTitle: series.title,
  playbackId: null,
  videoUrl: null,
  posterUrl: poster(`clip-${id}`, 720, 1280),
  caption,
  position,
  demoPlaybackUrl: url,
});

const byId = (id: string): Series =>
  seedSeries.find((s) => s.id === id) as Series;

export const seedFeedClips: FeedClip[] = [
  clip("clip-1", byId("ser-30dias"), 1, "Lo primero que debes hacer al llegar a EE.UU.", HLS.bunny),
  clip("clip-2", byId("ser-licencia"), 2, "Saca tu licencia sin enredos: empieza por aquí", HLS.ptsShift),
  clip("clip-3", byId("ser-credito"), 3, "Tu crédito desde cero, explicado fácil", HLS.bipbop),
  clip("clip-4", byId("ser-impuestos"), 4, "El error de taxes que cometen casi todos", HLS.bunny),
  clip("clip-5", byId("ser-negocio"), 5, "Abre tu LLC: más simple de lo que crees", HLS.ptsShift),
  clip("clip-6", byId("ser-trabajo"), 6, "Tus derechos en el trabajo que nadie te cuenta", HLS.bipbop),
];
