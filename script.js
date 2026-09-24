/* ==========================================================================
   DELHI NCR COMPLAINT PORTAL - JAVASCRIPT LOGIC
   Features: Bilingual (EN/HI), Multi-step Wizard, Gemini AI API Integration,
   Client-Side Fallback Generator, WhatsApp/Email/Copy/PDF Export (html2pdf.js)
   ========================================================================== */

// --- CONFIGURATION & GEMINI API KEY PLACEHOLDER ---
// Replace 'YOUR_GEMINI_API_KEY' with your actual Google Gemini API Key.
// If left unchanged or if API fails, the app uses a smart client-side formal letter generator.
const GEMINI_API_KEY = ""; // Managed securely via Next.js server route /api/generate-letter
const GEMINI_MODEL = "gemini-1.5-flash";

// --- DEPARTMENTS DATASET ---
const DEPARTMENTS = [
    {
        id: "mcd",
        nameEn: "Municipal Corporation of Delhi (MCD)",
        nameHi: "दिल्ली नगर निगम (MCD)",
        badgeEn: "Sanitation & Civic Infrastructure",
        badgeHi: "सफाई एवं नागरिक अवसंरचना",
        descEn: "Garbage collection, open drains, street cleaning, illegal construction, stray animals, mosquito breeding.",
        descHi: "कूड़ा कचरा प्रबंधन, नालियों की सफाई, सड़कों की झाड़ू, आवारा पशु, मच्छर नियंत्रण व अवैध निर्माण।",
        email: "grievances@mcd.delhi.gov.in",
        phone: "155304 / 311 Mobile App",
        iconClass: "fa-solid fa-trash-can-arrow-up",
        bgColor: "#2563eb",
        categoriesEn: ["Garbage / Waste Dump", "Blocked Drainage", "Mosquito Breeding / Dengue Control", "Stray Animals Hazard", "Park Maintenance"],
        categoriesHi: ["कचरा / गंदगी का ढेर", "बंद नाली व सीवर", "मच्छर व डेंगू नियंत्रण", "आवारा पशु समस्या", "पार्क का रखरखाव"],
        quickTagsEn: ["Garbage Overflow", "Clogged Drain", "Stray Dogs", "Debris Removal", "Park Maintenance"],
        quickTagsHi: ["कचरा ढेर", "बंद नाला", "आवारा कुत्ते", "मलबा हटाना", "पार्क सफाई"]
    },
    {
        id: "djb",
        nameEn: "Delhi Jal Board (DJB)",
        nameHi: "दिल्ली जल बोर्ड (DJB)",
        badgeEn: "Water Supply & Sewerage",
        badgeHi: "जल आपूर्ति व सीवरेज",
        descEn: "Contaminated drinking water, zero water pressure, water pipeline leakage, sewage overflow, meter issues.",
        descHi: "दूषित पेयजल आपूर्ति, कम पानी का दबाव, पाइपलाइन लीकेज, सीवर ओवरफ्लो व मीटर संबंधी शिकायतें।",
        email: "customer.care@delhijalboard.gov.in",
        phone: "1916 / 011-23538495",
        iconClass: "fa-solid fa-droplet",
        bgColor: "#0284c7",
        categoriesEn: ["Contaminated / Dirty Water", "Water Pipeline Leakage", "No Water Supply", "Sewer Line Overflow", "Water Tanker Request"],
        categoriesHi: ["गंदा / दूषित पानी", "पाइपलाइन में लीकेज", "पानी की आपूर्ति न होना", "सीवर लाइन ओवरफ्लो", "वाटर टैंकर की मांग"],
        quickTagsEn: ["Dirty Drinking Water", "Pipeline Burst", "Low Water Pressure", "Sewer Overflow", "Tanker Needed"],
        quickTagsHi: ["गंदा पानी", "पाइपलाइन लीकेज", "कम दबाव", "सीवर जाम", "टैंकर चाहिए"]
    },
    {
        id: "police",
        nameEn: "Delhi Police & Traffic",
        nameHi: "दिल्ली पुलिस एवं ट्रैफिक",
        badgeEn: "Public Safety & Traffic Control",
        badgeHi: "जन सुरक्षा एवं यातायात नियंत्रण",
        descEn: "Noise pollution (loudspeakers late night), illegal parking, traffic congestion, street lighting safety, cyber complaints.",
        descHi: "ध्वनि प्रदूषण (देर रात लाउडस्पीकर), अवैध पार्किंग, ट्रैफिक जाम, स्ट्रीट लाइट की कमी व जन सुरक्षा।",
        email: "cp.snshrivastava@delhipolice.gov.in",
        phone: "112 / 1095 (Traffic)",
        iconClass: "fa-solid fa-shield-halved",
        bgColor: "#d97706",
        categoriesEn: ["Late Night Noise Pollution", "Illegal / Obstructive Parking", "Traffic Signal Failure", "Public Safety & Harassment", "Cyber Fraud Reporting"],
        categoriesHi: ["देर रात लाउडस्पीकर / शोर", "अवैध पार्किंग समस्या", "ट्रैफिक सिग्नल खराब", "सार्वजनिक सुरक्षा व उपद्रव", "साइबर धोखाधड़ी"],
        quickTagsEn: ["Loudspeaker Noise", "Car Blocking Road", "Traffic Light Broken", "Nuisance in Area", "Street Safety"],
        quickTagsHi: ["शोर-शराबा", "अवैध पार्किंग", "खराब सिग्नल", "असामाजिक तत्व", "सुरक्षा चिंता"]
    },
    {
        id: "pwd",
        nameEn: "PWD Delhi (Public Works Dept)",
        nameHi: "लोक निर्माण विभाग (PWD दिल्ली)",
        badgeEn: "Roads, Flyovers & Streetlights",
        badgeHi: "सड़कें, फ्लाईओवर व स्ट्रीट लाइट",
        descEn: "Potholes on main roads, damaged flyovers, broken streetlights on arterial roads, waterlogging on main roads.",
        descHi: "मुख्य सड़कों पर गड्ढे, क्षतिग्रस्त फ्लाईओवर, खराब स्ट्रीट लाइट, एवं मानसून में सड़कों पर जलभराव।",
        email: "pgms.pwd@delhi.gov.in",
        phone: "1800-11-0093",
        iconClass: "fa-solid fa-road",
        bgColor: "#4f46e5",
        categoriesEn: ["Dangerous Potholes on Road", "Non-Functional Streetlights", "Road Waterlogging", "Damaged Footpath / Divider", "Flyover Maintenance"],
        categoriesHi: ["सड़क पर खतरनाक गड्ढे", "खराब स्ट्रीट लाइट", "सड़क पर जलभराव", "टूटा फुटपाथ व डिवाइडर", "फ्लाईओवर मरम्मत"],
        quickTagsEn: ["Potholes", "Dark Streetlights", "Monsoon Waterlogging", "Broken Footpath", "Flyover Issue"],
        quickTagsHi: ["सड़क के गड्ढे", "अंधेरा / स्ट्रीटलाइट", "जलभराव", "टूटा फुटपाथ", "फ्लाईओवर"]
    },
    {
        id: "ndmc",
        nameEn: "New Delhi Municipal Council (NDMC)",
        nameHi: "नई दिल्ली नगरपालिका परिषद (NDMC)",
        badgeEn: "Lutyens & Central Delhi Civic Services",
        badgeHi: "लुटियंस व मध्य दिल्ली नागरिक सेवाएं",
        descEn: "Civic amenities, road repair, horticulture, tree trimming, and sanitation in NDMC Central Delhi zones.",
        descHi: "नई दिल्ली क्षेत्र में सफाई, पेड़ छंटाई, पार्क रखरखाव, सड़क मरम्मत व संपत्ति कर संबंधी सेवाएं।",
        email: "secretary@ndmc.gov.in",
        phone: "1533 (NDMC Helpline)",
        iconClass: "fa-solid fa-city",
        bgColor: "#059669",
        categoriesEn: ["Dangerous Tree Trimming", "Park & Horticulture Maintenance", "Civic Sanitation", "Road Repair in NDMC Zone"],
        categoriesHi: ["पेड़ों की छंटाई (खतरा)", "पार्क एवं बागवानी रखरखाव", "क्षेत्रीय सफाई", "NDMC सड़क मरम्मत"],
        quickTagsEn: ["Tree Trimming", "Park Cleanliness", "Street Repair", "Horticulture"],
        quickTagsHi: ["पेड़ कटाई", "पार्क सफाई", "सड़क मरम्मत", "बागवानी"]
    },
    {
        id: "dda",
        nameEn: "Delhi Development Authority (DDA)",
        nameHi: "दिल्ली विकास प्राधिकरण (DDA)",
        badgeEn: "Land, Housing & City Parks",
        badgeHi: "भूमि, आवास एवं डीडीए पार्क",
        descEn: "Encroachment on DDA land, maintenance of district parks, housing society grievance, unauthorized construction.",
        descHi: "डीडीए भूमि पर अवैध कब्जा, जिला पार्कों की दुर्दशा, डीडीए फ्लैट्स समस्या व अनधिकृत निर्माण।",
        email: "memberengineer@dda.org.in",
        phone: "1800-11-0332",
        iconClass: "fa-solid fa-tree-city",
        bgColor: "#9333ea",
        categoriesEn: ["Land Encroachment", "DDA District Park Neglect", "Housing Society Maintenance", "Boundary Wall Damage"],
        categoriesHi: ["सरकारी जमीन पर कब्जा", "डीडीए पार्क की बदहाली", "डीडीए सोसाइटी रखरखाव", "चारदीवारी क्षति"],
        quickTagsEn: ["Land Encroachment", "District Park", "DDA Housing", "Unlawful Construction"],
        quickTagsHi: ["अवैध कब्जा", "डीडीए पार्क", "सोसाइटी रखरखाव", "अवैध निर्माण"]
    },
    {
        id: "electricity",
        nameEn: "BSES / TPDDL (Power Supply)",
        nameHi: "BSES / TPDDL (बिजली आपूर्ति)",
        badgeEn: "Electricity Distribution & Safety",
        badgeHi: "विद्युत वितरण एवं सुरक्षा",
        descEn: "Frequent power outages, loose hanging electric wires, transformer spark, faulty electronic meters.",
        descHi: "बार-बार बिजली कटौती, लटकते बिजली के नंगे तार, ट्रांसफार्मर में स्पार्किंग व तेज चलने वाला मीटर।",
        email: "customercare@bsesdelhi.com",
        phone: "19123 (BSES) / 19124 (TPDDL)",
        iconClass: "fa-solid fa-bolt",
        bgColor: "#ca8a04",
        categoriesEn: ["Unannounced Power Outage", "Dangerous Loose Electric Wires", "Transformer Sparking / Noise", "Faulty Fast Meter"],
        categoriesHi: ["अघोषित बिजली कटौती", "लटकते नंगे तार", "ट्रांसफॉर्मर स्पार्किंग", "खराब / तेज मीटर"],
        quickTagsEn: ["Power Cut", "Hanging Wires", "Transformer Spark", "Meter Fault"],
        quickTagsHi: ["बिजली कटौती", "लटकते तार", "ट्रांसफॉर्मर फॉल्ट", "मीटर खराबी"]
    },
    {
        id: "transport",
        nameEn: "DTC & Delhi Transport Dept",
        nameHi: "डीटीसी एवं दिल्ली परिवहन विभाग",
        badgeEn: "Buses, Auto/Cab Grievance & Metro",
        badgeHi: "बस सेवाएं, ऑटो/कैब व मेट्रो संपर्क",
        descEn: "Bus stop maintenance, non-stopping DTC buses, auto overcharging/refusal, pollution check centers.",
        descHi: "बस स्टॉप की बदहाली, स्टॉप पर बस न रोकना, ऑटो/कैब का अधिक किराया या जाने से मना करना।",
        email: "pco.dtc@delhi.gov.in",
        phone: "1800-11-8181",
        iconClass: "fa-solid fa-bus",
        bgColor: "#e11d48",
        categoriesEn: ["DTC Bus Not Stopping", "Damaged Bus Queue Shelter", "Auto/Cab Refusal or Overcharging", "PUC Center Malpractice"],
        categoriesHi: ["बस स्टॉप पर बस न रोकना", "क्षतिग्रस्त बस स्टॉप", "ऑटो का मना करना / ज्यादा किराया", "प्रदूषण केंद्र धांधली"],
        quickTagsEn: ["Bus Not Stopping", "Damaged Bus Stop", "Auto Overcharging", "Public Transport"],
        quickTagsHi: ["बस नहीं रुकी", "टूटा बस स्टॉप", "ओवरचार्जिंग", "परिवहन समस्या"]
    }
];

// --- I18N BILINGUAL TRANSLATION DICTIONARY ---
const I18N = {
    en: {
        portalTitle: "Delhi NCR Complaint Portal",
        portalSubtitle: "AI-Powered Citizen Grievance Redressal Assistant",
        govInitiative: "Delhi NCR Civic Assistance Tool",
        heroHeading: "File Formal Civic Complaints in 4 Simple Steps",
        heroSubheading: "Generate legal-quality formal grievance letters tailored for MCD, DJB, Delhi Police, PWD, and NDMC in English or Hindi using Gemini AI.",
        historyBtn: "My Complaints",
        langToggleText: "हिंदी में बदलें",
        step1Title: "1. Select Dept",
        step2Title: "2. Details",
        step3Title: "3. AI Draft",
        step4Title: "4. Export & Action",
        selectDeptHeading: "Step 1: Choose Concerned Department",
        selectDeptSubheading: "Select the civic agency responsible for your grievance.",
        searchDeptPlaceholder: "Search department or issue...",
        nextStep: "Continue to Details",
        formHeading: "Step 2: Enter Complaint & Citizen Details",
        formSubheading: "Provide accurate info so the official complaint can be dispatched effectively.",
        labelName: "Full Name",
        placeholderName: "e.g., Rajesh Sharma",
        labelPhone: "Mobile / Email",
        placeholderPhone: "e.g., +91 9876543210",
        labelAddress: "Locality / Address & Ward Number",
        placeholderAddress: "e.g., Pocket B, Mayur Vihar Phase 1, Near Metro Station, Delhi 110091",
        quickIssueTags: "Common Grievance Topics (Click to add):",
        labelUrgency: "Urgency Level",
        urgencyNormal: "Normal Grievance (Standard Resolution)",
        urgencyUrgent: "Urgent Grievance (High Priority)",
        urgencyEmergency: "Emergency / Safety Risk (Immediate Action)",
        labelCategory: "Issue Sub-Category",
        catGeneral: "General Civic Issue",
        labelProblem: "Describe your Problem in Detail",
        placeholderProblem: "Describe the issue clearly: What is the problem? Since how long has it been happening? Exact location or landmark? Impact on residents?",
        tipDetail: "Tip: Providing exact dates and street names helps AI generate a stronger letter.",
        backStep: "Back",
        btnGenerateLetter: "Generate Formal Letter with AI",
        loadingTitle: "Drafting Official Grievance Representation...",
        loadingSubtitle: "Consulting Google Gemini AI & formatting according to Delhi Civic Administration standards.",
        loadStep1: "Analyzing problem context & department protocols",
        loadStep2: "Generating formal legal salutations & reference code",
        loadStep3: "Formatting bilingual document for dispatch",
        letterReadyHeading: "Step 3: Review & Edit Generated Formal Letter",
        letterReadySubheading: "AI has compiled your grievance into an official letter. You can click anywhere to edit before exporting.",
        editToggle: "Enable Direct Editing",
        editingDone: "Done Editing",
        btnRegenerate: "Regenerate AI Letter",
        proceedExport: "Proceed to Export & Share Options",
        exportHeading: "Step 4: Dispatch & Export Grievance",
        exportSubheading: "Choose your preferred channel to send or download the letter.",
        statusReady: "Grievance Letter Ready",
        targetDeptLabel: "Target Agency Contact Information:",
        exportWhatsappTitle: "Share via WhatsApp",
        exportWhatsappDesc: "Send encoded grievance directly to municipal officers or community groups.",
        btnOpenWhatsapp: "Open WhatsApp",
        exportEmailTitle: "Send via Gmail",
        exportEmailDesc: "Opens Gmail with department address, subject & letter pre-filled.",
        btnOpenEmail: "Open Gmail Compose",
        exportCopyTitle: "Copy Text to Clipboard",
        exportCopyDesc: "Copy formatted letter text for pasting into PGMS, CPGRAMS, or 311 Mobile App.",
        btnCopyLetter: "Copy Letter Text",
        exportPdfTitle: "Download PDF Document",
        exportPdfDesc: "Generates a high-quality stylized PDF file formatted like an official government notice.",
        btnDownloadPdf: "Download Printable PDF",
        btnNewComplaint: "File Another Complaint",
        historyTitle: "Saved Complaints History",
        btnClearHistory: "Clear All Saved History",
        noHistoryText: "No past complaints saved yet.",
        toastCopied: "Letter copied to clipboard successfully!",
        toastSaved: "Complaint saved to local history.",
        toastCleared: "Complaint history cleared.",
        toastSelectDept: "Please select a department first.",
        toastFillForm: "Please fill in all required fields (*).",
        disclaimerHeading: "Important Disclaimer",
        disclaimerText: "Disclaimer: This platform is an independent, free tool and is not affiliated with, endorsed by, or representing the Government of Delhi or any government department. It was created solely to help citizens draft professionally formatted grievance letters, as many legitimate complaints are often rejected or ignored due to incorrect formatting. Using this tool does not guarantee official action, but it ensures your concerns are presented effectively."
    },
    hi: {
        portalTitle: "दिल्ली एनसीआर शिकायत पोर्टल",
        portalSubtitle: "एआई-आधारित नागरिक जन-शिकायत निवारण सहायक",
        govInitiative: "दिल्ली एनसीआर नागरिक सहायता सेवा",
        heroHeading: "4 आसान चरणों में दर्ज करें अपनी शिकायत",
        heroSubheading: "एमसीडी, दिल्ली जल बोर्ड, पुलिस, पीडब्ल्यूडी व एनडीएमसी के लिए जैमिनी एआई द्वारा तैयार औपचारिक शिकायत पत्र प्राप्त करें।",
        historyBtn: "मेरी शिकायतें",
        langToggleText: "Switch to English",
        step1Title: "1. विभाग चुनें",
        step2Title: "2. विवरण",
        step3Title: "3. एआई ड्राफ्ट",
        step4Title: "4. डाउनलोड / भेजें",
        selectDeptHeading: "चरण 1: संबंधित विभाग का चयन करें",
        selectDeptSubheading: "अपनी समस्या से संबंधित प्रशासनिक विभाग को चुनें।",
        searchDeptPlaceholder: "विभाग या समस्या खोजें...",
        nextStep: "विवरण भरें",
        formHeading: "चरण 2: शिकायत एवं नागरिक विवरण भरें",
        formSubheading: "सटीक जानकारी दें ताकि आपकी शिकायत पर तुरंत कार्रवाई हो सके।",
        labelName: "शिकायतकर्ता का पूरा नाम",
        placeholderName: "उदा. राजेश शर्मा",
        labelPhone: "मोबाइल नंबर / ईमेल",
        placeholderPhone: "उदा. +91 9876543210",
        labelAddress: "क्षेत्र / पता व वार्ड नंबर",
        placeholderAddress: "उदा. पॉकेट बी, मयूर विहार फेज़ 1, मेट्रो स्टेशन के पास, दिल्ली 110091",
        quickIssueTags: "सामान्य शिकायत विषय (जोड़ने के लिए क्लिक करें):",
        labelUrgency: "प्राथमिकता का स्तर",
        urgencyNormal: "सामान्य शिकायत (मानक समय सीमा)",
        urgencyUrgent: "गंभीर (उच्च प्राथमिकता)",
        urgencyEmergency: "आपातकालीन / सुरक्षा जोखिम (तत्काल कार्रवाई)",
        labelCategory: "समस्या श्रेणी",
        catGeneral: "सामान्य नागरिक समस्या",
        labelProblem: "अपनी समस्या का विस्तृत विवरण दें",
        placeholderProblem: "समस्या का स्पष्ट विवरण दें: समस्या क्या है? कितने दिनों से है? सटीक स्थान या लैंडमार्क क्या है? निवासियों पर क्या प्रभाव पड़ रहा है?",
        tipDetail: "सुझाव: सटीक तारीखें और सड़क का नाम देने से एआई अधिक प्रभावी पत्र लिखता है।",
        backStep: "पीछे जाएं",
        btnGenerateLetter: "एआई द्वारा औपचारिक पत्र तैयार करें",
        loadingTitle: "आधिकारिक शिकायत प्रतिनिधित्व पत्र तैयार किया जा रहा है...",
        loadingSubtitle: "गूगल जैमिनी एआई द्वारा दिल्ली नागरिक प्रशासन प्रारूप के अनुसार पत्र लिखा जा रहा है।",
        loadStep1: "समस्या संदर्भ एवं विभागीय नियमों का विश्लेषण",
        loadStep2: "आधिकारिक संबोधन एवं संदर्भ कोड तैयार करना",
        loadStep3: "द्विभाषी दस्तावेज का अंतिम संपादन",
        letterReadyHeading: "चरण 3: एआई द्वारा तैयार पत्र की समीक्षा एवं संपादन",
        letterReadySubheading: "एआई ने पत्र तैयार कर दिया है। आप निर्यात करने से पहले पत्र पर क्लिक करके बदलाव कर सकते हैं।",
        editToggle: "सीधा संपादन चालू करें",
        editingDone: "संपादन पूर्ण",
        btnRegenerate: "पुनः एआई पत्र बनाएं",
        proceedExport: "निर्यात एवं भेजने के विकल्पों पर जाएं",
        exportHeading: "चरण 4: शिकायत पत्र भेजें या डाउनलोड करें",
        exportSubheading: "अपनी शिकायत भेजने या डाउनलोड करने के लिए अपना पसंदीदा माध्यम चुनें।",
        statusReady: "शिकायत पत्र तैयार है",
        targetDeptLabel: "संबंधित विभाग संपर्क विवरण:",
        exportWhatsappTitle: "व्हाट्सएप (WhatsApp) पर भेजें",
        exportWhatsappDesc: "शिकायत पत्र को सीधे अधिकारी या आरडब्ल्यूए ग्रुप में भेजें।",
        btnOpenWhatsapp: "व्हाट्सएप खोलें",
        exportEmailTitle: "जीमेल (Gmail) द्वारा भेजें",
        exportEmailDesc: "जीमेल खोलता है जिसमें विभाग का पता, विषय व पत्र पहले से भरा होता है।",
        btnOpenEmail: "जीमेल में खोलें",
        exportCopyTitle: "क्लिपबोर्ड पर कॉपी करें",
        exportCopyDesc: "311 ऐप, सीपीजीआरएएमएस या पीजीएमएस पोर्टल पर पेस्ट करने के लिए कॉपी करें।",
        btnCopyLetter: "पत्र कॉपी करें",
        exportPdfTitle: "पीडीएफ (PDF) दस्तावेज डाउनलोड करें",
        exportPdfDesc: "आधिकारिक सरकारी नोटिस प्रारूप में उच्च गुणवत्ता वाली पीडीएफ फाइल डाउनलोड करें।",
        btnDownloadPdf: "प्रिंट योग्य PDF डाउनलोड करें",
        btnNewComplaint: "नई शिकायत दर्ज करें",
        historyTitle: "सहेजी गई शिकायतों का इतिहास",
        btnClearHistory: "सभी इतिहास हटाएं",
        noHistoryText: "अभी तक कोई पुरानी शिकायत सहेजी नहीं गई है।",
        toastCopied: "पत्र सफलतापूर्वक क्लिपबोर्ड पर कॉपी हो गया!",
        toastSaved: "शिकायत इतिहास में सहेज दी गई है।",
        toastCleared: "शिकायत इतिहास हटा दिया गया।",
        toastSelectDept: "कृपया पहले एक विभाग का चयन करें।",
        toastFillForm: "कृपया सभी आवश्यक स्थान (*) भरें।",
        disclaimerHeading: "महत्वपूर्ण अस्वीकरण",
        disclaimerText: "अस्वीकरण: यह प्लेटफ़ॉर्म एक स्वतंत्र, निःशुल्क टूल है और किसी भी तरह से दिल्ली सरकार या किसी सरकारी विभाग से संबद्ध, समर्थित या उसका प्रतिनिधित्व नहीं करता है। इसे केवल नागरिकों को पेशेवर रूप से शिकायत पत्र लिखने में मदद करने के लिए बनाया गया है, क्योंकि अक्सर कई वैध शिकायतें गलत प्रारूप (फॉर्मेट) के कारण खारिज या नज़रअंदाज़ कर दी जाती हैं। इस टूल का उपयोग किसी भी आधिकारिक कार्रवाई की गारंटी नहीं देता है, लेकिन यह सुनिश्चित करता है कि आपकी चिंताओं को प्रभावी ढंग से प्रस्तुत किया जाए।"
    }
};

// --- APPLICATION STATE ---
let currentLang = "en"; // 'en' or 'hi'
let currentStep = 1;
let selectedDepartment = null;
let generatedLetterText = "";
let currentRefCode = "";
let isEditingLetter = false;
let complaintHistory = [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadSavedHistory();
    initDepartmentGrid();
    setupEventListeners();
    updateLanguageUI();
});

// --- LOAD LOCALSTORAGE HISTORY ---
function loadSavedHistory() {
    try {
        const saved = localStorage.getItem("delhi_ncr_complaints");
        if (saved) {
            complaintHistory = JSON.parse(saved);
            updateHistoryCountBadge();
        }
    } catch (e) {
        console.error("Failed to load history from localStorage", e);
    }
}

function saveComplaintToHistory(complaintObj) {
    complaintHistory.unshift(complaintObj);
    if (complaintHistory.length > 20) complaintHistory.pop(); // Keep last 20
    try {
        localStorage.setItem("delhi_ncr_complaints", JSON.stringify(complaintHistory));
        updateHistoryCountBadge();
        renderHistoryDrawer();
    } catch (e) {
        console.error("Failed to save history", e);
    }
}

function updateHistoryCountBadge() {
    const badge = document.getElementById("history-count");
    if (badge) badge.textContent = complaintHistory.length;
}

// --- DEPARTMENT GRID RENDERER ---
function initDepartmentGrid(filterText = "") {
    const container = document.getElementById("dept-grid-container");
    if (!container) return;
    container.innerHTML = "";

    const filtered = DEPARTMENTS.filter(d => {
        if (!filterText) return true;
        const q = filterText.toLowerCase();
        const name = currentLang === "hi" ? d.nameHi : d.nameEn;
        const desc = currentLang === "hi" ? d.descHi : d.descEn;
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; margin-bottom: 0.5rem; display:block;"></i>
            ${currentLang === "hi" ? "कोई संबंधित विभाग नहीं मिला।" : "No matching departments found."}
        </div>`;
        return;
    }

    filtered.forEach(dept => {
        const isSelected = selectedDepartment && selectedDepartment.id === dept.id;
        const name = currentLang === "hi" ? dept.nameHi : dept.nameEn;
        const badge = currentLang === "hi" ? dept.badgeHi : dept.badgeEn;
        const desc = currentLang === "hi" ? dept.descHi : dept.descEn;

        const card = document.createElement("div");
        card.className = `dept-card ${isSelected ? 'selected' : ''}`;
        card.setAttribute("data-dept-id", dept.id);
        card.innerHTML = `
            <i class="fa-solid fa-circle-check dept-card-check"></i>
            <div>
                <div class="dept-card-top">
                    <div class="dept-icon-wrapper" style="background: ${dept.bgColor};">
                        <i class="${dept.iconClass}"></i>
                    </div>
                    <div class="dept-info">
                        <span>${badge}</span>
                        <h4>${name}</h4>
                    </div>
                </div>
                <p class="dept-desc">${desc}</p>
            </div>
            <div class="dept-contact-tag">
                <i class="fa-solid fa-envelope"></i> ${dept.email}
            </div>
        `;

        card.addEventListener("click", () => selectDepartment(dept));
        container.appendChild(card);
    });
}

// --- DEPARTMENT SELECTION ---
function selectDepartment(dept) {
    selectedDepartment = dept;
    // Highlight active card
    document.querySelectorAll(".dept-card").forEach(c => c.classList.remove("selected"));
    const activeCard = document.querySelector(`[data-dept-id="${dept.id}"]`);
    if (activeCard) activeCard.classList.add("selected");

    // Enable step 1 continue button
    const btnNext = document.getElementById("btn-goto-step-2");
    if (btnNext) btnNext.disabled = false;

    // Update Step 2 Header Badge & Form Dropdowns
    const deptBadgeText = document.getElementById("selected-dept-name-text");
    if (deptBadgeText) {
        deptBadgeText.textContent = currentLang === "hi" ? dept.nameHi : dept.nameEn;
    }

    populateSubCategories(dept);
    populateQuickTags(dept);
}

function populateSubCategories(dept) {
    const select = document.getElementById("issue-category");
    if (!select) return;
    select.innerHTML = "";

    const categories = currentLang === "hi" ? dept.categoriesHi : dept.categoriesEn;
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

function populateQuickTags(dept) {
    const box = document.getElementById("quick-tags-box");
    if (!box) return;
    box.innerHTML = "";

    const tags = currentLang === "hi" ? dept.quickTagsHi : dept.quickTagsEn;
    tags.forEach(tag => {
        const pill = document.createElement("span");
        pill.className = "tag-pill";
        pill.textContent = `+ ${tag}`;
        pill.addEventListener("click", () => {
            const textarea = document.getElementById("user-problem");
            if (textarea) {
                if (textarea.value.trim().length > 0) {
                    textarea.value += `, ${tag}`;
                } else {
                    textarea.value = tag;
                }
                updateCharCounter();
            }
        });
        box.appendChild(pill);
    });
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
    // Language Toggle
    const langBtn = document.getElementById("btn-lang-toggle");
    if (langBtn) {
        langBtn.addEventListener("click", toggleLanguage);
    }

    // Dept Search
    const searchInput = document.getElementById("dept-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            initDepartmentGrid(e.target.value);
        });
    }

    // Step Navigation
    document.getElementById("btn-goto-step-2").addEventListener("click", () => {
        if (!selectedDepartment) {
            showToast(I18N[currentLang].toastSelectDept, "error");
            return;
        }
        goToStep(2);
    });

    document.getElementById("btn-back-to-1").addEventListener("click", () => goToStep(1));
    document.getElementById("btn-back-to-2").addEventListener("click", () => goToStep(2));
    document.getElementById("btn-back-to-3").addEventListener("click", () => goToStep(3));

    // Generate AI Letter Button
    document.getElementById("btn-generate-ai").addEventListener("click", handleGenerateLetter);
    document.getElementById("btn-regenerate").addEventListener("click", handleGenerateLetter);

    // Proceed to Step 4 Export
    document.getElementById("btn-goto-step-4").addEventListener("click", () => {
        prepareExportData();
        goToStep(4);
    });

    // Start New Complaint
    document.getElementById("btn-start-new").addEventListener("click", resetWizard);

    // Character Counter
    const textarea = document.getElementById("user-problem");
    if (textarea) {
        textarea.addEventListener("input", updateCharCounter);
    }

    // Toggle Direct Letter Editing
    const btnEdit = document.getElementById("btn-toggle-edit");
    if (btnEdit) {
        btnEdit.addEventListener("click", toggleLetterEditable);
    }

    // Export Buttons
    document.getElementById("btn-copy-text").addEventListener("click", handleCopyText);
    document.getElementById("btn-download-pdf").addEventListener("click", handleDownloadPDF);

    // History Drawer Triggers
    document.getElementById("btn-history").addEventListener("click", openHistoryDrawer);
    document.getElementById("btn-close-drawer").addEventListener("click", closeHistoryDrawer);
    document.getElementById("history-drawer-overlay").addEventListener("click", closeHistoryDrawer);
    document.getElementById("btn-clear-history").addEventListener("click", clearHistory);
}

// --- CHARACTER COUNTER ---
function updateCharCounter() {
    const textarea = document.getElementById("user-problem");
    const counter = document.getElementById("char-counter");
    if (textarea && counter) {
        counter.textContent = `${textarea.value.length} / 1000 characters`;
    }
}

// --- WIZARD STEP NAVIGATOR ---
function goToStep(stepNumber) {
    currentStep = stepNumber;

    // Update Step Pane visibility
    document.querySelectorAll(".wizard-step").forEach(pane => pane.classList.remove("active"));
    const targetPane = document.getElementById(`step-${stepNumber}`);
    if (targetPane) targetPane.classList.add("active");

    // Update Progress Bar Track Fill
    const fill = document.getElementById("wizard-progress-fill");
    if (fill) {
        const percentages = { 1: "0%", 2: "33%", 3: "66%", 4: "100%" };
        fill.style.width = percentages[stepNumber] || "0%";
    }

    // Update Wizard Nodes
    for (let i = 1; i <= 4; i++) {
        const node = document.getElementById(`node-step-${i}`);
        if (!node) continue;
        node.classList.remove("active", "completed");
        if (i === stepNumber) {
            node.classList.add("active");
        } else if (i < stepNumber) {
            node.classList.add("completed");
        }
    }

    window.scrollTo({ top: 200, behavior: "smooth" });
}

// --- BILINGUAL LANGUAGE SWITCH ENGINE ---
function toggleLanguage() {
    currentLang = currentLang === "en" ? "hi" : "en";
    document.body.className = currentLang === "hi" ? "lang-hi" : "lang-en";
    updateLanguageUI();
}

function updateLanguageUI() {
    const dict = I18N[currentLang];

    // Update elements with data-i18n attributes
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    // Update Language Toggle Button text
    const toggleText = document.getElementById("lang-toggle-text");
    if (toggleText) toggleText.textContent = dict.langToggleText;

    // Re-render Department Grid to update translated card text
    const searchVal = document.getElementById("dept-search-input")?.value || "";
    initDepartmentGrid(searchVal);

    // Re-populate categories & quick tags if dept selected
    if (selectedDepartment) {
        const deptBadgeText = document.getElementById("selected-dept-name-text");
        if (deptBadgeText) {
            deptBadgeText.textContent = currentLang === "hi" ? selectedDepartment.nameHi : selectedDepartment.nameEn;
        }
        populateSubCategories(selectedDepartment);
        populateQuickTags(selectedDepartment);
    }
}

// --- AI GENERATION HANDLER (GEMINI API + FALLBACK) ---
async function handleGenerateLetter() {
    const userName = document.getElementById("user-name")?.value.trim();
    const userPhone = document.getElementById("user-phone")?.value.trim();
    const userAddress = document.getElementById("user-address")?.value.trim();
    const urgency = document.getElementById("urgency-level")?.value;
    const category = document.getElementById("issue-category")?.value;
    const problem = document.getElementById("user-problem")?.value.trim();

    if (!userName || !userAddress || !problem) {
        showToast(I18N[currentLang].toastFillForm, "error");
        return;
    }

    // Generate unique reference code
    currentRefCode = `DEL-${new Date().getFullYear()}-${selectedDepartment.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Show Step 3 & Loading Screen
    goToStep(3);
    const loadingScreen = document.getElementById("ai-loading-screen");
    const resultScreen = document.getElementById("ai-result-screen");
    if (loadingScreen) loadingScreen.classList.remove("hidden");
    if (resultScreen) resultScreen.classList.add("hidden");

    let letterResult = "";

    // Try Gemini API first if key is provided and not default placeholder
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY") {
        try {
            letterResult = await fetchGeminiLetter({
                name: userName,
                phone: userPhone,
                address: userAddress,
                urgency: urgency,
                category: category,
                problem: problem,
                dept: selectedDepartment,
                lang: currentLang
            });
        } catch (err) {
            console.warn("Gemini API call failed or failed to reach. Falling back to client-side generator:", err);
            letterResult = generateFallbackLetter({
                name: userName,
                phone: userPhone,
                address: userAddress,
                urgency: urgency,
                category: category,
                problem: problem,
                dept: selectedDepartment,
                lang: currentLang
            });
        }
    } else {
        // Simulate realistic 1.2s AI generation delay for user feedback
        await new Promise(r => setTimeout(r, 1200));
        letterResult = generateFallbackLetter({
            name: userName,
            phone: userPhone,
            address: userAddress,
            urgency: urgency,
            category: category,
            problem: problem,
            dept: selectedDepartment,
            lang: currentLang
        });
    }

    generatedLetterText = letterResult;

    // Render generated letter onto paper
    renderLetterPaper(userName, userAddress, userPhone);

    // Hide Loading, Show Result Screen
    if (loadingScreen) loadingScreen.classList.add("hidden");
    if (resultScreen) resultScreen.classList.remove("hidden");

    // Save to history
    saveComplaintToHistory({
        refCode: currentRefCode,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        deptName: currentLang === "hi" ? selectedDepartment.nameHi : selectedDepartment.nameEn,
        name: userName,
        problem: problem.substring(0, 100) + "...",
        fullLetter: generatedLetterText
    });
}

// --- GEMINI API FETCH FUNCTION ---
async function fetchGeminiLetter(data) {
    const deptName = data.lang === "hi" ? data.dept.nameHi : data.dept.nameEn;

    const promptText = data.lang === "hi" ?
`आप दिल्ली राष्ट्रीय राजधानी क्षेत्र (NCR) के नागरिक प्रशासन हेतु एक विशेषज्ञ कानूनी शिकायत लेखक हैं।
नीचे दी गई जानकारी का उपयोग करके ${deptName} के मुख्य अधिकारी को संबोधित एक अत्यंत औपचारिक, प्रभावशाली और नियमबद्ध शिकायत पत्र लिखें।

शिकायतकर्ता का नाम: ${data.name}
संपर्क विवरण: ${data.phone || 'उपलब्ध नहीं'}
स्थान/पता: ${data.address}
प्राथमिकता स्तर: ${data.urgency}
समस्या श्रेणी: ${data.category}
समस्या का विवरण: ${data.problem}

पत्र का प्रारूप:
1. सेवा में, (मुख्य कार्यकारी अधिकारी / अधिशासी अभियंता, ${deptName}, दिल्ली)
2. विषय: ${data.category} एवं ${data.address} में नागरिक समस्या निवारण हेतु।
3. महोदय/महोदया, (संबोधन)
4. निकाय (Paragraphs): घटना और नागरिक परेशानी का स्पष्ट ब्योरा, सार्वजनिक स्वास्थ्य/सुरक्षा पर प्रभाव, और दिल्ली नागरिक सेवा मानकों के तहत शीघ्र निवारण का अनुरोध।
5. धन्यवाद एवं भवदीय: ${data.name}

केवल पत्र का पाठ (plain text) दें। अतिरिक्त कमेंटरी या मार्कडाउन टैग्स न जोड़ें।`
:
`You are an expert civic complaint writer for the Delhi National Capital Territory (NCT) Governance Portal.
Using the following information, draft a highly formal, persuasive, legal-grade official representation letter addressed to the Executive Engineer / Authority of ${deptName}.

Complainant Name: ${data.name}
Contact Info: ${data.phone || 'N/A'}
Locality / Address: ${data.address}
Urgency Level: ${data.urgency}
Category: ${data.category}
Problem Description: ${data.problem}

Format Structure:
- TO: The Executive Engineer / Competent Authority, ${deptName}, Delhi NCR.
- SUBJECT: Formal Grievance Representation regarding ${data.category} at ${data.address}.
- SALUTATION: Respected Sir / Madam,
- BODY PARAGRAPHS: Detailed description of the problem, duration, public impact on health/safety, reference to civic compliance standards, and an urgent request for site inspection and rectification within specified timeframe.
- CLOSING: Yours Sincerely, ${data.name}.

Return ONLY the raw formatted letter text without markdown backticks or commentary.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: promptText }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resJson = await response.json();
    const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Invalid response format from Gemini API");
    return text.replace(/```[a-z]*/gi, '').trim();
}

// --- CLIENT-SIDE SMART FALLBACK GENERATOR ---
function generateFallbackLetter(data) {
    const deptName = data.lang === "hi" ? data.dept.nameHi : data.dept.nameEn;
    const todayStr = new Date().toLocaleDateString(data.lang === "hi" ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    if (data.lang === "hi") {
        return `सेवा में,
मुख्य कार्यकारी अधिकारी / संबंधित अधिकारी,
${deptName},
राष्ट्रीय राजधानी क्षेत्र दिल्ली (GNCTD)।

विषय: ${data.address} क्षेत्र में ${data.category} की गंभीर समस्या के निवारण हेतु औपचारिक शिकायत।

महोदय/महोदया,

सप्रमाण निवेदन है कि मैं, ${data.name}, दिल्ली के ${data.address} का निवासी हूँ। मैं इस पत्र के माध्यम से आपके सम्मानित विभाग का ध्यान हमारे क्षेत्र में व्याप्त गंभीर नागरिक समस्या की ओर आकृष्ट कराना चाहता हूँ।

विगत कुछ समय से हमारे क्षेत्र में निम्नलिखित समस्या बनी हुई है:
"${data.problem}"

उक्त समस्या के कारण स्थानीय निवासियों, महिलाओं, बच्चों एवं बुजुर्गों को अत्यधिक असुविधा एवं स्वास्थ्य/सुरक्षा संबंधी जोखिमों का सामना करना पड़ रहा है। बार-बार ध्यान आकर्षित करने के बावजूद स्थिति में अपेक्षित सुधार नहीं हो पाया है।

दिल्ली सरकार के नागरिक सेवा गारंटी अधिनियम एवं सार्वजनिक शिकायत निवारण दिशानिर्देशों के तहत, आम नागरिकों को स्वच्छ एवं सुरक्षित वातावरण प्राप्त करने का मौलिक अधिकार है। प्राथमिकता स्तर (${data.urgency}) को ध्यान में रखते हुए, आपसे विनम्र अनुरोध है कि:

1. संबंधित कनिष्ठ अभियंता / निरीक्षक टीम को तुरंत स्थल निरीक्षण (Site Inspection) हेतु निर्देशित करें।
2. इस समस्या के स्थायी समाधान हेतु आवश्यक मरम्मत / कार्रवाई अविलंब प्रारंभ की जाए।
3. कृत कार्रवाई की सूचना शिकायतकर्ता को दी जाए।

आपकी शीघ्र एवं सकारात्मक कार्रवाई हेतु हम सदैव आभारी रहेंगे।

धन्यवाद।

भवदीय,
${data.name}
पता: ${data.address}
संपर्क: ${data.phone || 'N/A'}`;
    } else {
        return `To,
The Executive Engineer / Competent Authority,
${deptName},
Government of NCT of Delhi, New Delhi.

SUBJECT: Formal Representation regarding Urgent Grievance of "${data.category}" at ${data.address}.

Respected Sir / Madam,

I am writing this formal representation to bring to your urgent attention a persistent civic issue impacting the residents of ${data.address}. 

DETAILS OF GRIEVANCE:
"${data.problem}"

IMPACT ON RESIDENTS:
Due to the unaddressed state of this problem, local residents, commuters, and senior citizens are subjected to severe inconvenience and potential safety hazards on a daily basis. Despite previous verbal representations, the issue remains unresolved.

REQUEST FOR RECTIFICATION:
In accordance with the Public Grievance Redressal Mechanism and Delhi Citizen Charter guidelines, I respectfully request your office to:
1. Depute a field officer or technical team for an immediate on-site inspection.
2. Initiate prompt corrective measures to resolve the issue permanently within standard resolution timelines.
3. Provide an official acknowledgement and progress status to the complainant.

Considering the urgency level assigned to this matter (${data.urgency}), we anticipate swift and conclusive action from your esteemed department.

Thanking You.

Yours Faithfully,

${data.name}
Address: ${data.address}
Phone/Contact: ${data.phone || 'N/A'}`;
    }
}

// --- RENDER PAPER PREVIEW ---
function renderLetterPaper(userName, userAddress, userPhone) {
    const refEl = document.getElementById("letter-ref-code");
    const dateEl = document.getElementById("letter-date");
    const bodyEl = document.getElementById("letter-text-container");
    const sigName = document.getElementById("letter-signature-name");

    if (refEl) refEl.textContent = currentRefCode;
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    if (bodyEl) bodyEl.innerText = generatedLetterText;
    if (sigName) sigName.textContent = userName;
}

// --- TOGGLE EDITABLE MODE ---
function toggleLetterEditable() {
    const bodyEl = document.getElementById("letter-text-container");
    const label = document.getElementById("edit-toggle-label");
    const btn = document.getElementById("btn-toggle-edit");

    if (!bodyEl) return;

    isEditingLetter = !isEditingLetter;
    if (isEditingLetter) {
        bodyEl.setAttribute("contenteditable", "true");
        bodyEl.focus();
        if (label) label.textContent = I18N[currentLang].editingDone;
        if (btn) btn.classList.add("btn-accent");
    } else {
        bodyEl.setAttribute("contenteditable", "false");
        generatedLetterText = bodyEl.innerText;
        if (label) label.textContent = I18N[currentLang].editToggle;
        if (btn) btn.classList.remove("btn-accent");
        showToast("Edits saved successfully!", "success");
    }
}

// --- PREPARE EXPORT DATA FOR STEP 4 ---
function prepareExportData() {
    const deptTitle = document.getElementById("export-dept-title");
    const deptEmail = document.getElementById("export-dept-email");
    const deptPhone = document.getElementById("export-dept-phone");

    if (deptTitle) deptTitle.textContent = currentLang === "hi" ? selectedDepartment.nameHi : selectedDepartment.nameEn;
    if (deptEmail) deptEmail.textContent = selectedDepartment.email;
    if (deptPhone) deptPhone.textContent = selectedDepartment.phone;

    const category = document.getElementById("issue-category")?.value || "Civic Issue";
    const subject = `Formal Grievance: ${category} - Ref ${currentRefCode}`;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(generatedLetterText);

    // Setup WhatsApp Link
    const waBtn = document.getElementById("btn-share-whatsapp");
    if (waBtn) {
        const waText = `*OFFICIAL CIVIC GRIEVANCE LETTER*\n*Ref:* ${currentRefCode}\n*Dept:* ${selectedDepartment.nameEn}\n\n${generatedLetterText}`;
        waBtn.href = `https://wa.me/?text=${encodeURIComponent(waText)}`;
    }

    // Setup Gmail Compose Link
    const emailBtn = document.getElementById("btn-send-email");
    if (emailBtn) {
        emailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(selectedDepartment.email)}&su=${encodedSubject}&body=${encodedBody}`;
    }
}

// --- EXPORT HANDLERS ---
function handleCopyText() {
    if (!generatedLetterText) return;
    navigator.clipboard.writeText(generatedLetterText).then(() => {
        showToast(I18N[currentLang].toastCopied, "success");
    }).catch(err => {
        console.error("Copy failed", err);
    });
}

function handleDownloadPDF() {
    const paperElement = document.getElementById("printable-letter-paper");
    if (!paperElement) return;

    showToast("Preparing PDF document...", "success");

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Grievance_${selectedDepartment.id.toUpperCase()}_${currentRefCode}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        window.html2pdf().set(opt).from(paperElement).save().then(() => {
            showToast("PDF downloaded successfully!", "success");
        });
    } else {
        alert("html2pdf library loading... Please check internet connection.");
    }
}

// --- RESET WIZARD ---
function resetWizard() {
    selectedDepartment = null;
    generatedLetterText = "";
    currentRefCode = "";

    const form = document.getElementById("complaint-form");
    if (form) form.reset();
    updateCharCounter();

    const searchInput = document.getElementById("dept-search-input");
    if (searchInput) searchInput.value = "";
    initDepartmentGrid();

    const btnNext = document.getElementById("btn-goto-step-2");
    if (btnNext) btnNext.disabled = true;

    goToStep(1);
}

// --- HISTORY DRAWER HANDLERS ---
function openHistoryDrawer() {
    renderHistoryDrawer();
    document.getElementById("history-drawer")?.classList.add("active");
    document.getElementById("history-drawer-overlay")?.classList.add("active");
}

function closeHistoryDrawer() {
    document.getElementById("history-drawer")?.classList.remove("active");
    document.getElementById("history-drawer-overlay")?.classList.remove("active");
}

function renderHistoryDrawer() {
    const container = document.getElementById("history-list-container");
    if (!container) return;
    container.innerHTML = "";

    if (complaintHistory.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
            <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 0.75rem; color: #cbd5e1; display:block;"></i>
            ${I18N[currentLang].noHistoryText}
        </div>`;
        return;
    }

    complaintHistory.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
            <div class="history-card-header">
                <span class="history-ref">${item.refCode}</span>
                <span>${item.date}</span>
            </div>
            <h5>${item.deptName}</h5>
            <p class="history-snippet">${item.problem}</p>
            <div class="history-actions">
                <button class="btn-sm btn-outline" onclick="copyHistoryLetter(${index})">
                    <i class="fa-regular fa-copy"></i> Copy
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function copyHistoryLetter(index) {
    const item = complaintHistory[index];
    if (item && item.fullLetter) {
        navigator.clipboard.writeText(item.fullLetter).then(() => {
            showToast("Copied saved letter!", "success");
        });
    }
}

function clearHistory() {
    complaintHistory = [];
    localStorage.removeItem("delhi_ncr_complaints");
    updateHistoryCountBadge();
    renderHistoryDrawer();
    showToast(I18N[currentLang].toastCleared, "success");
}

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
