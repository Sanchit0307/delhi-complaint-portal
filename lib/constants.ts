export interface Department {
  id: string;
  nameEn: string;
  nameHi: string;
  shortName: string;
  category: string;
  email: string;
  phone: string;
  icon: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const DISCLAIMER = {
  en: "Disclaimer: This platform is an independent, free tool and is not affiliated with, endorsed by, or representing the Government of Delhi or any government department. It was created solely to help citizens draft professionally formatted grievance letters, as many legitimate complaints are often rejected or ignored due to incorrect formatting. Using this tool does not guarantee official action, but it ensures your concerns are presented effectively.",
  hi: "अस्वीकरण: यह प्लेटफ़ॉर्म एक स्वतंत्र, निःशुल्क टूल है और किसी भी तरह से दिल्ली सरकार या किसी सरकारी विभाग से संबद्ध, समर्थित या उसका प्रतिनिधित्व नहीं करता है। इसे केवल नागरिकों को पेशेवर रूप से शिकायत पत्र लिखने में मदद करने के लिए बनाया गया है, क्योंकि अक्सर कई वैध शिकायतें गलत प्रारूप (फॉर्मेट) के कारण खारिज या नज़रअंदाज़ कर दी जाती हैं। इस टूल का उपयोग किसी भी आधिकारिक कार्रवाई की गारंटी नहीं देता है, लेकिन यह सुनिश्चित करता है कि आपकी चिंताओं को प्रभावी ढंग से प्रस्तुत किया जाए।"
};

export const DEPARTMENTS: Department[] = [
  {
    id: "mcd",
    nameEn: "Municipal Corporation of Delhi (MCD)",
    nameHi: "दिल्ली नगर निगम (एमसीडी)",
    shortName: "MCD",
    category: "Sanitation & Infrastructure",
    email: "grievances@mcd.delhi.gov.in",
    phone: "155304",
    icon: "Building2",
    descriptionEn: "Garbage collection, pothole repairs, streetlights, property tax & stray animals.",
    descriptionHi: "कूड़ा कचरा प्रबंधन, सड़क मरम्मत, स्ट्रीट लाइट, संपत्ति कर एवं लावारिस पशु।"
  },
  {
    id: "djb",
    nameEn: "Delhi Jal Board (DJB)",
    nameHi: "दिल्ली जल बोर्ड (डीजेबी)",
    shortName: "DJB",
    category: "Water & Sewerage",
    email: "customercare@delhijalboard.nic.in",
    phone: "1916",
    icon: "Droplets",
    descriptionEn: "Contaminated water supply, low water pressure, pipeline leaks & sewer overflow.",
    descriptionHi: "दूषित पानी आपूर्ति, कम पानी दबाव, पाइपलाइन लीकेज एवं सीवर ओवरफ्लो।"
  },
  {
    id: "police",
    nameEn: "Delhi Police",
    nameHi: "दिल्ली पुलिस",
    shortName: "Delhi Police",
    category: "Law & Safety",
    email: "cp.sanjayarora@delhipolice.gov.in",
    phone: "112 / 1090",
    icon: "ShieldAlert",
    descriptionEn: "Public nuisance, illegal parking, traffic congestion, noise pollution & safety concerns.",
    descriptionHi: "सार्वजनिक उपद्रव, अवैध पार्किंग, ट्रैफिक समस्या, ध्वनि प्रदूषण एवं सुरक्षा चिताएं।"
  },
  {
    id: "ndmc",
    nameEn: "New Delhi Municipal Council (NDMC)",
    nameHi: "नई दिल्ली नगर पालिका परिषद (एनडीएमसी)",
    shortName: "NDMC",
    category: "Civic Services (Lutyens Zone)",
    email: "delhi.nodal@ndmc.gov.in",
    phone: "1533",
    icon: "Landmark",
    descriptionEn: "Lutyens Delhi civic amenities, public parks, horticulture & commercial licenses.",
    descriptionHi: "लुटियंस दिल्ली नागरिक सुविधाएं, सार्वजनिक पार्क, उद्यान एवं व्यावसायिक लाइसेंस।"
  },
  {
    id: "pwd",
    nameEn: "Public Works Department (PWD)",
    nameHi: "लोक निर्माण विभाग (पीडब्ल्यूडी)",
    shortName: "PWD",
    category: "Roads & Flyovers",
    email: "pwd-delhi@nic.in",
    phone: "1800110093",
    icon: "Construction",
    descriptionEn: "Arterial roads maintenance, flyover maintenance, drainage desilting & foot overbridges.",
    descriptionHi: "मुख्य सड़कों का रखरखाव, फ्लाईओवरों का रखरखाव, नाला सफाई एवं फुटओवर ब्रिज।"
  }
];

export const UI_TRANSLATIONS = {
  en: {
    title: "Delhi NCR Complaint Portal",
    subtitle: "AI-Powered Citizen Grievance Redressal Assistant",
    step1: "1. Department",
    step2: "2. User Details",
    step3: "3. AI Letter",
    step4: "4. Share & Export",
    step1Heading: "Step 1: Select Concerned Department",
    step1Subheading: "Choose the civic agency responsible for your grievance.",
    step2Heading: "Step 2: Enter Complaint & Citizen Details",
    step2Subheading: "Provide clear information so the official letter can be drafted accurately.",
    nameLabel: "Full Name",
    namePlaceholder: "e.g., Rajesh Sharma",
    phoneLabel: "Mobile / Contact Info",
    phonePlaceholder: "e.g., +91 9876543210",
    addressLabel: "Locality / Address & Ward Number",
    addressPlaceholder: "e.g., Pocket B, Mayur Vihar Phase 1, Delhi 110091",
    problemLabel: "Describe your Problem in Detail",
    problemPlaceholder: "Describe the issue clearly: What is the problem? Since when? Exact location/landmark? Impact on residents?",
    urgencyLabel: "Urgency Level",
    urgencyNormal: "Normal (Standard Priority)",
    urgencyUrgent: "Urgent (High Priority)",
    urgencyEmergency: "Emergency (Immediate Action Needed)",
    generateBtn: "Generate Formal Letter with Gemini AI",
    backBtn: "Back",
    continueBtn: "Continue to Details",
    step3Heading: "Step 3: Review & Edit Generated Formal Letter",
    step3Subheading: "AI has formatted your grievance into an official representation notice. Note: Official stamps are omitted.",
    proceedExport: "Proceed to Share & Export Options",
    regenerateBtn: "Regenerate AI Letter",
    step4Heading: "Step 4: Dispatch & Export Grievance",
    step4Subheading: "Choose your preferred channel to send or download the letter.",
    shareWhatsapp: "Share via WhatsApp",
    sendEmail: "Send via Gmail",
    copyText: "Copy Letter Text",
    downloadPdf: "Download Printable PDF",
    disclaimerTitle: "Important Disclaimer",
    fileNew: "File Another Complaint"
  },
  hi: {
    title: "दिल्ली एनसीआर शिकायत पोर्टल",
    subtitle: "एआई-आधारित नागरिक जन-शिकायत निवारण सहायक",
    step1: "1. विभाग चुनें",
    step2: "2. नागरिक विवरण",
    step3: "3. एआई पत्र",
    step4: "4. साझा / डाउनलोड करें",
    step1Heading: "चरण 1: संबंधित विभाग का चयन करें",
    step1Subheading: "अपनी समस्या से संबंधित प्रशासनिक विभाग को चुनें।",
    step2Heading: "चरण 2: शिकायत एवं नागरिक विवरण भरें",
    step2Subheading: "सटीक जानकारी दें ताकि आधिकारिक पत्र सही तरीके से तैयार किया जा सके।",
    nameLabel: "शिकायतकर्ता का पूरा नाम",
    namePlaceholder: "उदा. राजेश शर्मा",
    phoneLabel: "मोबाइल / संपर्क विवरण",
    phonePlaceholder: "उदा. +91 9876543210",
    addressLabel: "क्षेत्र / पता व वार्ड नंबर",
    addressPlaceholder: "उदा. पॉकेट बी, मयूर विहार फेज़ 1, दिल्ली 110091",
    problemLabel: "अपनी समस्या का विस्तृत विवरण दें",
    problemPlaceholder: "समस्या का स्पष्ट विवरण दें: समस्या क्या है? कितने दिनों से है? सटीक स्थान या लैंडमार्क क्या है?",
    urgencyLabel: "प्राथमिकता का स्तर",
    urgencyNormal: "सामान्य (मानक प्राथमिकता)",
    urgencyUrgent: "गंभीर (उच्च प्राथमिकता)",
    urgencyEmergency: "आपातकालीन (तत्काल कार्रवाई की आवश्यकता)",
    generateBtn: "जैमिनी एआई द्वारा पत्र बनाएं",
    backBtn: "पीछे जाएं",
    continueBtn: "विवरण भरें",
    step3Heading: "चरण 3: तैयार पत्र की समीक्षा एवं संपादन",
    step3Subheading: "एआई ने आपकी शिकायत का पत्र तैयार कर दिया है। (निर्देशानुसार कोई स्टैम्प शामिल नहीं है)",
    proceedExport: "साझा एवं डाउनलोड विकल्पों पर जाएं",
    regenerateBtn: "पुनः पत्र बनाएं",
    step4Heading: "चरण 4: शिकायत पत्र भेजें या डाउनलोड करें",
    step4Subheading: "अपनी शिकायत भेजने या डाउनलोड करने के लिए अपना पसंदीदा माध्यम चुनें।",
    shareWhatsapp: "व्हाट्सएप पर भेजें",
    sendEmail: "जीमेल द्वारा भेजें",
    copyText: "पत्र कॉपी करें",
    downloadPdf: "पीडीएफ डाउनलोड करें",
    disclaimerTitle: "महत्वपूर्ण अस्वीकरण",
    fileNew: "नई शिकायत दर्ज करें"
  }
};
