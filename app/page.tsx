import Link from "next/link";

export default function Home(){
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        WhatsApp CRM Chatbot
      </h1>

      <Link
        href="/crm"
        className="bg-black text-white px-5 py-3 rounded"
      >
        Abrir CRM
      </Link>
    </div>
  );
}