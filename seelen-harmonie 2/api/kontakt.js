// Vercel Serverless Function: nimmt das Kontaktformular an und verschickt es per Resend.
// Benötigte Umgebungsvariablen in Vercel (Settings → Environment Variables):
//   RESEND_API_KEY  – API-Key von resend.com
//   KONTAKT_AN      – Empfängeradresse (Nicoles Postfach)
//   KONTAKT_VON     – verifizierter Absender, z. B. "Seelen-Harmonie <formular@seelen-harmonie.com>"
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  if (b.website) return res.status(200).json({ ok: true }); // Honeypot: Bots still verwerfen

  const vorname = String(b.vorname || '').trim().slice(0, 100);
  const nachname = String(b.nachname || '').trim().slice(0, 100);
  const email = String(b.email || '').trim().slice(0, 200);
  const anliegen = String(b.anliegen || '').trim().slice(0, 100);
  const nachricht = String(b.nachricht || '').trim().slice(0, 5000);
  if (!vorname || !MAIL.test(email) || !nachricht) return res.status(400).json({ ok: false, fehler: 'Pflichtfelder fehlen' });

  const { RESEND_API_KEY, KONTAKT_AN, KONTAKT_VON } = process.env;
  if (!RESEND_API_KEY || !KONTAKT_AN || !KONTAKT_VON) return res.status(500).json({ ok: false, fehler: 'Versand nicht eingerichtet' });

  const name = `${vorname} ${nachname}`.trim();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: KONTAKT_VON,
      to: [KONTAKT_AN],
      reply_to: email,
      subject: `Anfrage über die Website${anliegen ? ` – ${anliegen}` : ''} (${name})`,
      text: `Name: ${name}\nE-Mail: ${email}\nAnliegen: ${anliegen || '–'}\n\n${nachricht}`,
      html: `<p><strong>Name:</strong> ${esc(name)}<br><strong>E-Mail:</strong> ${esc(email)}<br><strong>Anliegen:</strong> ${esc(anliegen || '–')}</p><p style="white-space:pre-wrap">${esc(nachricht)}</p>`,
    }),
  });
  if (!r.ok) { console.error('Resend', r.status, await r.text()); return res.status(502).json({ ok: false }); }
  return res.status(200).json({ ok: true });
}
