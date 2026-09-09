const SUPABASE_URL = "https://saejzjhxarlbdmrgjeuc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZWp6amh4YXJsYmRtcmdqZXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjM1NTgsImV4cCI6MjA5Nzg5OTU1OH0.pG6hVqYmt2CSjxx5iHcz1Hm3DzNGScyP0P4SlP4Qxzo";

function escapeHtml(texto) {
  return String(texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async (request, context) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("r");
  const response = await context.next();

  if (!slug) return response;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/retos?slug=eq.${encodeURIComponent(slug)}&select=titulo,descripcion`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    const reto = data && data[0];
    if (!reto || !reto.titulo) return response;

    const tituloCompleto = escapeHtml(`${reto.titulo} — Jar Jar Green`);
    const descripcion = escapeHtml(
      (reto.descripcion && reto.descripcion.slice(0, 160)) ||
      "Participa en este reto de Jar Jar Green 🌿"
    );

    let html = await response.text();
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${tituloCompleto}</title>`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${tituloCompleto}">`)
      .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${descripcion}">`);

    return new Response(html, { status: response.status, headers: response.headers });
  } catch (e) {
    return response;
  }
};

export const config = { path: "/reto.html" };
