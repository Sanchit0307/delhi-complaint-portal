"use client";

import React, { useState } from "react";
import {
  Building2,
  Droplets,
  ShieldAlert,
  Landmark,
  Construction,
  Globe,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Mail,
  FileDown,
  Plus,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Share2,
  Check
} from "lucide-react";
import { DEPARTMENTS, DISCLAIMER, UI_TRANSLATIONS, Department } from "@/lib/constants";

export default function Home() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [step, setStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Form State
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [userProblem, setUserProblem] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("Normal");

  // AI & Generated State
  const [loading, setLoading] = useState<boolean>(false);
  const [letterText, setLetterText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[lang];

  // Icon Mapping Helper
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
      alert(lang === "hi" ? "कृपया सभी आवश्यक जानकारी भरें (*)" : "Please fill in all required fields (*)");
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
      console.error("Generation Error:", error);
      alert(`Error: ${error.message || "Failed to contact Gemini API."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsapp = () => {
    const message = encodeURIComponent(`*Grievance Representation Notice*\n\n${letterText}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleOpenEmail = () => {
    if (!selectedDept) return;
    const subject = encodeURIComponent(`Formal Grievance: ${selectedDept.shortName} - ${userName}`);
    const body = encodeURIComponent(letterText);
    window.open(`mailto:${selectedDept.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDownloadPDF = () => {
    window.print();
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
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{lang === "en" ? "हिंदी में बदलें" : "Switch to English"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center gap-2 text-xs font-semibold ${
                  step >= stepNum ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === stepNum
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : step > stepNum
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className="hidden md:inline">
                  {stepNum === 1
                    ? t.step1
                    : stepNum === 2
                    ? t.step2
                    : stepNum === 3
                    ? t.step3
                    : t.step4}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: Department Selection Grid */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t.step1Heading}</h2>
              <p className="text-sm text-slate-600">{t.step1Subheading}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                      {getIcon(dept.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
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

            <div className="flex justify-end">
              <button
                disabled={!selectedDept}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: User & Problem Details Form */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t.step2Heading}</h2>
              <p className="text-sm text-slate-600">{t.step2Subheading}</p>
            </div>

            <div className="space-y-5 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                onClick={handleGenerateLetter}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm"
              >
                <span>{t.generateBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Generation & Review */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t.step3Heading}</h2>
              <p className="text-sm text-slate-600">{t.step3Subheading}</p>
            </div>

            {loading ? (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <h3 className="font-semibold text-slate-800 text-lg">
                  {lang === "hi"
                    ? "आधिकारिक शिकायत पत्र तैयार किया जा रहा है..."
                    : "Drafting Official Grievance Representation..."}
                </h3>
                <p className="text-sm text-slate-500">
                  {lang === "hi"
                    ? "गूगल जैमिनी एआई द्वारा दिल्ली नागरिक प्रशासन मानक प्रारूप में संपादन जारी है।"
                    : "Consulting Gemini AI & formatting according to Delhi Civic Administration standards."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Printable Formal Letter Sheet (No Seal/Stamp) */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-lg border border-slate-300 font-serif text-slate-800 shadow-inner">
                  <textarea
                    rows={16}
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm md:text-base leading-relaxed resize-y font-serif"
                  ></textarea>
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.backBtn}</span>
                    </button>
                    <button
                      onClick={handleGenerateLetter}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                    >
                      <span>{t.regenerateBtn}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition"
                  >
                    <span>{t.proceedExport}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Dispatch & Export Options */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.step4Heading}</h2>
              <p className="text-sm text-slate-600">{t.step4Subheading}</p>
            </div>

            {/* Department Summary Card */}
            {selectedDept && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <small className="text-xs uppercase font-semibold text-slate-500">Target Agency Contact:</small>
                  <h4 className="font-bold text-slate-900">{selectedDept.nameEn}</h4>
                  <p className="text-xs text-slate-600">Email: {selectedDept.email} | Helpline: {selectedDept.phone}</p>
                </div>
              </div>
            )}

            {/* Disclaimer Banner on Sharing Page */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.disclaimerTitle}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{DISCLAIMER[lang]}</p>
            </div>

            {/* Export Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleOpenWhatsapp}
                className="p-5 border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl flex items-center gap-4 text-left transition"
              >
                <div className="p-3 bg-emerald-600 text-white rounded-lg">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{t.shareWhatsapp}</h4>
                  <p className="text-xs text-slate-600">Send formatted grievance notice via WhatsApp</p>
                </div>
              </button>

              <button
                onClick={handleOpenEmail}
                className="p-5 border border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl flex items-center gap-4 text-left transition"
              >
                <div className="p-3 bg-blue-600 text-white rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{t.sendEmail}</h4>
                  <p className="text-xs text-slate-600">Open Gmail with pre-filled department contact</p>
                </div>
              </button>

              <button
                onClick={handleCopyText}
                className="p-5 border border-purple-200 bg-purple-50/50 hover:bg-purple-50 rounded-xl flex items-center gap-4 text-left transition"
              >
                <div className="p-3 bg-purple-600 text-white rounded-lg">
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {copied ? (lang === "hi" ? "कॉपी हो गया!" : "Copied!") : t.copyText}
                  </h4>
                  <p className="text-xs text-slate-600">Copy letter text to paste into 311 or CPGRAMS</p>
                </div>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="p-5 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 rounded-xl flex items-center gap-4 text-left transition"
              >
                <div className="p-3 bg-rose-600 text-white rounded-lg">
                  <FileDown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{t.downloadPdf}</h4>
                  <p className="text-xs text-slate-600">Print or save letter as PDF document</p>
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>{t.fileNew}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Global Disclaimer Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.disclaimerTitle}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{DISCLAIMER[lang]}</p>
          <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-500">
            &copy; 2026 Delhi NCR Citizen Grievance Assistance Portal. Free Independent Tool.
          </div>
        </div>
      </footer>
    </div>
  );
}
