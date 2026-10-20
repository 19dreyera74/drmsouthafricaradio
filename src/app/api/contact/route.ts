import { NextRequest, NextResponse } from "next/server";
import { sendMail, smtpConfigFromEnv } from "@/lib/smtp";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string; // honeypot — real visitors never fill this in
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, real visitors never see this one.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please fill in your name, a valid email, and a message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@drmsa.org";
  const subject = `New contact form message from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${body.phone || "-"}\n\n${message}`;
  const failed = NextResponse.json(
    { ok: false, error: "Something went wrong sending your message. Please try again or email us directly." },
    { status: 200 }
  );

  // Preferred: send through the drmsa.org mailbox (Afrihost SMTP).
  const smtp = smtpConfigFromEnv();
  if (smtp) {
    try {
      await sendMail(smtp, {
        from: `DRM SA Website <${smtp.user}>`,
        to,
        replyTo: `${name.replace(/[<>"]/g, "")} <${email}>`,
        subject,
        text,
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("SMTP error", err);
      return failed;
    }
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        notConfigured: true,
        error: `The contact form isn't wired to an email provider yet. Please email ${to} directly in the meantime.`,
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "DRM SA Website <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error", res.status, errText);
      return NextResponse.json(
        { ok: false, error: "Something went wrong sending your message. Please try again or email us directly." },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please try again or email us directly." },
      { status: 200 }
    );
  }
}
