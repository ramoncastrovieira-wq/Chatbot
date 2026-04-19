import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req:Request) {
  try {
    const { phone, text } = await req.json();

    await sendWhatsApp(phone, text);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("/api/send error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}