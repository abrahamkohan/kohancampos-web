import { NextRequest, NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE = process.env.AIRTABLE_BASE
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL
const GUIDE_URL = process.env.GUIDE_URL



export async function POST(req: NextRequest) {
  try {
    const { name, email, country, budget, message } = await req.json()

    // 1. Guardar en Airtable
    const airtableRes = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Nombre: name,
          Email: email,
          País: country,
          "Capital Disponible": budget,
          Mensaje: message,
        },
      }),
    })

    if (!airtableRes.ok) {
      const err = await airtableRes.json()
      console.error("Airtable error:", err)
      return NextResponse.json({ error: "Airtable error" }, { status: 500 })
    }

    // 2. Enviar mail al lead con la guía
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `PY Advisors <${FROM_EMAIL}>`,
        to: [email],
        subject: "Tu Guía del Inversor en Paraguay 📩",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Guía del Inversor en Paraguay</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a2e;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 0 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #0F1D35; border-radius: 8px 8px 0 0; overflow: hidden;">
                      <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px;">
                          <img src="https://kohancampos.com.py/logo-hero.svg" alt="Kohan & Campos" width="180" style="display: block; height: auto; border: 0;" />
                        </td>
                      </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td style="color: #0F1D35; font-size: 24px; font-weight: 300; letter-spacing: -0.02em; padding-bottom: 20px;">
                          Hola ${name},
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #4b5563; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
                          Gracias por confiar en nosotros. Tal como prometimos, aquí tienes el acceso a tu material exclusivo sobre el mercado paraguayo.
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 30px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color: #C9B99A; border-radius: 2px;">
                            <tr>
                              <td align="center">
                                <a href="${GUIDE_URL}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #0F1D35; text-decoration: none; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                                  Descargar Guía del Inversor PDF
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #4b5563; font-size: 15px; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 30px;">
                          Nuestro equipo se pondrá en contacto con usted en las próximas <strong>24 horas</strong> para conversar sobre sus objetivos de inversión y responder cualquier inquietud inicial.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 40px; text-align: center;">
                          <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 8px;">
                            Kohan & Campos Real Estate
                          </p>
                          <p style="margin: 0; color: #0F1D35; font-size: 14px; font-weight: 600;">
                            Decisiones inmobiliarias con criterio, no con impulso.
                          </p>
                          <div style="padding-top: 20px;">
                            <a href="https://kohancampos.com.py" style="color: #C9B99A; font-size: 13px; text-decoration: none; font-weight: 500;">kohancampos.com.py</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                        <td style="padding: 30px 40px; color: #9ca3af; font-size: 11px; text-align: center; line-height: 1.5;">
                          Si tienes alguna pregunta antes de que te contactemos, simplemente responde a este correo electrónico. Estamos aquí para ayudarte.<br><br>
                          © 2026 Kohan & Campos · Asunción, Paraguay.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.json()
      console.error("Resend error:", err)
      // No bloqueamos la respuesta si falla el mail, el lead ya quedó guardado
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
