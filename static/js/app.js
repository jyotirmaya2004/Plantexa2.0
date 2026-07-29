/**
 * Plantexa AI Frontend Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // API Base URL (Relative paths for unified full-stack Render deployment)
  const API_BASE_URL = '';

  // App State
  const state = {
    selectedFile: null,
    currentPrediction: null,
    currentDiseaseInfo: null,
    chatMessages: [
      {
        role: 'assistant',
        content: '🌱 Hello! I am your Plantexa AI Agronomist. Ask me any question about crop diseases, soil care, fertilizers, or pest management!'
      }
    ],
    userProfile: {
      name: 'Farmer Jyoti',
      avatar: '🧑‍🌾'
    },
    language: 'English',
    diseasesData: {}
  };

  const i18n = {
    English: {
      htmlLang: 'en',
      nav: ['Leaf Analysis', 'Knowledge Base', 'AI Assistant', 'About & Dataset'],
      heroTitle: 'AI-Powered Crop Disease Diagnosis',
      heroBody: 'Upload a leaf image to instantly validate leaf health, identify diseases with deep learning, and view Grad-CAM explainability heatmaps.',
      uploadTitle: 'Upload Leaf Image',
      openCamera: 'Open Camera',
      closeCamera: 'Close Camera',
      capturePhoto: 'Capture Photo',
      retakePhoto: 'Retake',
      cameraNote: 'Use your device camera to capture a fresh leaf image, then analyze it instantly.',
      analyzeButton: 'Analyze Leaf',
      resultsTitle: 'Analysis Results',
      resultPlaceholder: 'Upload a leaf photo and click Analyze Leaf to get instant diagnostic results.',
      resultLoader: 'Evaluating leaf validity and classifying crop disease...',
      topPredictions: 'Top 3 Predictions',
      heatmapButton: 'View AI Attention Heatmap (Grad-CAM)',
      symptoms: 'Symptoms',
      causes: 'Causes',
      treatment: 'Treatment & Management',
      prevention: 'Prevention',
      knowledgeTitle: 'Disease Knowledge Base',
      knowledgeBody: 'Explore symptoms, cause analysis, and treatment guidelines for 38+ plant leaf diseases.',
      knowledgeSearch: 'Search disease or crop (e.g. Potato, Apple, Blight)...',
      assistantTitle: 'Plantexa AI Agronomist Assistant',
      assistantBody: 'Ask tailored agriculture questions about crop health, soil treatment, fertilizers, and pest management.',
      assistantGreeting: '🌱 Hello! I am your Plantexa AI Agronomist. Ask me any question about crop diseases, soil care, fertilizers, or pest management!',
      chip1: 'How to identify leaf diseases?',
      chip2: 'Common organic pest controls',
      chip3: 'How to improve soil health?',
      chatPlaceholder: 'Ask your agricultural question...',
      exportPdf: 'Export PDF',
      clearChat: 'Clear',
      profileTitle: 'User Profile & Context',
      profileLabel: 'Name / Handle:',
      profileAvatar: 'Avatar / Role:',
      saveProfile: 'Save Profile',
      diseaseModalTitle: 'Disease Details',
      floatingChat: 'Open Plantexa AI Chatbot',
      aboutTitle: 'About Plantexa AI'
    },
    Hindi: {
      htmlLang: 'hi',
      nav: ['पत्ती विश्लेषण', 'ज्ञान आधार', 'एआई सहायक', 'परिचय व डेटासेट'],
      heroTitle: 'एआई-संचालित फसल रोग निदान',
      heroBody: 'पत्ती की तस्वीर अपलोड करें, तुरंत स्वास्थ्य जांचें, रोग पहचानें, और Grad-CAM स्पष्टीकरण हीटमैप देखें।',
      uploadTitle: 'पत्ती की छवि अपलोड करें',
      openCamera: 'कैमरा खोलें',
      closeCamera: 'कैमरा बंद करें',
      capturePhoto: 'फोटो लें',
      retakePhoto: 'फिर से लें',
      cameraNote: 'ताज़ी पत्ती की छवि लेने के लिए डिवाइस कैमरा का उपयोग करें, फिर तुरंत विश्लेषण करें।',
      analyzeButton: 'पत्ती का विश्लेषण करें',
      resultsTitle: 'विश्लेषण परिणाम',
      resultPlaceholder: 'एक पत्ती की फोटो अपलोड करें और तुरंत परिणाम पाने के लिए पत्ती का विश्लेषण करें पर क्लिक करें।',
      resultLoader: 'पत्ती की वैधता जांची जा रही है और रोग वर्गीकृत किया जा रहा है...',
      topPredictions: 'शीर्ष 3 अनुमान',
      heatmapButton: 'एआई ध्यान हीटमैप देखें (Grad-CAM)',
      symptoms: 'लक्षण',
      causes: 'कारण',
      treatment: 'उपचार और प्रबंधन',
      prevention: 'रोकथाम',
      knowledgeTitle: 'रोग ज्ञान आधार',
      knowledgeBody: '38+ पौधों की पत्ती बीमारियों के लक्षण, कारण विश्लेषण और उपचार निर्देश देखें।',
      knowledgeSearch: 'रोग या फसल खोजें (उदा. Potato, Apple, Blight)...',
      assistantTitle: 'प्लांटेक्षा एआई कृषि सहायक',
      assistantBody: 'फसल स्वास्थ्य, मिट्टी उपचार, उर्वरक और कीट प्रबंधन पर कृषि संबंधी प्रश्न पूछें।',
      assistantGreeting: '🌱 नमस्ते! मैं आपका प्लांटेक्षा एआई कृषि सहायक हूँ। फसल रोग, मिट्टी, उर्वरक या कीट प्रबंधन के बारे में कुछ भी पूछें!',
      chip1: 'पत्ती रोगों की पहचान कैसे करें?',
      chip2: 'सामान्य जैविक कीट नियंत्रण',
      chip3: 'मिट्टी का स्वास्थ्य कैसे सुधारें?',
      chatPlaceholder: 'अपना कृषि प्रश्न पूछें...',
      exportPdf: 'पीडीएफ निर्यात',
      clearChat: 'साफ़ करें',
      profileTitle: 'उपयोगकर्ता प्रोफ़ाइल और संदर्भ',
      profileLabel: 'नाम / पहचान:',
      profileAvatar: 'अवतार / भूमिका:',
      saveProfile: 'प्रोफ़ाइल सहेजें',
      diseaseModalTitle: 'रोग विवरण',
      floatingChat: 'प्लांटेक्षा एआई चैटबॉट खोलें',
      aboutTitle: 'प्लांटेक्षा एआई के बारे में'
    },
    Odia: {
      htmlLang: 'or',
      nav: ['ପତ୍ର ବିଶ୍ଲେଷଣ', 'ଜ୍ଞାନ ଆଧାର', 'AI ସହାୟକ', 'ବିବରଣୀ ଓ ଡାଟାସେଟ୍'],
      heroTitle: 'AI-ଚାଳିତ ଫସଲ ରୋଗ ନିରୂପଣ',
      heroBody: 'ପତ୍ରର ଫୋଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ, ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରନ୍ତୁ, ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ ଏବଂ Grad-CAM ହୀଟମ୍ୟାପ୍ ଦେଖନ୍ତୁ।',
      uploadTitle: 'ପତ୍ରର ଫୋଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
      openCamera: 'କ୍ୟାମେରା ଖୋଲନ୍ତୁ',
      closeCamera: 'କ୍ୟାମେରା ବନ୍ଦ କରନ୍ତୁ',
      capturePhoto: 'ଫୋଟୋ ଉଠାନ୍ତୁ',
      retakePhoto: 'ପୁଣି ଉଠାନ୍ତୁ',
      cameraNote: 'ସଦ୍ୟ ପତ୍ରର ଫୋଟୋ ଉଠାଇବା ପାଇଁ କ୍ୟାମେରା ବ୍ୟବହାର କରନ୍ତୁ ଏବଂ ତୁରନ୍ତ ବିଶ୍ଲେଷଣ କରନ୍ତୁ।',
      analyzeButton: 'ପତ୍ର ବିଶ୍ଲେଷଣ କରନ୍ତୁ',
      resultsTitle: 'ବିଶ୍ଲେଷଣ ଫଳାଫଳ',
      resultPlaceholder: 'ଗୋଟିଏ ପତ୍ରର ଫୋଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ ଏବଂ ତୁରନ୍ତ ଫଳାଫଳ ପାଇବା ପାଇଁ ପତ୍ର ବିଶ୍ଲେଷଣ କରନ୍ତୁ କ୍ଲିକ୍ କରନ୍ତୁ।',
      resultLoader: 'ପତ୍ରର ବୈଧତା ଏବଂ ରୋଗ ବର୍ଗୀକରଣ କରାଯାଉଛି...',
      topPredictions: 'ଶୀର୍ଷ ୩ ଆକଳନ',
      heatmapButton: 'AI ଧ୍ୟାନ ହୀଟମ୍ୟାପ୍ ଦେଖନ୍ତୁ (Grad-CAM)',
      symptoms: 'ଲକ୍ଷଣ',
      causes: 'କାରଣ',
      treatment: 'ଚିକିତ୍ସା ଓ ପରିଚାଳନା',
      prevention: 'ନିବାରଣ ଉପାୟ',
      knowledgeTitle: 'ରୋଗ ଜ୍ଞାନ ଆଧାର',
      knowledgeBody: '୩୮+ ଫସଲ ରୋଗର ଲକ୍ଷଣ, କାରଣ ଏବଂ ଚିକିତ୍ସା ନିର୍ଦ୍ଦେଶାବଳୀ ଦେଖନ୍ତୁ।',
      knowledgeSearch: 'ରୋଗ କିମ୍ବା ଫସଲ ସନ୍ଧାନ କରନ୍ତୁ (ଯେପରିକି Potato, Apple, Blight)...',
      assistantTitle: 'Plantexa AI କୃଷି ସହାୟକ',
      assistantBody: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ, ମୃତ୍ତିକା ଚିକିତ୍ସା, ସାର ଏବଂ କୀଟନାଶକ ପରିଚାଳନା ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।',
      assistantGreeting: '🌱 ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର Plantexa AI କୃଷି ସହାୟକ। ଫସଲ ରୋଗ, ମୃତ୍ତିକା, ସାର କିମ୍ବା କୀଟ ପରିଚାଳନା ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ!',
      chip1: 'ପତ୍ର ରୋଗ କିପରି ଚିହ୍ନଟ କରିବେ?',
      chip2: 'ସାଧାରଣ ଜୈବିକ କୀଟ ନିୟନ୍ତ୍ରଣ',
      chip3: 'ମୃତ୍ତିକାର ସ୍ୱାସ୍ଥ୍ୟ କିପରି ସୁଧାରିବେ?',
      chatPlaceholder: 'ଆପଣଙ୍କର କୃଷି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
      exportPdf: 'PDF ରପ୍ତାନି କରନ୍ତୁ',
      clearChat: 'ସଫା କରନ୍ତୁ',
      profileTitle: 'ବ୍ୟବହାରକାରୀ ପ୍ରୋଫାଇଲ୍',
      profileLabel: 'ନାମ / ପରିଚୟ:',
      profileAvatar: 'ଅବତାର / ଭୂମିକା:',
      saveProfile: 'ପ୍ରୋଫାଇଲ୍ ସଞ୍ଚୟ କରନ୍ତୁ',
      diseaseModalTitle: 'ରୋଗ ବିବରଣୀ',
      floatingChat: 'Plantexa AI ଚାଟବଟ୍ ଖୋଲନ୍ତୁ',
      aboutTitle: 'Plantexa AI ବିଷୟରେ'
    }
  };

  const languageMeta = {
    English: 'English',
    Hindi: 'Hindi',
    Odia: 'Odia'
  };

  // DOM Elements
  const navTabs = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const languageSelect = document.getElementById('languageSelect');
  const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');

  // File Upload Elements
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnOpenCamera = document.getElementById('btnOpenCamera');
  const btnCloseCamera = document.getElementById('btnCloseCamera');
  const cameraPanel = document.getElementById('cameraPanel');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const btnCapturePhoto = document.getElementById('btnCapturePhoto');
  const btnRetakePhoto = document.getElementById('btnRetakePhoto');

  // Results Elements
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultLoader = document.getElementById('resultLoader');
  const resultError = document.getElementById('resultError');
  const errorMessage = document.getElementById('errorMessage');
  const resultWarning = document.getElementById('resultWarning');
  const warningMessage = document.getElementById('warningMessage');
  const resultContent = document.getElementById('resultContent');
  const diseaseNameDisplay = document.getElementById('diseaseNameDisplay');
  const confidenceValue = document.getElementById('confidenceValue');
  const predictionsList = document.getElementById('predictionsList');
  const leafValidationBadge = document.getElementById('leafValidationBadge');

  // GradCAM Elements
  const gradcamBox = document.getElementById('gradcamBox');
  const btnToggleGradcam = document.getElementById('btnToggleGradcam');
  const gradcamPreview = document.getElementById('gradcamPreview');
  const gradcamImg = document.getElementById('gradcamImg');

  // Disease Details Elements
  const symptomsText = document.getElementById('symptomsText');
  const causesText = document.getElementById('causesText');
  const treatmentText = document.getElementById('treatmentText');
  const preventionText = document.getElementById('preventionText');
  const btnDownloadReport = document.getElementById('btnDownloadReport');
  const btnAskAssistant = document.getElementById('btnAskAssistant');

  // Knowledge Base Elements
  const knowledgeSearch = document.getElementById('knowledgeSearch');
  const knowledgeGrid = document.getElementById('knowledgeGrid');

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

  // Disease Modal Elements
  const diseaseModal = document.getElementById('diseaseModal');
  const btnCloseDiseaseModal = document.getElementById('btnCloseDiseaseModal');
  const modalDiseaseTitle = document.getElementById('modalDiseaseTitle');
  const modalDiseaseBody = document.getElementById('modalDiseaseBody');

  // --- Initial Setup ---
  headerAvatar.textContent = state.userProfile.avatar;
  usernameInput.value = state.userProfile.name;
  state.language = window.localStorage.getItem('plantexa_language') || state.language;
  if (languageSelect) languageSelect.value = state.language;
  if (mobileLanguageSelect) mobileLanguageSelect.value = state.language;
  applyLanguage(state.language);
  fetchDiseasesKnowledgeBase();

  // --- Navigation Tabs & Mobile Drawer ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

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
  }

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

  floatingChatBtn.addEventListener('click', () => {
    switchTab('assistant');
  });

  // --- Language Selectors (Synced) ---
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
    document.title = `Plantexa AI - ${copy.heroTitle}`;

    const navLabels = document.querySelectorAll('.nav-link');
    navLabels.forEach((button, index) => {
      const icon = button.querySelector('i');
      button.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      });
      if (icon) {
        button.append(' ' + copy.nav[index]);
      }
    });

    const heroBanner = document.querySelector('.hero-banner h2');
    const heroText = document.querySelector('.hero-banner p');
    const uploadTitle = document.querySelector('.upload-card .card-header h3');
    const openCameraButton = document.getElementById('btnOpenCamera');
    const closeCameraButton = document.getElementById('btnCloseCamera');
    const capturePhotoButton = document.getElementById('btnCapturePhoto');
    const retakePhotoButton = document.getElementById('btnRetakePhoto');
    const cameraNote = document.querySelector('.camera-note');
    const resultTitle = document.querySelector('.result-card .card-header h3');
    const placeholderText = document.querySelector('#resultPlaceholder p');
    const loaderText = document.querySelector('#resultLoader p');
    const topPredictionTitle = document.querySelector('.top-predictions-box h4');
    const heatmapButton = document.querySelector('#btnToggleGradcam');
    const symptomsHeading = document.querySelector('#diseaseDetailsBox .detail-section:nth-child(1) h4');
    const causesHeading = document.querySelector('#diseaseDetailsBox .detail-section:nth-child(2) h4');
    const treatmentHeading = document.querySelector('#diseaseDetailsBox .detail-section:nth-child(3) h4');
    const preventionHeading = document.querySelector('#diseaseDetailsBox .detail-section:nth-child(4) h4');
    const knowledgeHeader = document.querySelector('#tab-knowledge .section-header h2');
    const knowledgeBody = document.querySelector('#tab-knowledge .section-header p');
    const searchInput = document.getElementById('knowledgeSearch');
    const assistantHeader = document.querySelector('#tab-assistant .section-header h2');
    const assistantBody = document.querySelector('#tab-assistant .section-header p');
    const chatPlaceholder = document.getElementById('chatInput');
    const exportPdfButton = document.getElementById('btnDownloadChatPdf');
    const clearButton = document.getElementById('btnClearChat');
    const profileHeader = document.querySelector('#profileModal .modal-header h3');
    const profileLabel = document.querySelector('label[for="usernameInput"]');
    const avatarLabel = document.querySelector('#avatarPicker').parentElement.querySelector('label');
    const saveButton = document.getElementById('btnSaveProfile');
    const diseaseModalHeader = document.getElementById('modalDiseaseTitle');
    const floatingChatButton = document.getElementById('floatingChatBtn');
    const aboutHeading = document.querySelector('#tab-about .card-header h3');

    if (heroBanner) heroBanner.textContent = copy.heroTitle;
    if (heroText) heroText.textContent = copy.heroBody;
    if (uploadTitle) uploadTitle.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${copy.uploadTitle}`;
    if (openCameraButton) openCameraButton.innerHTML = `<i class="fa-solid fa-camera"></i> ${copy.openCamera}`;
    if (closeCameraButton) closeCameraButton.innerHTML = `<i class="fa-solid fa-xmark"></i> ${copy.closeCamera}`;
    if (capturePhotoButton) capturePhotoButton.innerHTML = `<i class="fa-solid fa-circle-dot"></i> ${copy.capturePhoto}`;
    if (retakePhotoButton) retakePhotoButton.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${copy.retakePhoto}`;
    if (cameraNote) cameraNote.textContent = copy.cameraNote;
    if (resultTitle) resultTitle.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> ${copy.resultsTitle}`;
    if (placeholderText) placeholderText.textContent = copy.resultPlaceholder;
    if (loaderText) loaderText.textContent = copy.resultLoader;
    if (topPredictionTitle) topPredictionTitle.innerHTML = `<i class="fa-solid fa-list-ol"></i> ${copy.topPredictions}`;
    if (heatmapButton) heatmapButton.innerHTML = `<i class="fa-solid fa-fire"></i> ${copy.heatmapButton}`;
    if (symptomsHeading) symptomsHeading.innerHTML = `<i class="fa-solid fa-stethoscope"></i> ${copy.symptoms}`;
    if (causesHeading) causesHeading.innerHTML = `<i class="fa-solid fa-virus"></i> ${copy.causes}`;
    if (treatmentHeading) treatmentHeading.innerHTML = `<i class="fa-solid fa-pills"></i> ${copy.treatment}`;
    if (preventionHeading) preventionHeading.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${copy.prevention}`;
    if (knowledgeHeader) knowledgeHeader.textContent = copy.knowledgeTitle;
    if (knowledgeBody) knowledgeBody.textContent = copy.knowledgeBody;
    if (searchInput) searchInput.placeholder = copy.knowledgeSearch;
    if (assistantHeader) assistantHeader.textContent = copy.assistantTitle;
    if (assistantBody) assistantBody.textContent = copy.assistantBody;
    if (chatPlaceholder) chatPlaceholder.placeholder = copy.chatPlaceholder;
    if (exportPdfButton) exportPdfButton.innerHTML = `<i class="fa-solid fa-download"></i> ${copy.exportPdf}`;
    if (clearButton) clearButton.innerHTML = `<i class="fa-solid fa-trash"></i> ${copy.clearChat}`;
    if (profileHeader) profileHeader.textContent = copy.profileTitle;
    if (profileLabel) profileLabel.textContent = copy.profileLabel;
    if (avatarLabel) avatarLabel.textContent = copy.profileAvatar;
    if (saveButton) saveButton.textContent = copy.saveProfile;
    if (diseaseModalHeader) diseaseModalHeader.textContent = copy.diseaseModalTitle;
    if (floatingChatButton) floatingChatButton.title = copy.floatingChat;
    if (aboutHeading) aboutHeading.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${copy.aboutTitle}`;

    const chatGreeting = document.querySelector('#chatBody .assistant-message .message-content');
    if (chatGreeting && state.chatMessages.length === 1) {
      state.chatMessages[0].content = copy.assistantGreeting;
      renderChatMessages();
    }

    renderStaticChips(copy);
  }

  function renderStaticChips(copy) {
    if (!chatChips) return;
    const chipLabels = [copy.chip1, copy.chip2, copy.chip3];
    const chipQueries = [
      'How to identify early stage leaf diseases?',
      'What are the best natural pest control methods?',
      'How to improve soil nitrogen and organic matter?'
    ];

    chatChips.innerHTML = '';
    chipLabels.forEach((label, index) => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn';
      btn.setAttribute('data-query', chipQueries[index]);
      btn.textContent = label;
      chatChips.appendChild(btn);
    });
  }

  let activeCameraStream = null;

  async function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported in this browser.');
      return;
    }

    try {
      activeCameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      cameraVideo.srcObject = activeCameraStream;
      dropzonePrompt.classList.add('hidden');
      previewContainer.classList.add('hidden');
      cameraPanel.classList.remove('hidden');
      if (fileInput) fileInput.style.pointerEvents = 'none';
    } catch (err) {
      alert('Camera access is blocked or unavailable on this device.');
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
    if (cameraPanel) {
      cameraPanel.classList.add('hidden');
    }
    if (fileInput) fileInput.style.pointerEvents = 'auto';
    if (!state.selectedFile) {
      dropzonePrompt.classList.remove('hidden');
    } else {
      previewContainer.classList.remove('hidden');
    }
  }

  // --- Upper Right Input Mode Toggle (File Upload vs Camera) ---
  const btnModeFile = document.getElementById('btnModeFile');
  const btnModeCamera = document.getElementById('btnModeCamera');

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

  // --- File Upload & Dropzone ---
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  if (btnOpenCamera) {
    btnOpenCamera.addEventListener('click', openCamera);
  }

  if (btnCloseCamera) {
    btnCloseCamera.addEventListener('click', closeCamera);
  }

  if (btnCapturePhoto) {
    btnCapturePhoto.addEventListener('click', () => {
      if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) return;

      cameraCanvas.width = cameraVideo.videoWidth;
      cameraCanvas.height = cameraVideo.videoHeight;
      const context = cameraCanvas.getContext('2d');
      context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

      cameraCanvas.toBlob((blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `plantexa_camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileSelected(capturedFile);
        closeCamera();
      }, 'image/jpeg', 0.92);
    });
  }

  if (btnRetakePhoto) {
    btnRetakePhoto.addEventListener('click', () => {
      state.selectedFile = null;
      fileInput.value = '';
      imagePreview.src = '';
      previewContainer.classList.add('hidden');
      dropzonePrompt.classList.remove('hidden');
      btnAnalyze.disabled = true;
      if (!cameraPanel.classList.contains('hidden')) {
        openCamera();
      }
    });
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  function handleFileSelected(file) {
    state.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      state.currentImageBase64 = e.target.result;
      dropzonePrompt.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      btnAnalyze.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  btnRemoveImage.addEventListener('click', (e) => {
    e.stopPropagation();
    state.selectedFile = null;
    fileInput.value = '';
    imagePreview.src = '';
    previewContainer.classList.add('hidden');
    dropzonePrompt.classList.remove('hidden');
    btnAnalyze.disabled = true;

    const treatmentPlaceholder = document.getElementById('treatmentPlaceholder');
    const treatmentContent = document.getElementById('treatmentContent');
    if (treatmentContent) treatmentContent.classList.add('hidden');
    if (treatmentPlaceholder) treatmentPlaceholder.classList.remove('hidden');

    resultContent.classList.add('hidden');
    resultPlaceholder.classList.remove('hidden');
  });

  // --- Image Analysis ---
  btnAnalyze.addEventListener('click', async () => {
    if (!state.selectedFile) return;

    resultPlaceholder.classList.add('hidden');
    resultError.classList.add('hidden');
    resultWarning.classList.add('hidden');
    resultContent.classList.add('hidden');
    resultLoader.classList.remove('hidden');

    const formData = new FormData();
    formData.append('file', state.selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData
      });

      const res = await response.json();
      resultLoader.classList.add('hidden');

      if (!response.ok || !res.success) {
        errorMessage.textContent = res.error || 'Prediction failed.';
        resultError.classList.remove('hidden');
        return;
      }

      renderPredictionResults(res.data, res.disease_info);
    } catch (err) {
      resultLoader.classList.add('hidden');
      errorMessage.textContent = `Network error: ${err.message}`;
      resultError.classList.remove('hidden');
    }
  });

  function getConfidenceTheme(percentage) {
    if (percentage >= 90) {
      return {
        bg: '#ecfdf5',
        text: '#047857',
        border: '#a7f3d0',
        barGradient: 'linear-gradient(90deg, #10b981, #047857)'
      };
    } else if (percentage >= 70) {
      return {
        bg: '#fff7ed',
        text: '#c2410c',
        border: '#ffedd5',
        barGradient: 'linear-gradient(90deg, #f97316, #ea580c)'
      };
    } else if (percentage >= 50) {
      return {
        bg: '#fefce8',
        text: '#854d0e',
        border: '#fef08a',
        barGradient: 'linear-gradient(90deg, #eab308, #ca8a04)'
      };
    } else {
      return {
        bg: '#fef2f2',
        text: '#b91c1c',
        border: '#fecaca',
        barGradient: 'linear-gradient(90deg, #ef4444, #dc2626)'
      };
    }
  }

  function animateConfidence(targetPercentage, confTheme) {
    const confidencePill = document.getElementById('confidencePill');
    const confValEl = document.getElementById('confidenceValue');

    if (confidencePill) {
      confidencePill.style.backgroundColor = confTheme.bg;
      confidencePill.style.borderColor = confTheme.border;
    }

    if (confValEl) {
      confValEl.style.color = confTheme.text;
      let startTimestamp = null;
      const duration = 1200;

      function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = easedProgress * targetPercentage;
        confValEl.textContent = `${currentValue.toFixed(1)}%`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
    }
  }

  function renderLineGraph(topPredictions) {
    const svg = document.getElementById('lineChartSvg');
    if (!svg || !topPredictions || topPredictions.length === 0) return;

    const width = 380;
    const height = 140;
    const paddingLeft = 48;
    const paddingRight = 48;
    const paddingTop = 28;
    const paddingBottom = 32;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const count = topPredictions.length;
    const points = topPredictions.map((pred, i) => {
      const x = count === 1 ? width / 2 : paddingLeft + (i / (count - 1)) * chartWidth;
      const conf = Math.max(0, Math.min(100, pred.confidence));
      const y = paddingTop + chartHeight - (conf / 100) * chartHeight;
      const theme = getConfidenceTheme(conf);
      return { x, y, conf, disease: pred.disease, theme, index: i + 1 };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    if (points.length > 1) {
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }
    }

    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const bottomY = paddingTop + chartHeight;
    const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    let svgContent = `
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${points[0].theme.text}" />
          <stop offset="100%" stop-color="${points[points.length - 1].theme.text}" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${points[0].theme.text}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${points[0].theme.text}" stop-opacity="0.01" />
        </linearGradient>
      </defs>

      <!-- Horizontal Grid Lines -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${width - paddingRight}" y2="${paddingTop}" stroke="#e2e8f0" stroke-dasharray="3,3" />
      <text x="${paddingLeft - 8}" y="${paddingTop + 3}" fill="#94a3b8" font-size="9" text-anchor="end">100%</text>

      <line x1="${paddingLeft}" y1="${paddingTop + chartHeight / 2}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight / 2}" stroke="#f1f5f9" stroke-dasharray="3,3" />
      <text x="${paddingLeft - 8}" y="${paddingTop + chartHeight / 2 + 3}" fill="#94a3b8" font-size="9" text-anchor="end">50%</text>

      <line x1="${paddingLeft}" y1="${bottomY}" x2="${width - paddingRight}" y2="${bottomY}" stroke="#e2e8f0" />
      <text x="${paddingLeft - 8}" y="${bottomY + 3}" fill="#94a3b8" font-size="9" text-anchor="end">0%</text>

      <!-- Area Fill -->
      <path d="${areaD}" fill="url(#areaGrad)" />

      <!-- Smooth Bezier Line -->
      <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" />
    `;

    points.forEach(pt => {
      svgContent += `
        <!-- X Axis Rank Label -->
        <text x="${pt.x}" y="${bottomY + 16}" fill="#64748b" font-size="9.5" font-weight="700" text-anchor="middle">Rank #${pt.index}</text>

        <!-- Point Node Circle -->
        <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="#ffffff" stroke="${pt.theme.text}" stroke-width="3" />
        <circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="${pt.theme.text}" />

        <!-- Percentage Label Tag Above Point -->
        <rect x="${pt.x - 22}" y="${Math.max(2, pt.y - 23)}" width="44" height="15" rx="7.5" fill="${pt.theme.bg}" stroke="${pt.theme.border}" stroke-width="1" />
        <text x="${pt.x}" y="${Math.max(13, pt.y - 12)}" fill="${pt.theme.text}" font-size="9" font-weight="800" text-anchor="middle">${pt.conf.toFixed(1)}%</text>
      `;
    });

    svg.innerHTML = svgContent;
  }

  function renderPredictionResults(data, info) {
    state.currentPrediction = data;
    state.currentDiseaseInfo = info;

    diseaseNameDisplay.textContent = data.disease;

    // Dynamic color theme based on confidence percentage
    const mainConfTheme = getConfidenceTheme(data.confidence);
    animateConfidence(data.confidence, mainConfTheme);

    if (data.leaf_validation && data.leaf_validation.is_leaf) {
      leafValidationBadge.textContent = 'Leaf Validated';
      leafValidationBadge.style.background = '#ecfdf5';
      leafValidationBadge.style.color = '#047857';
      leafValidationBadge.style.border = '1px solid #a7f3d0';
    } else {
      leafValidationBadge.textContent = 'Borderline Validation';
      leafValidationBadge.style.background = '#fffbeb';
      leafValidationBadge.style.color = '#b45309';
      leafValidationBadge.style.border = '1px solid #fde68a';
    }

    if (data.validation_warning) {
      warningMessage.textContent = data.validation_warning;
      resultWarning.classList.remove('hidden');
    }

    // Render Probabilities SVG Line Graph
    if (data.top_predictions) {
      renderLineGraph(data.top_predictions);
    }

    // Predictions list with percentage-based color themes & smooth progress bar fill animation
    predictionsList.innerHTML = '';
    if (data.top_predictions) {
      data.top_predictions.forEach(pred => {
        const predTheme = getConfidenceTheme(pred.confidence);
        const item = document.createElement('div');
        item.className = 'pred-item';
        item.innerHTML = `
          <div class="pred-info">
            <span>${pred.disease}</span>
            <span style="color: ${predTheme.text}; font-weight: 700;">${pred.confidence.toFixed(1)}%</span>
          </div>
          <div class="pred-bar-bg">
            <div class="pred-bar-fill" style="width: 0%; background: ${predTheme.barGradient}; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          </div>
        `;
        predictionsList.appendChild(item);

        setTimeout(() => {
          const fill = item.querySelector('.pred-bar-fill');
          if (fill) fill.style.width = `${Math.min(pred.confidence, 100)}%`;
        }, 60);
      });
    }

    // GradCAM
    if (data.gradcam_b64) {
      gradcamImg.src = `data:image/jpeg;base64,${data.gradcam_b64}`;
      gradcamBox.classList.remove('hidden');
    } else {
      gradcamBox.classList.add('hidden');
    }

    // Unhide Treatment Content
    const treatmentPlaceholder = document.getElementById('treatmentPlaceholder');
    const treatmentContent = document.getElementById('treatmentContent');

    if (info) {
      symptomsText.textContent = info.symptoms || 'Not available';
      causesText.textContent = info.causes || 'Not available';
      treatmentText.textContent = info.treatment || 'Not available';
      preventionText.textContent = info.prevention || 'Not available';
    } else {
      symptomsText.textContent = 'Standard leaf monitoring recommended.';
      causesText.textContent = 'Fungal / bacterial leaf conditions.';
      treatmentText.textContent = 'Apply appropriate fungicide / bactericide treatment as prescribed.';
      preventionText.textContent = 'Maintain proper crop spacing, drip irrigation, and crop rotation.';
    }

    if (treatmentPlaceholder) treatmentPlaceholder.classList.add('hidden');
    if (treatmentContent) treatmentContent.classList.remove('hidden');

    resultContent.classList.remove('hidden');
  }

  btnToggleGradcam.addEventListener('click', () => {
    gradcamPreview.classList.toggle('hidden');
  });

  // Export Report PDF
  btnDownloadReport.addEventListener('click', async () => {
    if (!state.currentPrediction) return;

    const payload = {
      disease: state.currentPrediction.disease,
      confidence: state.currentPrediction.confidence,
      symptoms: state.currentDiseaseInfo?.symptoms || '',
      causes: state.currentDiseaseInfo?.causes || '',
      treatment: state.currentDiseaseInfo?.treatment || '',
      prevention: state.currentDiseaseInfo?.prevention || '',
      image_b64: state.currentImageBase64 || imagePreview.src || ''
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
        a.download = `plantexa_report_${state.currentPrediction.disease.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Failed to export report PDF.');
    }
  });

  btnAskAssistant.addEventListener('click', () => {
    switchTab('assistant');
    if (state.currentPrediction) {
      chatInput.value = `Can you explain the best treatment steps for ${state.currentPrediction.disease}?`;
    }
  });

  // --- Knowledge Base ---
  async function fetchDiseasesKnowledgeBase() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diseases`);
      const res = await response.json();
      if (res.success) {
        state.diseasesData = res.diseases;
        renderKnowledgeGrid(res.diseases);
      }
    } catch (err) {
      console.error('Failed to load disease knowledge base:', err);
    }
  }

  function renderKnowledgeGrid(diseases) {
    knowledgeGrid.innerHTML = '';
    const query = knowledgeSearch.value.toLowerCase().trim();

    Object.keys(diseases).forEach(key => {
      const item = diseases[key];
      const name = item.disease_name || key;
      if (query && !name.toLowerCase().includes(query) && !key.toLowerCase().includes(query)) {
        return;
      }

      const card = document.createElement('div');
      const heading = document.createElement('h3');
      const summary = document.createElement('p');
      const label = document.createElement('strong');

      card.className = 'kb-card';
      heading.textContent = name;
      label.textContent = 'Symptoms: ';
      summary.append(label, document.createTextNode(item.symptoms || 'N/A'));
      card.append(heading, summary);
      card.addEventListener('click', () => openDiseaseModal(name, item));
      knowledgeGrid.appendChild(card);
    });
  }

  knowledgeSearch.addEventListener('input', () => {
    renderKnowledgeGrid(state.diseasesData);
  });

  function openDiseaseModal(title, info) {
    modalDiseaseTitle.textContent = title;
    modalDiseaseBody.innerHTML = '';
    [
      ['Symptoms', info.symptoms],
      ['Causes', info.causes],
      ['Treatment', info.treatment],
      ['Prevention', info.prevention]
    ].forEach(([label, content], index) => {
      const section = document.createElement('div');
      const heading = document.createElement('h4');
      const paragraph = document.createElement('p');

      section.className = 'detail-section';
      if (index < 3) section.style.marginBottom = '12px';
      heading.style.color = 'var(--accent-forest)';
      heading.textContent = label;
      paragraph.style.fontSize = '13px';
      paragraph.textContent = content || 'Not available';
      section.append(heading, paragraph);
      modalDiseaseBody.appendChild(section);
    });
    diseaseModal.classList.remove('hidden');
  }

  btnCloseDiseaseModal.addEventListener('click', () => {
    diseaseModal.classList.add('hidden');
  });

  renderStaticChips(i18n[state.language] || i18n.English);

  // --- AI Chatbot ---
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (!prompt) return;
    sendMessage(prompt);
  });

  chatChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip-btn')) {
      const prompt = e.target.getAttribute('data-query');
      sendMessage(prompt);
    }
  });

  async function sendMessage(promptText) {
    chatInput.value = '';

    // Add user message
    state.chatMessages.push({ role: 'user', content: promptText });
    renderChatMessages();

    // Placeholder loader
    const loaderMsg = { role: 'assistant', content: '⏳ Plantexa AI is thinking...' };
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
      state.chatMessages.pop(); // Remove loader

      if (res.reply) {
        state.chatMessages.push({ role: 'assistant', content: res.reply });
      } else {
        state.chatMessages.push({ role: 'assistant', content: `⚠️ ${res.error || 'No response from assistant.'}` });
      }

      if (res.followups && res.followups.length > 0) {
        renderFollowupChips(res.followups);
      }

      renderChatMessages();
    } catch (err) {
      state.chatMessages.pop();
      state.chatMessages.push({ role: 'assistant', content: `⚠️ Error contacting chat server: ${err.message}` });
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

  function formatInlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
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
        listItems.push(formatInlineMarkdown(listMatch[1]));
      } else if (headingMatch) {
        flushList();
        const level = headingMatch[1].length + 2;
        html.push(`<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`);
      } else if (trimmed) {
        flushList();
        html.push(`<p>${formatInlineMarkdown(trimmed)}</p>`);
      } else {
        flushList();
      }
    });

    flushList();
    return html.join('') || '<p></p>';
  }

  function renderChatMessages() {
    chatBody.innerHTML = '';
    state.chatMessages.forEach(msg => {
      const bubble = document.createElement('div');
      const content = document.createElement('div');
      bubble.className = `message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`;
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
    chatChips.innerHTML = '';
    followups.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn';
      btn.setAttribute('data-query', q);
      btn.textContent = q;
      chatChips.appendChild(btn);
    });
  }

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
        a.download = 'plantexa_ai_chat_transcript.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Failed to export chat transcript.');
    }
  });

  btnClearChat.addEventListener('click', () => {
    state.chatMessages = [
      {
        role: 'assistant',
        content: (i18n[state.language] || i18n.English).assistantGreeting
      }
    ];
    renderChatMessages();
    renderStaticChips(i18n[state.language] || i18n.English);
  });

  // --- Profile Modal ---
  btnProfileModal.addEventListener('click', () => {
    profileModal.classList.remove('hidden');
  });

  btnCloseProfile.addEventListener('click', () => {
    profileModal.classList.add('hidden');
  });

  avatarOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      avatarOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  btnSaveProfile.addEventListener('click', () => {
    const activeOpt = document.querySelector('.avatar-option.active');
    if (activeOpt) {
      state.userProfile.avatar = activeOpt.getAttribute('data-avatar');
    }
    state.userProfile.name = usernameInput.value.trim() || 'Farmer Jyoti';

    headerAvatar.textContent = state.userProfile.avatar;

    profileModal.classList.add('hidden');
  });
});
