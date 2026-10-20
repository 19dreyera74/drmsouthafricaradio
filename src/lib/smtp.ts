import tls from "node:tls";

// Minimal SMTP client for sending the contact form through the drmsa.org
// mailbox (implicit TLS, usually port 465, with AUTH LOGIN). It covers just
// what one plain-text message needs, so the site needs no mail dependency.

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

export type MailMessage = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export function smtpConfigFromEnv(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return { host: SMTP_HOST, port: Number(SMTP_PORT) || 465, user: SMTP_USER, pass: SMTP_PASS };
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

// RFC 2047 encoded-word, so names and subjects with accents survive.
const encodeHeader = (s: string) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);

// Strips CR/LF so visitor input can never add extra headers.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function buildMessage(msg: MailMessage, domain: string) {
  const headers = [
    `From: ${oneLine(msg.from)}`,
    `To: ${oneLine(msg.to)}`,
    ...(msg.replyTo ? [`Reply-To: ${oneLine(msg.replyTo)}`] : []),
    `Subject: ${encodeHeader(oneLine(msg.subject))}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];
  const body = b64(msg.text.replace(/\r?\n/g, "\r\n")).replace(/.{1,76}/g, "$&\r\n");
  return `${headers.join("\r\n")}\r\n\r\n${body}`;
}

const address = (s: string) => s.match(/<([^>]+)>/)?.[1] ?? s.trim();

export function sendMail(config: SmtpConfig, msg: MailMessage, timeoutMs = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: config.host, port: config.port, servername: config.host });
    socket.setEncoding("utf8");
    socket.setTimeout(timeoutMs, () => fail(new Error("SMTP timeout")));

    let buffer = "";
    let waiting: ((code: number, text: string) => void) | null = null;
    let done = false;

    function fail(err: Error) {
      if (done) return;
      done = true;
      socket.destroy();
      reject(err);
    }

    // A reply ends on a line like "250 OK"; "250-..." lines are continuations.
    function drain() {
      if (!waiting) return;
      const lines = buffer.split("\r\n");
      const last = lines.slice(0, -1).reverse().find((l) => /^\d{3} /.test(l));
      if (!last) return;
      const cb = waiting;
      waiting = null;
      buffer = "";
      cb(Number(last.slice(0, 3)), last);
    }
    socket.on("data", (chunk: string) => {
      buffer += chunk;
      drain();
    });
    socket.on("error", fail);
    socket.on("close", () => fail(new Error("SMTP connection closed")));

    const expect = (ok: number[]) =>
      new Promise<void>((res) => {
        waiting = (code, text) => (ok.includes(code) ? res() : fail(new Error(`SMTP ${text}`)));
        drain();
      });
    const send = (line: string, ok: number[]) => {
      const reply = expect(ok);
      socket.write(`${line}\r\n`);
      return reply;
    };

    const domain = address(msg.from).split("@")[1] || "localhost";
    (async () => {
      await expect([220]);
      await send(`EHLO ${domain}`, [250]);
      await send("AUTH LOGIN", [334]);
      await send(b64(config.user), [334]);
      await send(b64(config.pass), [235]);
      await send(`MAIL FROM:<${address(msg.from)}>`, [250]);
      await send(`RCPT TO:<${address(msg.to)}>`, [250, 251]);
      await send("DATA", [354]);
      // Dot-stuffing: a line starting with "." gets an extra one.
      const data = buildMessage(msg, domain).replace(/^\./gm, "..");
      await send(`${data}\r\n.`, [250]);
      socket.write("QUIT\r\n");
      done = true;
      socket.end();
      resolve();
    })().catch((err) => fail(err instanceof Error ? err : new Error(String(err))));
  });
}
