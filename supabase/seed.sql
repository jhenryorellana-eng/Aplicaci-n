-- Datos base para arrancar (idempotente). Ejecutar tras la migración.
-- Las series, episodios y clips se crean desde el panel /admin (necesitan
-- los IDs reales de Mux).

insert into public.sections (slug, title, description, kind, position) values
  ('ruta-del-exito', 'La Ruta del Éxito',
   'El método de Henry, paso a paso. Síguelo en orden desde que llegas.',
   'guided_path', 1),
  ('vida-diaria', 'Vida diaria en EE.UU.',
   'Lo esencial para moverte y vivir bien desde el día uno.', 'topic', 2),
  ('dinero-y-negocio', 'Dinero y negocio',
   'Crédito, impuestos y cómo levantar tu propio negocio.', 'topic', 3)
on conflict (slug) do nothing;

-- Para nombrar al primer administrador (Henry), ejecuta con service_role,
-- reemplazando el UUID por el de su usuario (Authentication → Users):
--   update public.user_roles set role = 'admin' where user_id = '<UUID>';
