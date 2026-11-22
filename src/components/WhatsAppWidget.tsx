import { Headphones } from "lucide-react";

const SUPPORT_EMAIL = "Espritaccess360@gmail.com";
const SUBJECT = "Support Request / Complaint - EspritAccess";
const BODY = `Hello EspritAccess Support,

I would like to report an issue. Here are my details:

- Full Name:
- Account Email:
- Service / Plan:
- Payment Reference (if applicable):
- Description of Issue:

Thank you.`;

export function WhatsAppWidget() {
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${encodeURIComponent(
    SUBJECT
  )}&body=${encodeURIComponent(BODY)}`;

  return (
    <a
      href={gmailLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact EspritAccess Support"
      title="Contact Support"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 rounded-full bg-emerald-500 p-3 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
    >
      <Headphones className="h-5 w-5" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-200 group-hover:max-w-[100px] group-hover:pr-1">
        Support
      </span>
    </a>
  );
}