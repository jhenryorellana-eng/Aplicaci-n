/**
 * Información de servicios de USA Latino Prime (proyecto APARTE).
 * Solo enlazamos hacia ellos con un clic — no unimos los proyectos.
 * Datos extraídos de E:\Usalatino primer\henryflow.
 * Nota: no mostramos precios aquí; el detalle/precio vive en su sitio.
 */

export const USALATINO = {
  // Configurable por env; por defecto el dominio de marca.
  url: process.env.NEXT_PUBLIC_USALATINO_URL ?? "https://usalatinoprime.com",
  phone: "801-941-3479",
  phoneHref: "tel:+18019413479",
  whatsappHref: "https://wa.me/18019413479",
} as const;

export interface Service {
  slug: string;
  name: string;
  description: string;
  /** Servicios destacados en el funnel del video de Mérito. */
  highlight?: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "reforzar-asilo",
    name: "Reforzamiento de Asilo",
    description:
      "Refuerza tu declaración, evidencias y miedo creíble, guiado paso a paso.",
    highlight: true,
  },
  {
    slug: "apelacion-bia",
    name: "Apelación (BIA)",
    description: "Arma tu apelación ante la Junta (EOIR-26) sin perderte.",
    highlight: true,
  },
  {
    slug: "mociones-corte",
    name: "Mociones ante Corte",
    description:
      "Prepara tu moción para reabrir, reconsiderar o cambiar de corte.",
  },
  {
    slug: "asilo-politico",
    name: "Asilo Político (I-589)",
    description: "Llena y entiende tu I-589 desde el inicio, a tu ritmo.",
  },
  {
    slug: "ajuste-estatus",
    name: "Ajuste de Estatus",
    description: "Tu Green Card paso a paso: matrimonio, familia, empleo o asilo.",
  },
  {
    slug: "visa-juvenil",
    name: "Visa Juvenil (SIJS)",
    description: "Para menores víctimas de abuso o abandono: te guía a la SIJS.",
  },
];
