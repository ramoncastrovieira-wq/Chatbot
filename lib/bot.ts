export function getBotReply(msg:string) {
  const text = msg.toLowerCase();

  if(text.includes("oi") || text.includes("ola"))
    return "Olá! Seja bem-vindo.\n1. Preços\n2. Suporte\n3. Vendedor";

  if(text === "1")
    return "Planos a partir de R$99/mês.";

  if(text === "2")
    return "Nosso suporte funciona das 8h às 18h.";

  if(text === "3")
    return "Encaminhando para um vendedor.";

  return "Não entendi. Digite 1, 2 ou 3.";
}