import fs from "fs";
import path from "path";
import type { Contacts } from "@/lib/types";

const file = path.join(process.cwd(), "data", "crm.json");

export function getContacts(): Contacts {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw) as Contacts;
  } catch (err) {
    console.error("Error reading contacts file:", err);
    return [];
  }
}

export function saveContacts(data: Contacts) {
  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving contacts file:", err);
  }
}