export interface Message {
  from: "cliente" | "bot";
  text: string;
  time: string;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  stage?: string;
  messages?: Message[];
}

export type Contacts = Contact[];
