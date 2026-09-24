"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Droplets,
  ShieldAlert,
  Landmark,
  Construction,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Mail,
  FileDown,
  Share2,
  Check,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { DEPARTMENTS, DISCLAIMER, UI_TRANSLATIONS, Department } from "@/lib/constants";
import dynamic from "next/dynamic";

// Dynamically import PDFDownloadLink to prevent SSR hydration mismatches
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

import GrievancePDFDocument from "@/components/pdf-document";

interface MultiStepFormProps {
  lang?: "en" | "hi";
}

export function MultiStepForm({ lang = "en" }: MultiStepFormProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // User Details State
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [userProblem, setUserProblem] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("Normal");

  // AI & Export State
  const [loading, setLoading] = useState<boolean>(false);
  const [letterText, setLetterText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = UI_TRANSLATIONS[lang];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-7 h-7 text-blue-600" />;
      case "Droplets":
        return <Droplets className="w-7 h-7 text-cyan-600" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-7 h-7 text-rose-600" />;
      case "Landmark":
        return <Landmark className="w-7 h-7 text-amber-600" />;
      case "Construction":
        return <Construction className="w-7 h-7 text-emerald-600" />;
      default:
        return <Building2 className="w-7 h-7 text-blue-600" />;
    }
  };

  const handleGenerateLetter = async () => {
    if (!selectedDept || !userName.trim() || !userAddress.trim() || !userProblem.trim()) {
      alert(lang === "hi" ? "कृपया सभी आवश्यक स्थान भरें (*)" : "Please fill in all required fields (*)");
      return;
    }

    setLoading(true);
    setStep(3);

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: selectedDept.shortName,
          name: userName,
          phone: userPhone,
          address: userAddress,
          problem: userProblem,
          urgency,
          lang,
        }),
      });

      const data = await res.json();
      if (res.ok && data.letter) {
        setLetterText(data.letter);
      } else {
        throw new Error(data.error || "Failed to generate letter");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      alert(`Error: ${error.message || "Failed to generate grievance letter."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsappShare = () => {
    const text = encodeURIComponent(`*PUBLIC GRIEVANCE REPRESENTATION*\n\n${letterText}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleEmailSend = () => {
    if (!selectedDept) return;
    const subject = encodeURIComponent(`Formal Representation: ${selectedDept.shortName} - ${userName}`);
    const body = encodeURIComponent(letterText);
    window.open(`mailto:${selectedDept.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleReset = () => {
    setStep(1);
    setSelectedDept(null);
    setUserName("");
    setUserPhone("");
    setUserAddress("");
    setUserProblem("");
    setLetterText("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Wizard Progress Steps Indicator */}
      <div className="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          {[
            { id: 1, label: t.step1 },
            { id: 2, label: t.step2 },
            { id: 3, label: t.step3 },
          ].map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 text-xs font-semibold ${
                step >= s.id ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.id
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : step > s.id
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500 border border-slate-300"
                }`}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Department Grid */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.step1Heading}</h2>
            <p className="text-sm text-slate-600">{t.step1Subheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-md"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                    {getIcon(dept.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                        {lang === "hi" ? dept.nameHi : dept.nameEn}
                      </h3>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                    </div>
                    <span className="inline-block text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded my-1">
                      {dept.category}
                    </span>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {lang === "hi" ? dept.descriptionHi : dept.descriptionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={!selectedDept}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm shadow-sm"
            >
              <span>{t.continueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: User Details Form */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.step2Heading}</h2>
            <p className="text-sm text-slate-600">{t.step2Subheading}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  {t.nameLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                {t.addressLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                {t.urgencyLabel}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="Normal">{t.urgencyNormal}</option>
                <option value="Urgent">{t.urgencyUrgent}</option>
                <option value="Emergency">{t.urgencyEmergency}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                {t.problemLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={userProblem}
                onChange={(e) => setUserProblem(e.target.value)}
                placeholder={t.problemPlaceholder}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>

            <button
              onClick={handleGenerateLetter}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{t.generateBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Letter Preview & Export Actions */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.step3Heading}</h2>
            <p className="text-sm text-slate-600">{t.step3Subheading}</p>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
              <h3 className="font-semibold text-slate-800 text-lg">
                {lang === "hi"
                  ? "आधिकारिक शिकायत पत्र तैयार किया जा रहा है..."
                  : "Drafting Official Grievance Representation Notice..."}
              </h3>
              <p className="text-sm text-slate-500">
                {lang === "hi"
                  ? "गूगल जैमिनी एआई द्वारा दिल्ली नागरिक प्रशासन मानक प्रारूप में संपादन जारी है।"
                  : "Consulting Gemini AI & formatting according to Delhi Civic Administration standards."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Disclaimer Notice Banner on Sharing / Export Page */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.disclaimerTitle}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{DISCLAIMER[lang]}</p>
              </div>

              {/* Printable Formal Letter Container (NO Stamp rendered) */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-lg border border-slate-300 font-serif text-slate-800 shadow-inner">
                <textarea
                  rows={15}
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm md:text-base leading-relaxed resize-y font-serif"
                ></textarea>
              </div>

              {/* Action & Export Button Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={handleWhatsappShare}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.shareWhatsapp}</span>
                </button>

                <button
                  onClick={handleEmailSend}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t.sendEmail}</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (lang === "hi" ? "कॉपी हो गया!" : "Copied!") : t.copyText}</span>
                </button>

                {/* React-PDF Download Button */}
                {isClient && selectedDept ? (
                  <PDFDownloadLink
                    document={
                      <GrievancePDFDocument
                        letterText={letterText}
                        departmentName={selectedDept.shortName}
                      />
                    }
                    fileName={`Grievance_${selectedDept.shortName}_${Date.now()}.pdf`}
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition text-center"
                  >
                    {({ loading: pdfLoading }) => (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>{pdfLoading ? "Preparing PDF..." : t.downloadPdf}</span>
                      </>
                    )}
                  </PDFDownloadLink>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 bg-slate-300 text-slate-600 font-medium px-4 py-2.5 rounded-lg text-sm cursor-not-allowed"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>{t.downloadPdf}</span>
                  </button>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.fileNew}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiStepForm;
