import { NextResponse } from "next/server";
import { getContacts, saveContacts } from "@/lib/db";
import { getBotReply } from "@/lib/bot";
import { sendWhatsApp } from "@/lib/whatsapp";
import type { Contacts, Contact } from "@/lib/types";

export async function GET(req:Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    return new Response(challenge);
  }

  return new Response("Erro", { status: 403 });
}

export async function POST(req:Request) {
  const body = await req.json();

  try {
    const msg =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return NextResponse.json({ ok: true });

    const phone = msg.from;
    const text = msg.text?.body || "";

    const contacts: Contacts = getContacts();

    let user = contacts.find((c: Contact) => c.phone === phone);

    if (!user) {
      user = {
        id: Date.now(),
        phone,
        name: phone,
        stage: "Novo",
        messages: []
      };
      contacts.unshift(user);
    }

    user.messages = user.messages ?? [];
    user.messages.push({
      from: "cliente",
      text,
      time: new Date().toISOString(),
    });

    const reply = getBotReply(text);
    await sendWhatsApp(phone, reply);

    user.messages = user.messages ?? [];
    user.messages.push({
      from: "bot",
      text: reply,
      time: new Date().toISOString(),
    });

    saveContacts(contacts);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}