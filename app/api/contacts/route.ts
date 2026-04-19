import { NextResponse } from "next/server";
import { getContacts } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getContacts());
}