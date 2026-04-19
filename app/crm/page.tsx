"use client";

import { useEffect, useState } from "react";
import type { Contact, Message } from "@/lib/types";

export default function CRM() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/contacts");
      const data = (await res.json()) as Contact[];

      setContacts(data);

      if (data.length) {
        setSelected((prev: Contact | null) => {
          if (!prev) return data[0];
          const updated = data.find((c: Contact) => c.id === prev.id);
          return updated ?? prev;
        });
      }
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    }
  }

  useEffect(() => {
    // load may call setState; this initial load is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();

    const interval = setInterval(load, 2000);

    return () => clearInterval(interval);
  }, []);

  async function sendMessage() {
    if (!msg.trim() || !selected) return;

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: selected.phone,
          text: msg,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.ok === false) {
        console.error("send failed:", body);
        alert("Erro ao enviar mensagem: " + (body?.error || res.statusText));
        return;
      }

      setMsg("");
      load();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }

  return (
    <div className="grid md:grid-cols-3 h-screen bg-zinc-100">
      {/* Sidebar */}
      <div className="border-r bg-white p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          WhatsApp CRM
        </h1>

        <div className="space-y-2">
       {contacts.map((c: Contact) => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            className={
              selected?.id === c.id
                ? "border rounded-xl p-3 cursor-pointer transition bg-green-100 border-green-500"
                : "border rounded-xl p-3 cursor-pointer transition hover:bg-zinc-100"
            }
          >
            <div className="font-bold">{c.name}</div>
            <div className="text-sm">{c.phone}</div>
            <div className="text-xs text-gray-500 mt-1">
              {c.stage}
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Chat */}
      <div className="md:col-span-2 flex flex-col h-screen">
        {selected ? (
          <>
            {/* Header */}
            <div className="border-b bg-white p-4">
              <h2 className="text-xl font-bold">
                {selected.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selected.phone}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 bg-zinc-50 space-y-3">
              {(selected.messages ?? []).length > 0 ? (
                (selected.messages ?? []).map(
                  (m: Message, i: number) => (
                    <div
                      key={i}
                      className={
                        m.from === "cliente"
                          ? "text-left"
                          : "text-right"
                      }
                    >
                      <span
                        className={`inline-block px-4 py-2 rounded-2xl max-w-[75%] ${
                          m.from === "cliente"
                            ? "bg-white border"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {m.text}
                      </span>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500">
                  Nenhuma mensagem ainda.
                </p>
              )}
            </div>

            {/* Send box */}
            <div className="border-t bg-white p-4 flex gap-2">
              <input
                className="border rounded-xl p-3 flex-1"
                placeholder="Digite uma mensagem..."
                value={msg}
                onChange={(e) =>
                  setMsg(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-6 rounded-xl font-semibold hover:bg-green-700"
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Selecione um contato
          </div>
        )}
      </div>
    </div>
  );
}