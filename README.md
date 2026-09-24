# 🏛️ Delhi NCR Complaint Portal

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescript.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-Google_AI-4285F4?style=flat-square&logo=googlegemini)](https://ai.google.dev/)
[![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://delhicomplaintportal.vercel.app)

> A free, AI-powered civic tech platform for citizens of Delhi & NCR to generate formal, legally sound grievance letters addressed to government authorities — in seconds.

🔗 **Live Application:** [delhicomplaintportal.vercel.app](https://delhicomplaintportal.vercel.app)

---

## 📌 Problem Statement

Citizens in Delhi NCR frequently face civic issues (water shortages, road damage, sewage overflows, streetlighting failures) but face hurdles when submitting formal grievances:
1. **Formatting Rejections:** Many legitimate complaints are ignored or rejected simply due to improper legal formatting or missing department routing headers.
2. **Language Barrier:** Citizens often struggle to draft formal representations in official English or legal Hindi.
3. **Department Confusion:** Identifying whether an issue falls under MCD, NDMC, Delhi Jal Board, PWD, or Delhi Police is confusing.

**Delhi NCR Complaint Portal** solves this by converting plain-language user descriptions into structured, formal grievance letters targeting the appropriate authority.

---

## ✨ Features

- 🤖 **AI Letter Generator:** Transforms simple descriptions into professionally structured representations using Google Gemini 2.5 Flash.
- 🏢 **Smart Department Routing:** Select from key bodies including MCD, DJB, Delhi Police, NDMC, and PWD.
- 🌐 **Bilingual Interface:** Full English and Hindi support across the entire wizard UI and letter outputs.
- 📤 **Instant Export Options:**
  - 📄 **PDF Export:** Direct vector PDF generation with formal letterhead layout.
  - 💬 **WhatsApp:** Pre-formatted message routing via standard web links.
  - ✉️ **Email:** Instant `mailto:` integration pre-filled with department recipient details.
  - 📋 **One-Click Copy:** Instant clipboard backup.
- 🛡️ **Privacy & Security First:** Zero user data or phone numbers stored in databases; server-side processing ensures API keys are never exposed.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI Integration** | Google Gen AI SDK (`@google/genai` / `gemini-2.5-flash`) |
| **PDF Processing** | `@react-pdf/renderer` |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

---

## 🎯 Tech Stack Breakdown: Why Each Tool Was Used

### 1. Next.js 15 (App Router)
* **Use Case:** Full-stack architecture & API key security.
* **Why it was used:** In pure client-side applications, calling LLM APIs directly exposes private API keys in browser developer tools. Next.js provides server-side API Routes (`/api/generate-letter`), ensuring the Gemini API key stays hidden on the server. Furthermore, the App Router delivers near-instant page loads via Server Components.

### 2. TypeScript
* **Use Case:** End-to-end type safety & structured state management.
* **Why it was used:** Handling multi-step wizard state, bilingual language dictionaries, and JSON payloads sent to LLM endpoints can easily lead to runtime crashes. TypeScript enforces strict types across form payloads and API responses.

### 3. Tailwind CSS
* **Use Case:** Responsive, mobile-first civic design system.
* **Why it was used:** Allows rapid styling without writing complex CSS files. It ensures the portal looks clean, authoritative, and perfectly responsive across screens of all sizes (mobile phones, tablets, and desktops).

### 4. `@google/genai` (Google Gemini 2.5 Flash)
* **Use Case:** Server-side formal representation generation.
* **Why it was used:** Chosen for its fast response latency, low inference cost, and strong understanding of Indian legal/civic vernacular. It accepts structured prompt parameters (department, problem, citizen name, address) and enforces proper Title Case formatting, formal salutations, and resolution demands referencing the Delhi Citizen Charter.

### 5. `@react-pdf/renderer`
* **Use Case:** High-quality client/server PDF document generation.
* **Why it was used:** Replaces low-resolution HTML canvas screen-scraping libraries (`html2pdf.js`). It programmatically renders clean, printable A4 PDF documents formatted like official legal letters.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm / pnpm / yarn
- A free Gemini API Key from [Google AI Studio](https://aistudio.google.com)

## live preview
- https://delhi-complaint-portal.vercel.app/

⚠️ Disclaimer
This platform is an independent, open-source tool and is not affiliated with, endorsed by, or representing the Government of NCT of Delhi, Municipal Corporation of Delhi (MCD), or any official government agency. It is designed solely as a formatting assistant to help citizens structure grievance representations effectively.
