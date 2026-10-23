/**
 * Plantexa - Botanical Studio Frontend Controller
 * Minimalist, elegant plant care and diagnosis interface.
 * Zero emojis, zero technical jargon, fully accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = '';

  // App State
  const state = {
    selectedFile: null,
    currentPrediction: null,
    currentDiseaseInfo: null,
    chatMessages: [
      {
        role: 'assistant',
        content: 'Hello! I am your AI Plant Assistant. How can I help with your crops, garden soil, or plant care today?'
      }
    ],
    userProfile: {
      name: 'Farmer Jyoti',
      avatar: 'farmer'
    },
    language: 'English',
    diseasesData: {}
  };

  const AVATAR_ICONS = {
    farmer: '<i class="fa-solid fa-user" aria-hidden="true"></i>',
    gardener: '<i class="fa-solid fa-seedling" aria-hidden="true"></i>',
    agronomist: '<i class="fa-solid fa-wheat-awn" aria-hidden="true"></i>',
    enthusiast: '<i class="fa-solid fa-leaf" aria-hidden="true"></i>',
    default: '<i class="fa-solid fa-user" aria-hidden="true"></i>'
  };

  const i18n = {
    English: {
      htmlLang: 'en',
      nav: ['Diagnose', 'Plant Library', 'AI Assistant', 'About'],
      heroEyebrow: '',
      heroTitle: 'Leaf Health & Care Diagnosis',
      heroBody: 'Upload or capture a clear photo of an affected leaf to identify plant issues, explore natural treatments, and keep your garden thriving.',
      uploadTitle: 'Leaf Photo',
      modeUpload: 'Upload',
      modeCamera: 'Camera',
      dropPrompt: 'Drag a leaf photo here, or browse files',
      dropSupport: 'Clear daylight photos work best (JPG, PNG, WEBP, HEIC)',
      takePhoto: 'Take Photo',
      retakePhoto: 'Retake',
      analyzeButton: 'Check Plant Health',
      resultsTitle: 'Health Assessment',
      resultPlaceholderTitle: 'No Photo Selected',
      resultPlaceholderText: 'Upload a leaf image or take a quick photo, then click Check Plant Health to see a diagnosis and care plan.',
      resultLoader: 'Analyzing leaf health and symptoms...',
      matchTitle: 'Condition Matches',
      matchSubtitle: 'Likelihood comparison',
      inspectAreasBtn: 'Inspect Affected Leaf Areas',
      inspectCaption: 'Highlighted areas indicate foliage regions showing early signs of distress.',
      symptoms: 'Symptoms',
      causes: 'Causes',
      treatment: 'Treatment & Care',
      prevention: 'Prevention',
      downloadPdfCare: 'Download PDF Care Sheet',
      askDoctor: 'Ask AI Assistant',
      knowledgeTitle: 'Plant Library',
      knowledgeBody: '',
      knowledgeSearch: 'Search...',
      assistantTitle: 'AI Assistant',
      assistantBody: 'Ask questions about plant diseases, soil health, organic treatments, or watering schedules.',
      assistantGreeting: 'Hello! I am your AI Plant Assistant. How can I help with your crops, garden soil, or plant care today?',
      chip1: 'How to spot leaf distress early?',
      chip2: 'Natural organic pest remedies',
      chip3: 'How to improve soil vitality?',
      chatPlaceholder: 'Ask a question about your plants or crops...',
      exportPdf: 'Export PDF',
      clearChat: 'Clear Chat',
      profileTitle: 'Farmer Profile',
      profileLabel: 'Your Name or Farm Handle',
      profileRole: 'Your Role on the Farm',
      saveProfile: 'Save Profile',
      diseaseModalTitle: 'Condition Details',
      floatingChat: 'Chat with AI Assistant',
      leafConfirmed: 'Leaf Identified',
      leafUncertain: 'Check Photo Focus'
    },
    Hindi: {
      htmlLang: 'hi',
      nav: ['निदान', 'पौधा पुस्तकालय', 'एआई सहायक', 'परिचय'],
      heroEyebrow: '',
      heroTitle: 'पत्ती स्वास्थ्य व रोग निदान',
      heroBody: 'पौधे की पत्ती का स्पष्ट फोटो लें या अपलोड करें ताकि बीमारी की तुरंत पहचान हो सके और प्राकृतिक उपचार मिल सके।',
      uploadTitle: 'पत्ती का फोटो',
      modeUpload: 'अपलोड',
      modeCamera: 'कैमरा',
      dropPrompt: 'पत्ती की तस्वीर यहाँ खींचें या फ़ाइल चुनें',
      dropSupport: 'साफ़ दिन की रोशनी में ली गई तस्वीर सबसे अच्छी होती है (JPG, PNG, WEBP)',
      takePhoto: 'फोटो लें',
      retakePhoto: 'फिर से लें',
      analyzeButton: 'पौधे का स्वास्थ्य जाँचें',
      resultsTitle: 'स्वास्थ्य रिपोर्ट',
      resultPlaceholderTitle: 'कोई फोटो नहीं चुनी गई',
      resultPlaceholderText: 'ऊपर पत्ती की फोटो अपलोड करें और तुरंत उपचार योजना देखने के लिए स्वास्थ्य जाँचें पर क्लिक करें।',
      resultLoader: 'पत्ती के स्वास्थ्य व लक्षणों की जाँच की जा रही है...',
      matchTitle: 'संभावित बीमारियाँ',
      matchSubtitle: 'समानता प्रतिशत',
      inspectAreasBtn: 'प्रभावित हिस्से देखें',
      inspectCaption: 'उजागर किए गए हिस्से पत्ती में रोग के शुरुआती प्रभाव को दर्शाते हैं।',
      symptoms: 'लक्षण',
      causes: 'कारण',
      treatment: 'उपचार व देखभाल',
      prevention: 'बचाव के उपाय',
      downloadPdfCare: 'देखभाल पत्रक PDF डाउनलोड करें',
      askDoctor: 'एआई सहायक से पूछें',
      knowledgeTitle: 'पौधा पुस्तकालय',
      knowledgeBody: '',
      knowledgeSearch: 'खोजें...',
      assistantTitle: 'एआई सहायक',
      assistantBody: 'फसल की देखभाल, जैविक खाद, कीट नियंत्रण या सिंचाई संबंधी प्रश्न पूछें।',
      assistantGreeting: 'नमस्ते! मैं आपका एआई प्लांट सहायक हूँ। आज आपके बगीचे या खेत की देखभाल में कैसे मदद कर सकता हूँ?',
      chip1: 'पत्ती के रोगों की जल्दी पहचान कैसे करें?',
      chip2: 'कीटों से बचाव के प्राकृतिक जैविक उपाय',
      chip3: 'मिट्टी की उर्वरता कैसे बढ़ाएँ?',
      chatPlaceholder: 'पौधों की देखभाल संबंधी प्रश्न पूछें...',
      exportPdf: 'PDF निर्यात',
      clearChat: 'चैट साफ़ करें',
      profileTitle: 'किसान प्रोफ़ाइल',
      profileLabel: 'आपका नाम',
      profileRole: 'खेत में आपकी भूमिका',
      saveProfile: 'प्रोफ़ाइल सहेजें',
      diseaseModalTitle: 'रोग संबंधी जानकारी',
      floatingChat: 'एआई सहायक से बातचीत करें',
      leafConfirmed: 'पत्ती की पहचान सफल',
      leafUncertain: 'फोटो पर फिर से फ़ोकस करें'
    },
    Odia: {
      htmlLang: 'or',
      nav: ['ନିଦାନ', 'ଉଦ୍ଭିଦ ପୁସ୍ତକାଳୟ', 'AI ସହାୟକ', 'ସୂଚନା'],
      heroEyebrow: '',
      heroTitle: 'ପତ୍ର ସ୍ୱାସ୍ଥ୍ୟ ଓ ଯତ୍ନ ପରାମର୍ଶ',
      heroBody: 'ପତ୍ରର ଏକ ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ଉଠାନ୍ତୁ, ଯାହାଦ୍ୱାରା ରୋଗ ଚିହ୍ନଟ ହୋଇ ପ୍ରାକୃତିକ ଉପଚାର ମିଳିପାରିବ।',
      uploadTitle: 'ପତ୍ରର ଫଟୋ',
      modeUpload: 'ଅପଲୋଡ୍',
      modeCamera: 'କ୍ୟାମେରା',
      dropPrompt: 'ପତ୍ର ଫଟୋ ଏଠାରେ ରଖନ୍ତୁ କିମ୍ବା ଫାଇଲ୍ ଚୟନ କରନ୍ତୁ',
      dropSupport: 'ଦିନର ସ୍ପଷ୍ଟ ଆଲୋକରେ ଉଠାଯାଇଥିବା ଫଟୋ ଉତ୍ତମ ଫଳାଫଳ ଦିଏ',
      takePhoto: 'ଫଟୋ ଉଠାନ୍ତୁ',
      retakePhoto: 'ପୁନର୍ବାର ଉଠାନ୍ତୁ',
      analyzeButton: 'ଗଛର ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରନ୍ତୁ',
      resultsTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ରିପୋର୍ଟ',
      resultPlaceholderTitle: 'କୌଣସି ଫଟୋ ଚୟନ ହୋଇନାହିଁ',
      resultPlaceholderText: 'ଉପରେ ପତ୍ରର ଫଟୋ ଦିଅନ୍ତୁ ଏବଂ ଚିକିତ୍ସା ଯୋଜନା ପାଇବା ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରନ୍ତୁ କ୍ଲିକ୍ କରନ୍ତୁ।',
      resultLoader: 'ପତ୍ରର ସ୍ୱାସ୍ଥ୍ୟ ଓ ଲକ୍ଷଣ ଯାଞ୍ଚ କରାଯାଉଛି...',
      matchTitle: 'ସମ୍ଭାବ୍ୟ ରୋଗ ସମୂହ',
      matchSubtitle: 'ସମ୍ଭାବ୍ୟତା ତୁଳନା',
      inspectAreasBtn: 'ପ୍ରଭାବିତ ପତ୍ର ଅଂଶ ଦେଖନ୍ତୁ',
      inspectCaption: 'ଚିହ୍ନିତ ଅଂଶଗୁଡ଼ିକ ରୋଗର ପ୍ରାଥମିକ ପ୍ରଭାବ ଦର୍ଶାଏ।',
      symptoms: 'ଲକ୍ଷଣ',
      causes: 'କାରଣ',
      treatment: 'ଚିକିତ୍ସା ଓ ପରିଚାଳନା',
      prevention: 'ପ୍ରତିରୋଧକ ଉପାୟ',
      downloadPdfCare: 'ଯତ୍ନ ତାଲିକା PDF ଡାଉନଲୋଡ୍',
      askDoctor: 'AI ସହାୟକଙ୍କୁ ପଚାରନ୍ତୁ',
      knowledgeTitle: 'ଉଦ୍ଭିଦ ପୁସ୍ତକାଳୟ',
      knowledgeBody: '',
      knowledgeSearch: 'ସନ୍ଧାନ କରନ୍ତୁ...',
      assistantTitle: 'AI ସହାୟକ',
      assistantBody: 'ଫସଲ ଯତ୍ନ, ଜୈବିକ ସାର, କୀଟ ନିୟନ୍ତ୍ରଣ କିମ୍ବା ଜଳସେଚନ ବିଷୟରେ ପଚାରନ୍ତୁ।',
      assistantGreeting: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର AI ପ୍ଲାଣ୍ଟ ସହାୟକ। ଆଜି ଆପଣଙ୍କ ବଗିଚା କିମ୍ବା ଫସଲ ବିଷୟରେ କି ସାହାଯ୍ୟ କରିପାରିବି?',
      chip1: 'ପତ୍ର ରୋଗ ଶୀଘ୍ର କିପରି ଚିହ୍ନିବେ?',
      chip2: 'କୀଟ ନିୟନ୍ତ୍ରଣ ପାଇଁ ପ୍ରାକୃତିକ ଉପାୟ',
      chip3: 'ମାଟିର ଉର୍ବରତା କିପରି ବୃଦ୍ଧି କରିବେ?',
      chatPlaceholder: 'ଆପଣଙ୍କର ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
      exportPdf: 'PDF ରପ୍ତାନି',
      clearChat: 'ଚାଟ୍ ସଫା କରନ୍ତୁ',
      profileTitle: 'କୃଷକ ପ୍ରୋଫାଇଲ୍',
      profileLabel: 'ଆପଣଙ୍କ ନାମ',
      profileRole: 'ଖମାରରେ ଆପଣଙ୍କ ଭୂମିକା',
      saveProfile: 'ସଞ୍ଚୟ କରନ୍ତୁ',
      diseaseModalTitle: 'ରୋଗ ବିବରଣୀ',
      floatingChat: 'AI ସହାୟକଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ',
      leafConfirmed: 'ପତ୍ର ଚିହ୍ନଟ ସଫଳ',
      leafUncertain: 'ଫଟୋର ଫୋକସ୍ ଯାଞ୍ଚ କରନ୍ତୁ'
    }
  };

  // DOM Elements
  const navTabs = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const languageSelect = document.getElementById('languageSelect');
  const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  // Input & Camera Elements
  const fileInput = document.getElementById('fileInput');
  const cameraInput = document.getElementById('cameraInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnModeFile = document.getElementById('btnModeFile');
  const btnModeCamera = document.getElementById('btnModeCamera');
  const cameraPanel = document.getElementById('cameraPanel');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const btnCapturePhoto = document.getElementById('btnCapturePhoto');
  const btnRetakePhoto = document.getElementById('btnRetakePhoto');

  // Results Elements
  const predictionCard = document.getElementById('predictionCard');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultLoader = document.getElementById('resultLoader');
  const resultError = document.getElementById('resultError');
  const errorMessage = document.getElementById('errorMessage');
  const resultWarning = document.getElementById('resultWarning');
  const warningMessage = document.getElementById('warningMessage');
  const resultContent = document.getElementById('resultContent');
  const diseaseNameDisplay = document.getElementById('diseaseNameDisplay');
  const confidenceValue = document.getElementById('confidenceValue');
  const confidencePill = document.getElementById('confidencePill');
  const predictionsList = document.getElementById('predictionsList');
  const leafValidationBadge = document.getElementById('leafValidationBadge');
  const lineChartSvg = document.getElementById('lineChartSvg');

  // Visual Inspection Elements
  const gradcamBox = document.getElementById('gradcamBox');
  const btnToggleGradcam = document.getElementById('btnToggleGradcam');
  const gradcamPreview = document.getElementById('gradcamPreview');
  const gradcamImg = document.getElementById('gradcamImg');

  // Care Plan Elements
  const treatmentCard = document.getElementById('treatmentCard');
  const treatmentPlaceholder = document.getElementById('treatmentPlaceholder');
  const treatmentContent = document.getElementById('treatmentContent');
  const symptomsText = document.getElementById('symptomsText');
  const causesText = document.getElementById('causesText');
  const treatmentText = document.getElementById('treatmentText');
  const preventionText = document.getElementById('preventionText');
  const btnDownloadReport = document.getElementById('btnDownloadReport');
  const btnAskAssistant = document.getElementById('btnAskAssistant');

  // Knowledge Base Elements
  const knowledgeSearch = document.getElementById('knowledgeSearch');
  const knowledgeGrid = document.getElementById('knowledgeGrid');
  const diseaseModal = document.getElementById('diseaseModal');
  const btnCloseDiseaseModal = document.getElementById('btnCloseDiseaseModal');
  const modalDiseaseTitle = document.getElementById('modalDiseaseTitle');
  const modalDiseaseBody = document.getElementById('modalDiseaseBody');

  // Chat Elements
  const chatBody = document.getElementById('chatBody');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatChips = document.getElementById('chatChips');
  const btnDownloadChatPdf = document.getElementById('btnDownloadChatPdf');
  const btnClearChat = document.getElementById('btnClearChat');
  const floatingChatBtn = document.getElementById('floatingChatBtn');

  // Profile Modal Elements
  const btnProfileModal = document.getElementById('btnProfileModal');
  const profileModal = document.getElementById('profileModal');
  const btnCloseProfile = document.getElementById('btnCloseProfile');
  const usernameInput = document.getElementById('usernameInput');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const btnSaveProfile = document.getElementById('btnSaveProfile');
  const headerAvatar = document.getElementById('headerAvatar');

  let activeCameraStream = null;

  // --- Initial Setup ---
  updateHeaderAvatarDisplay();
  if (usernameInput) {
    usernameInput.value = state.userProfile.name;
  }
  state.language = window.localStorage.getItem('plantexa_language') || state.language;
  if (languageSelect) languageSelect.value = state.language;
  if (mobileLanguageSelect) mobileLanguageSelect.value = state.language;
  applyLanguage(state.language);
  fetchDiseasesKnowledgeBase();

  function updateHeaderAvatarDisplay() {
    if (!headerAvatar) return;
    const iconHtml = AVATAR_ICONS[state.userProfile.avatar] || AVATAR_ICONS.default;
    headerAvatar.innerHTML = iconHtml;
  }

  // --- Tab Navigation ---
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
      closeMobileDrawer();
    });
  });

  function switchTab(tabId) {
    navTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    tabPanes.forEach(pane => pane.classList.toggle('hidden', pane.id !== `tab-${tabId}`));
    if (floatingChatBtn) {
      floatingChatBtn.classList.toggle('hidden', tabId === 'assistant');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Brand Logo (Redirect to Homepage Tab) ---
  const brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('analysis');
      closeMobileDrawer();
    });
  }

  // --- Mobile Drawer ---
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = mobileNavDrawer.classList.contains('hidden');
      if (isHidden) {
        openMobileDrawer();
      } else {
        closeMobileDrawer();
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileNavDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileDrawer();
      }
    });
  }

  function openMobileDrawer() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('hidden');
    const bars = mobileMenuBtn?.querySelector('.icon-bars');
    const close = mobileMenuBtn?.querySelector('.icon-close');
    if (bars) bars.classList.add('hidden');
    if (close) close.classList.remove('hidden');
  }

  function closeMobileDrawer() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('hidden');
    const bars = mobileMenuBtn?.querySelector('.icon-bars');
    const close = mobileMenuBtn?.querySelector('.icon-close');
    if (bars) bars.classList.remove('hidden');
    if (close) close.classList.add('hidden');
  }

  if (floatingChatBtn) {
    floatingChatBtn.addEventListener('click', () => {
      switchTab('assistant');
    });
  }

  // --- Language Switching ---
  function handleLanguageChange(newLang) {
    state.language = newLang;
    window.localStorage.setItem('plantexa_language', state.language);
    if (languageSelect) languageSelect.value = state.language;
    if (mobileLanguageSelect) mobileLanguageSelect.value = state.language;
    applyLanguage(state.language);
  }

  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => handleLanguageChange(e.target.value));
  }
  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener('change', (e) => handleLanguageChange(e.target.value));
  }

  function applyLanguage(language) {
    const copy = i18n[language] || i18n.English;
    document.documentElement.lang = copy.htmlLang;
    document.title = `Plantexa - ${copy.heroTitle}`;

    // Update navigation labels
    const desktopNavBtns = document.querySelectorAll('#navTabs .nav-link');
    desktopNavBtns.forEach((btn, index) => {
      const span = btn.querySelector('span');
      if (span && copy.nav[index]) {
        span.textContent = copy.nav[index];
      }
    });

    const mobileNavBtns = document.querySelectorAll('.mobile-nav-links .mobile-nav-link');
    mobileNavBtns.forEach((btn, index) => {
      const span = btn.querySelector('span');
      if (span && copy.nav[index]) {
        span.textContent = copy.nav[index];
      }
    });

    // Update Banner / Hero
    const eyebrow = document.querySelector('#tab-analysis .intro-eyebrow, #tab-analysis .hero-badge, #tab-analysis .hero-badge-wrap');
    if (eyebrow) eyebrow.remove();
    const title = document.querySelector('#tab-analysis .intro-title');
    const desc = document.querySelector('#tab-analysis .intro-description');
    if (title) title.textContent = copy.heroTitle;
    if (desc) desc.textContent = copy.heroBody;

    // Mode Toggle Buttons
    const btnFileSpan = btnModeFile?.querySelector('span');
    const btnCameraSpan = btnModeCamera?.querySelector('span');
    if (btnFileSpan) btnFileSpan.textContent = copy.modeUpload;
    if (btnCameraSpan) btnCameraSpan.textContent = copy.modeCamera;

    // Dropzone text
    const dropText = document.querySelector('.drop-text');
    const supportText = document.querySelector('.supported-formats');
    if (dropText) {
      dropText.innerHTML = `${copy.dropPrompt.split(',')[0]}, or <span class="browse-link">${copy.dropPrompt.split(',')[1] || 'browse'}</span>`;
    }
    if (supportText) supportText.textContent = copy.dropSupport;

    // Analyze Button
    const analyzeSpan = btnAnalyze?.querySelector('span');
    if (analyzeSpan) analyzeSpan.textContent = copy.analyzeButton;

    // Result placeholder & loader
    const placeH4 = document.querySelector('#resultPlaceholder h4');
    const placeP = document.querySelector('#resultPlaceholder p');
    const loaderP = document.querySelector('#resultLoader p');
    if (placeH4) placeH4.textContent = copy.resultPlaceholderTitle;
    if (placeP) placeP.textContent = copy.resultPlaceholderText;
    if (loaderP) loaderP.textContent = copy.resultLoader;

    // Match section headers
    const matchH4 = document.querySelector('.top-predictions-box h4, .box-title-row h4');
    const matchSub = document.querySelector('.box-subtitle');
    if (matchH4) matchH4.textContent = copy.matchTitle;
    if (matchSub) matchSub.textContent = copy.matchSubtitle;

    // Affected areas inspection button
    const inspectSpan = btnToggleGradcam?.querySelector('span');
    const inspectCap = document.querySelector('.gradcam-caption');
    if (inspectSpan) inspectSpan.textContent = copy.inspectAreasBtn;
    if (inspectCap) inspectCap.textContent = copy.inspectCaption;

    // Knowledge Base tab
    const kbTitle = document.querySelector('#tab-knowledge .intro-title');
    const kbDesc = document.querySelector('#tab-knowledge .intro-description');
    if (kbTitle) kbTitle.textContent = copy.knowledgeTitle;
    if (kbDesc) {
      if (copy.knowledgeBody) {
        kbDesc.textContent = copy.knowledgeBody;
        kbDesc.style.display = '';
      } else {
        kbDesc.textContent = '';
        kbDesc.style.display = 'none';
      }
    }
    if (knowledgeSearch) knowledgeSearch.placeholder = copy.knowledgeSearch || 'Search...';

    // Plant Doctor Assistant tab
    const chatTitle = document.querySelector('#tab-assistant .intro-title');
    const chatDesc = document.querySelector('#tab-assistant .intro-description');
    if (chatTitle) chatTitle.textContent = copy.assistantTitle;
    if (chatDesc) chatDesc.textContent = copy.assistantBody;
    if (chatInput) chatInput.placeholder = copy.chatPlaceholder;

    // Chat Export & Clear
    const expSpan = btnDownloadChatPdf?.querySelector('span');
    const clrSpan = btnClearChat?.querySelector('span');
    if (expSpan) expSpan.textContent = copy.exportPdf;
    if (clrSpan) clrSpan.textContent = copy.clearChat;

    // Profile modal
    const profH3 = document.getElementById('profileModalTitle');
    const profLabel1 = document.querySelector('label[for="usernameInput"]');
    const profLabel2 = document.querySelector('#profileModal .form-group:nth-child(2) label');
    if (profH3) profH3.textContent = copy.profileTitle;
    if (btnProfileModal) btnProfileModal.title = copy.profileTitle;
    if (profLabel1) profLabel1.textContent = copy.profileLabel;
    if (profLabel2) profLabel2.textContent = copy.profileRole;

    // Care plan action buttons
    const downRepSpan = btnDownloadReport?.querySelector('span');
    const askDocSpan = btnAskAssistant?.querySelector('span');
    if (downRepSpan) downRepSpan.textContent = copy.downloadPdfCare;
    if (askDocSpan) askDocSpan.textContent = copy.askDoctor;

    // Chat initial greeting
    if (state.chatMessages.length === 1 && state.chatMessages[0].role === 'assistant') {
      state.chatMessages[0].content = copy.assistantGreeting;
      renderChatMessages();
    }

    renderStaticChips(copy);
  }

  function renderStaticChips(copy) {
    if (!chatChips) return;
    const chips = [
      { label: copy.chip1, query: 'How to spot leaf distress early?' },
      { label: copy.chip2, query: 'Natural organic pest remedies for garden plants' },
      { label: copy.chip3, query: 'How to improve soil nutrients naturally?' }
    ];

    chatChips.innerHTML = '';
    chips.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-query', item.query);
      btn.textContent = item.label;
      chatChips.appendChild(btn);
    });
  }

  // --- Input Mode Toggle (File Upload vs Camera) ---
  if (btnModeFile && btnModeCamera) {
    btnModeFile.addEventListener('click', () => {
      btnModeFile.classList.add('active');
      btnModeCamera.classList.remove('active');
      closeCamera();
    });

    btnModeCamera.addEventListener('click', () => {
      btnModeCamera.classList.add('active');
      btnModeFile.classList.remove('active');
      openCamera();
    });
  }

  if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        handleFileSelection(file);
      }
      btnModeFile?.classList.add('active');
      btnModeCamera?.classList.remove('active');
    });
  }

  async function openCamera() {
    const hasMedia = typeof navigator !== 'undefined' && 
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function';

    if (hasMedia && window.isSecureContext) {
      try {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false
          });
        } catch (e1) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        if (stream) {
          activeCameraStream = stream;
          if (cameraVideo) {
            cameraVideo.srcObject = activeCameraStream;
            cameraVideo.play().catch(() => {});
          }
          dropzonePrompt?.classList.add('hidden');
          previewContainer?.classList.add('hidden');
          cameraPanel?.classList.remove('hidden');
          if (fileInput) fileInput.style.pointerEvents = 'none';
          return;
        }
      } catch (err) {
        console.warn('Live camera stream unavailable, opening native camera capture:', err);
      }
    }

    // Seamless fallback to device camera shutter (Works 100% on iOS Safari, Android, and non-HTTPS)
    if (cameraInput) {
      cameraInput.click();
    } else if (fileInput) {
      fileInput.click();
    }
  }

  function closeCamera() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
    if (cameraPanel) cameraPanel.classList.add('hidden');
    if (fileInput) fileInput.style.pointerEvents = 'auto';

    if (!state.selectedFile) {
      dropzonePrompt?.classList.remove('hidden');
    } else {
      previewContainer?.classList.remove('hidden');
    }
  }

  // Camera Capture & Retake
  if (btnCapturePhoto) {
    btnCapturePhoto.addEventListener('click', () => {
      if (!cameraVideo?.videoWidth || !cameraVideo?.videoHeight) return;

      cameraCanvas.width = cameraVideo.videoWidth;
      cameraCanvas.height = cameraVideo.videoHeight;
      const context = cameraCanvas.getContext('2d');
      context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

      cameraCanvas.toBlob((blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `plantexa_leaf_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileSelected(capturedFile);
        closeCamera();
      }, 'image/jpeg', 0.92);
    });
  }

  if (btnRetakePhoto) {
    btnRetakePhoto.addEventListener('click', () => {
      clearSelectedPhoto();
      openCamera();
    });
  }

  // File Input and Drag & Drop
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelected(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFileSelected(file) {
    state.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imagePreview) imagePreview.src = e.target.result;
      state.currentImageBase64 = e.target.result;
      dropzonePrompt?.classList.add('hidden');
      previewContainer?.classList.remove('hidden');
      if (btnAnalyze) btnAnalyze.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  function clearSelectedPhoto() {
    state.selectedFile = null;
    state.currentImageBase64 = null;
    if (fileInput) fileInput.value = '';
    if (imagePreview) imagePreview.src = '';
    previewContainer?.classList.add('hidden');
    dropzonePrompt?.classList.remove('hidden');
    if (btnAnalyze) btnAnalyze.disabled = true;

    if (treatmentCard) treatmentCard.classList.add('hidden');
    if (treatmentContent) treatmentContent.classList.add('hidden');
    if (treatmentPlaceholder) treatmentPlaceholder.classList.add('hidden');
    if (resultContent) resultContent.classList.add('hidden');
    if (resultPlaceholder) resultPlaceholder.classList.remove('hidden');
    if (predictionCard) predictionCard.classList.add('is-empty');
    if (resultError) resultError.classList.add('hidden');
    if (resultWarning) resultWarning.classList.add('hidden');
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', (e) => {
      e.stopPropagation();
      clearSelectedPhoto();
    });
  }

  // --- Plant Health Analysis Execution ---
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', async () => {
      if (!state.selectedFile) return;

      resultPlaceholder?.classList.add('hidden');
      predictionCard?.classList.remove('is-empty');
      resultError?.classList.add('hidden');
      resultWarning?.classList.add('hidden');
      resultContent?.classList.add('hidden');
      resultLoader?.classList.remove('hidden');

      if (window.innerWidth <= 768 && predictionCard) {
        setTimeout(() => {
          predictionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }

      const formData = new FormData();
      formData.append('file', state.selectedFile);

      try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
          method: 'POST',
          body: formData
        });

        const res = await response.json();
        resultLoader?.classList.add('hidden');

        if (!response.ok || !res.success) {
          if (errorMessage) errorMessage.textContent = res.error || 'Diagnosis failed. Please try a clearer leaf photo.';
          resultError?.classList.remove('hidden');
          return;
        }

        renderPredictionResults(res.data, res.disease_info);
      } catch (err) {
        resultLoader?.classList.add('hidden');
        if (errorMessage) errorMessage.textContent = 'Network connection error. Please try again.';
        resultError?.classList.remove('hidden');
      }
    });
  }

  function getMatchTheme(percentage) {
    if (percentage >= 85) {
      return {
        bg: '#f0f9f4',
        text: '#1b4332',
        border: '#b7e4c7',
        bar: '#2d6a4f'
      };
    } else if (percentage >= 60) {
      return {
        bg: '#fdf8eb',
        text: '#966914',
        border: '#f8e5b8',
        bar: '#d97706'
      };
    } else {
      return {
        bg: '#fdf2f0',
        text: '#a83b24',
        border: '#fad5ce',
        bar: '#b2533e'
      };
    }
  }

  function animateConfidence(targetPercentage, theme) {
    if (confidencePill) {
      confidencePill.style.backgroundColor = theme.bg;
      confidencePill.style.borderColor = theme.border;
    }

    if (confidenceValue) {
      confidenceValue.style.color = theme.text;
      let start = null;
      const duration = 1000;

      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = ease * targetPercentage;
        confidenceValue.textContent = `${current.toFixed(1)}%`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
    }
  }

  function renderPredictionResults(data, info) {
    state.currentPrediction = data;
    state.currentDiseaseInfo = info;

    const copy = i18n[state.language] || i18n.English;

    if (diseaseNameDisplay) {
      diseaseNameDisplay.textContent = data.disease;
    }

    const theme = getMatchTheme(data.confidence);
    animateConfidence(data.confidence, theme);

    if (leafValidationBadge) {
      if (data.leaf_validation && data.leaf_validation.is_leaf) {
        leafValidationBadge.textContent = copy.leafConfirmed;
        leafValidationBadge.style.backgroundColor = 'var(--sage-light)';
        leafValidationBadge.style.color = 'var(--forest-primary)';
        leafValidationBadge.style.borderColor = 'var(--sage-border)';
      } else {
        leafValidationBadge.textContent = copy.leafUncertain;
        leafValidationBadge.style.backgroundColor = 'var(--ochre-bg)';
        leafValidationBadge.style.color = 'var(--ochre-text)';
        leafValidationBadge.style.borderColor = 'var(--ochre-border)';
      }
    }

    if (data.validation_warning && warningMessage && resultWarning) {
      warningMessage.textContent = data.validation_warning;
      resultWarning.classList.remove('hidden');
    }

    // Render Clean Matches List (Zero Horizontal Bars)
    if (predictionsList && data.top_predictions) {
      predictionsList.innerHTML = '';
      data.top_predictions.forEach(pred => {
        const itemTheme = getMatchTheme(pred.confidence);
        const item = document.createElement('div');
        item.className = 'pred-item';
        item.innerHTML = `
          <span class="pred-item-title">${pred.disease}</span>
          <span class="pred-item-badge" style="background-color: ${itemTheme.bg}; color: ${itemTheme.text};">
            ${pred.confidence.toFixed(1)}% match
          </span>
        `;
        predictionsList.appendChild(item);
      });
    }

    // Key Affected Areas (Grad-CAM)
    if (data.gradcam_b64 && gradcamImg && gradcamBox) {
      gradcamImg.src = `data:image/jpeg;base64,${data.gradcam_b64}`;
      gradcamBox.classList.remove('hidden');
    } else if (gradcamBox) {
      gradcamBox.classList.add('hidden');
    }

    // Populate Care & Treatment Plan
    if (info) {
      if (symptomsText) symptomsText.textContent = info.symptoms || 'Regular monitoring recommended.';
      if (causesText) causesText.textContent = info.causes || 'Environmental moisture or fungal spores.';
      if (treatmentText) treatmentText.textContent = info.treatment || 'Prune affected leaves and apply organic copper or neem spray.';
      if (preventionText) preventionText.textContent = info.prevention || 'Water at the soil base and allow adequate space between plants.';
    } else {
      if (symptomsText) symptomsText.textContent = 'Careful monitoring of discoloration is advised.';
      if (causesText) causesText.textContent = 'Foliar fungal or bacterial pathogens.';
      if (treatmentText) treatmentText.textContent = 'Prune damaged leaves and avoid overhead watering.';
      if (preventionText) preventionText.textContent = 'Maintain proper row spacing and mulch base soil.';
    }

    treatmentPlaceholder?.classList.add('hidden');
    treatmentContent?.classList.remove('hidden');
    treatmentCard?.classList.remove('hidden');
    resultContent?.classList.remove('hidden');
  }

  if (btnToggleGradcam && gradcamPreview) {
    btnToggleGradcam.addEventListener('click', () => {
      gradcamPreview.classList.toggle('hidden');
    });
  }

  // --- PDF Export for Diagnostic Report ---
  if (btnDownloadReport) {
    btnDownloadReport.addEventListener('click', async () => {
      if (!state.currentPrediction) return;

      const payload = {
        disease: state.currentPrediction.disease,
        confidence: state.currentPrediction.confidence,
        symptoms: state.currentDiseaseInfo?.symptoms || '',
        causes: state.currentDiseaseInfo?.causes || '',
        treatment: state.currentDiseaseInfo?.treatment || '',
        prevention: state.currentDiseaseInfo?.prevention || '',
        image_b64: state.currentImageBase64 || imagePreview?.src || ''
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/export-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cleanName = state.currentPrediction.disease.replace(/[^a-zA-Z0-9]/g, '_');
          a.download = `plantexa_care_sheet_${cleanName}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } catch (err) {
        alert('Could not export PDF report.');
      }
    });
  }

  if (btnAskAssistant) {
    btnAskAssistant.addEventListener('click', () => {
      switchTab('assistant');
      if (state.currentPrediction && chatInput) {
        chatInput.value = `Can you suggest organic remedies and watering advice for ${state.currentPrediction.disease}?`;
        chatInput.focus();
      }
    });
  }

  // --- Plant Health Library (Knowledge Base) ---
  async function fetchDiseasesKnowledgeBase() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diseases`);
      const res = await response.json();
      if (res.success && res.diseases) {
        state.diseasesData = res.diseases;
        renderKnowledgeGrid(res.diseases);
      }
    } catch (err) {
      console.warn('Could not load plant health library:', err);
    }
  }

  function renderKnowledgeGrid(diseases) {
    if (!knowledgeGrid) return;
    knowledgeGrid.innerHTML = '';
    const query = knowledgeSearch ? knowledgeSearch.value.toLowerCase().trim() : '';

    Object.keys(diseases).forEach(key => {
      const item = diseases[key];
      const name = item.disease_name || key;
      if (query && !name.toLowerCase().includes(query) && !key.toLowerCase().includes(query)) {
        return;
      }

      const card = document.createElement('div');
      card.className = 'kb-card';
      card.innerHTML = `
        <h3>${name}</h3>
        <p><strong>Symptoms:</strong> ${item.symptoms || 'Symptoms vary based on environment.'}</p>
      `;
      card.addEventListener('click', () => openDiseaseModal(name, item));
      knowledgeGrid.appendChild(card);
    });
  }

  if (knowledgeSearch) {
    knowledgeSearch.addEventListener('input', () => {
      renderKnowledgeGrid(state.diseasesData);
    });
  }

  function openDiseaseModal(title, info) {
    if (!modalDiseaseTitle || !modalDiseaseBody || !diseaseModal) return;
    modalDiseaseTitle.textContent = title;
    modalDiseaseBody.innerHTML = '';

    const sections = [
      { label: 'Symptoms', text: info.symptoms, icon: 'fa-stethoscope' },
      { label: 'Causes', text: info.causes, icon: 'fa-circle-question' },
      { label: 'Treatment & Care', text: info.treatment, icon: 'fa-plant-wilt' },
      { label: 'Prevention', text: info.prevention, icon: 'fa-shield-halved' }
    ];

    sections.forEach(sec => {
      const div = document.createElement('div');
      div.className = 'detail-section';
      div.innerHTML = `
        <div class="detail-header">
          <i class="fa-solid ${sec.icon}" aria-hidden="true"></i>
          <h4>${sec.label}</h4>
        </div>
        <p>${sec.text || 'Information not available.'}</p>
      `;
      modalDiseaseBody.appendChild(div);
    });

    diseaseModal.classList.remove('hidden');
  }

  if (btnCloseDiseaseModal && diseaseModal) {
    btnCloseDiseaseModal.addEventListener('click', () => {
      diseaseModal.classList.add('hidden');
    });
  }

  // --- Plant Doctor Assistant (Chat) ---
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prompt = chatInput?.value.trim();
      if (!prompt) return;
      sendMessage(prompt);
    });
  }

  if (chatChips) {
    chatChips.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-btn');
      if (btn) {
        const query = btn.getAttribute('data-query');
        if (query) sendMessage(query);
      }
    });
  }

  async function sendMessage(promptText) {
    if (chatInput) chatInput.value = '';

    state.chatMessages.push({ role: 'user', content: promptText });
    renderChatMessages();

    const loaderMsg = { role: 'assistant', content: 'AI Assistant is thinking...' };
    state.chatMessages.push(loaderMsg);
    renderChatMessages();

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.chatMessages.filter(m => m.content !== loaderMsg.content),
          username: state.userProfile.name,
          avatar: state.userProfile.avatar,
          language: state.language,
          prediction: state.currentPrediction
        })
      });

      const res = await response.json();
      state.chatMessages.pop(); // Remove thinking placeholder

      if (res.reply) {
        state.chatMessages.push({ role: 'assistant', content: res.reply });
      } else {
        state.chatMessages.push({
          role: 'assistant',
          content: res.error || 'The AI Assistant is temporarily unavailable. Please try again shortly.'
        });
      }

      if (res.followups && res.followups.length > 0) {
        renderFollowupChips(res.followups);
      }

      renderChatMessages();
    } catch (err) {
      state.chatMessages.pop();
      state.chatMessages.push({
        role: 'assistant',
        content: 'Network connection error while contacting AI Assistant.'
      });
      renderChatMessages();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatAssistantMarkdown(value) {
    const html = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length) {
        html.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
        listItems = [];
      }
    };

    String(value).replace(/\r\n/g, '\n').split('\n').forEach(line => {
      const trimmed = line.trim();
      const listMatch = trimmed.match(/^(?:[-*+]|•)\s+(.+)$/);
      const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);

      if (listMatch) {
        listItems.push(escapeHtml(listMatch[1]).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
      } else if (headingMatch) {
        flushList();
        const level = headingMatch[1].length + 3;
        html.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
      } else if (trimmed) {
        flushList();
        const formatted = escapeHtml(trimmed)
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.+?)`/g, '<code>$1</code>');
        html.push(`<p>${formatted}</p>`);
      } else {
        flushList();
      }
    });

    flushList();
    return html.join('') || '<p></p>';
  }

  function renderChatMessages() {
    if (!chatBody) return;
    chatBody.innerHTML = '';
    state.chatMessages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`;


      const content = document.createElement('div');
      content.className = 'message-content';
      if (msg.role === 'assistant') {
        content.innerHTML = formatAssistantMarkdown(msg.content);
      } else {
        content.textContent = msg.content;
      }
      bubble.appendChild(content);
      chatBody.appendChild(bubble);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderFollowupChips(followups) {
    if (!chatChips) return;
    chatChips.innerHTML = '';
    followups.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-query', q);
      btn.textContent = q;
      chatChips.appendChild(btn);
    });
  }

  if (btnDownloadChatPdf) {
    btnDownloadChatPdf.addEventListener('click', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/export-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: state.chatMessages,
            disease: state.currentPrediction?.disease || ''
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'plantexa_plant_doctor_consultation.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } catch (err) {
        alert('Could not export chat PDF.');
      }
    });
  }

  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      const copy = i18n[state.language] || i18n.English;
      state.chatMessages = [
        {
          role: 'assistant',
          content: copy.assistantGreeting
        }
      ];
      renderChatMessages();
      renderStaticChips(copy);
    });
  }

  // --- Profile Modal ---
  if (btnProfileModal && profileModal) {
    btnProfileModal.addEventListener('click', () => {
      profileModal.classList.remove('hidden');
    });
  }

  if (btnCloseProfile && profileModal) {
    btnCloseProfile.addEventListener('click', () => {
      profileModal.classList.add('hidden');
    });
  }

  avatarOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      avatarOptions.forEach(o => {
        o.classList.remove('active');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-checked', 'true');
    });
  });

  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', () => {
      const activeOpt = document.querySelector('.avatar-option.active');
      if (activeOpt) {
        state.userProfile.avatar = activeOpt.getAttribute('data-avatar') || 'farmer';
      }
      if (usernameInput) {
        state.userProfile.name = usernameInput.value.trim() || 'Farmer Jyoti';
      }
      updateHeaderAvatarDisplay();
      profileModal?.classList.add('hidden');
    });
  }
});
