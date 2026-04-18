"use client";

import { useMemo, useState } from "react";

export default function App() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Cliente Exemplo",
      phone: "5511999999999",
      stage: "Novo",
      notes: "Entrou pelo WhatsApp",
    },
  ]);

  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    stage: "Novo",
    notes: "",
  });

  const stages = ["Novo", "Em Atendimento", "Proposta", "Fechado"];

  const filtered = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.phone.includes(q)
    );
  }, [contacts, q]);

  function add() {
    if (!form.name || !form.phone) return;

    setContacts([{ ...form, id: Date.now() }, ...contacts]);

    setForm({
      name: "",
      phone: "",
      stage: "Novo",
      notes: "",
    });
  }

  function del(id: number) {
    setContacts(contacts.filter((c) => c.id !== id));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">CRM WhatsApp</h1>
      <p className="text-gray-500">Leads simples e rápido</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-4 space-y-3">
          <h2 className="font-semibold text-xl">Novo Contato</h2>

          <input
            className="w-full border rounded p-2"
            placeholder="Nome"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="w-full border rounded p-2"
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <select
            className="w-full border rounded p-2"
            value={form.stage}
            onChange={(e) =>
              setForm({ ...form, stage: e.target.value })
            }
          >
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <textarea
            className="w-full border rounded p-2"
            placeholder="Observações"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <button
            onClick={add}
            className="w-full bg-black text-white rounded p-2"
          >
            Salvar
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          <input
            className="w-full border rounded p-2"
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {filtered.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 space-y-2"
            >
              <div className="font-semibold">{c.name}</div>
              <div>{c.phone}</div>
              <div className="text-sm text-gray-500">
                {c.stage}
              </div>
              <div>{c.notes}</div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${c.phone}`}
                  target="_blank"
                  className="bg-green-600 text-white px-3 py-2 rounded"
                >
                  WhatsApp
                </a>

                <button
                  onClick={() => del(c.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}