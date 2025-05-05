// Kodeord.js - Interaktiv kodeordssimulation

document.addEventListener("DOMContentLoaded", () => {
  setProgress(75); // brug 25, 50, 75, 100 afhængigt af scenarie
  initPasswordSimulation();
  
  // Sørg for at kun initialskærmen vises ved indlæsning
  hideAllScreensExceptInitial();
});

function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
  }
}

// 1. Liste over almindelige kodeord som bør undgås
const commonPasswords = [
  "123456", "password", "123456789", "12345678", "12345", "1234567", "1234567890", "qwerty", 
  "abc123", "kodeord", "admin", "welcome", "monkey", "login", "princess", "admin123", 
  "654321", "password123", "qwerty123", "000000", "111111", "666666", "password1", 
  "velkommen", "kodeord123", "adgangskode", "sommer", "vinter", "forår", "efterår", 
  "danmark", "fodbold", "hej123", "hejhej", "abcd1234", "aaaaaaaa", "12341234", "1q2w3e4r", 
  "qwertyuiop", "asdfghjkl", "zxcvbnm", "letmein", "superman", "iloveyou", "sunshine"
];

// 2. Danske ord til kodeordsgenerering
const danishNouns = [
  "hest", "æble", "blomst", "skole", "hus", "køkken", "bord", "stol", "lampe", "cykel", 
  "bog", "blad", "træ", "sol", "måne", "himmel", "sky", "skov", "strand", "hav", 
  "kat", "hund", "fugl", "fisk", "banan", "jordbær", "ananas", "tomat", "agurk", "ost"
];

const danishAdjectives = [
  "rød", "blå", "grøn", "gul", "sort", "hvid", "stor", "lille", "glad", "sur", 
  "lang", "kort", "tyk", "tynd", "hurtig", "langsom", "ny", "gammel", "ung", "klog"
];

// Variabler til at holde styr på brugeren
let userPoints = parseInt(localStorage.getItem("userPoints")) || 0;
let hasChecked = false;
let tryAgainAfterError = false;
let passwordStrength = 0;

function initPasswordSimulation() {
  // Reset status
  hasChecked = false;
  tryAgainAfterError = false;
  passwordStrength = 0;
  
  // Lyt efter input for real-time feedback
  const passwordInput = document.getElementById('passwordInput');
  passwordInput.addEventListener('input', function() {
    updatePasswordStrength();
    
    // Vis kravene når brugeren begynder at skrive
    const liveRequirements = document.getElementById('live-requirements');
    if (passwordInput.value.length > 0 && liveRequirements) {
      liveRequirements.style.display = 'block';
    } else if (liveRequirements) {
      liveRequirements.style.display = 'none';
    }
  });
  
  // Fokuser på input-feltet når siden indlæses
  passwordInput.focus();
  
  // Skjul tip-sektionen ved start
  if (document.getElementById('passwordTips')) {
    document.getElementById('passwordTips').style.display = 'none';
  }
  
  // Skjul kravene ved start
  if (document.getElementById('live-requirements')) {
    document.getElementById('live-requirements').style.display = 'none';
  }
  
  // Tilføj tastatur-genvej (Enter-tasten)
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkPassword();
    }
  });
  
  console.log("Kodeordssimulation initialiseret!");
}

// 1. Real-time kodeordsstyrkeberegning
function updatePasswordStrength() {
  const password = document.getElementById('passwordInput').value;
  const meter = document.getElementById('strengthMeter');
  const strengthText = document.getElementById('strengthText');
  
  // Fjern alle tidligere klasser
  meter.className = 'strength-meter';
  strengthText.className = 'strength-text';
  
  // Opdater krav-indikatorer live
  updateRequirements(password);
  
  // Beregn score baseret på forskellige faktorer
  let score = calculatePasswordScore(password);
  
  // Opdater visuel styrkeindikator
  if (password.length === 0) {
    meter.className = 'strength-meter';
    strengthText.textContent = 'Kodeordsstyrke';
    strengthText.className = 'strength-text';
    passwordStrength = 0;
  } else if (score < 40) {
    meter.className = 'strength-meter very-weak';
    strengthText.textContent = 'Meget svagt kodeord';
    strengthText.className = 'strength-text very-weak';
    passwordStrength = 1;
  } else if (score < 60) {
    meter.className = 'strength-meter weak';
    strengthText.textContent = 'Svagt kodeord';
    strengthText.className = 'strength-text weak';
    passwordStrength = 2;
  } else if (score < 80) {
    meter.className = 'strength-meter medium';
    strengthText.textContent = 'Middel kodeord';
    strengthText.className = 'strength-text medium';
    passwordStrength = 3;
  } else if (score < 100) {
    meter.className = 'strength-meter strong';
    strengthText.textContent = 'Stærkt kodeord';
    strengthText.className = 'strength-text strong';
    passwordStrength = 4;
  } else {
    meter.className = 'strength-meter very-strong';
    strengthText.textContent = 'Meget stærkt kodeord';
    strengthText.className = 'strength-text very-strong';
    passwordStrength = 5;
  }
}

// 2. Live-opdatering af krav
function updateRequirements(password) {
  // Tjek krav
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isCommon = isCommonPassword(password);
  
  // Vis alle elementer i requirements container
  const liveRequirements = document.getElementById('live-requirements');
  if (liveRequirements) {
    // Skjul eller vis krav-containeren baseret på om der er indtastet noget
    if (password.length > 0) {
      liveRequirements.style.display = 'block';
    } else {
      liveRequirements.style.display = 'none';
      return; // Afslut funktionen hvis kodeordet er tomt
    }
  }
  
  // Håndter krav enkeltvis - vis kun dem der er opfyldt
  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqLowercase = document.getElementById('req-lowercase');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');
  const reqCommon = document.getElementById('req-common');
  
  // Opdater synlighed baseret på opfyldelse
  reqLength.style.display = isLongEnough ? 'block' : 'none';
  reqUppercase.style.display = hasUppercase ? 'block' : 'none';
  reqLowercase.style.display = hasLowercase ? 'block' : 'none';
  reqNumber.style.display = hasNumber ? 'block' : 'none';
  reqSpecial.style.display = hasSpecialChar ? 'block' : 'none';
  
  // Opdater ikoner og klasser for de opfyldte krav
  if (isLongEnough) {
    reqLength.className = 'requirement met';
    reqLength.querySelector('.icon').textContent = '✅';
  }
  
  if (hasUppercase) {
    reqUppercase.className = 'requirement met';
    reqUppercase.querySelector('.icon').textContent = '✅';
  }
  
  if (hasLowercase) {
    reqLowercase.className = 'requirement met';
    reqLowercase.querySelector('.icon').textContent = '✅';
  }
  
  if (hasNumber) {
    reqNumber.className = 'requirement met';
    reqNumber.querySelector('.icon').textContent = '✅';
  }
  
  if (hasSpecialChar) {
    reqSpecial.className = 'requirement met';
    reqSpecial.querySelector('.icon').textContent = '✅';
  }
  
  // Håndter almindeligt kodeord-kravet
  if (password.length >= 4) {
    if (!isCommon) { // Bemærk at vi viser kun hvis det IKKE er almindeligt
      reqCommon.style.display = 'block';
      reqCommon.className = 'requirement met';
      reqCommon.querySelector('.icon').textContent = '✅';
      reqCommon.querySelector('.text').textContent = 'Ikke et almindeligt kodeord';
    } else {
      reqCommon.style.display = 'none';
    }
  } else {
    reqCommon.style.display = 'none';
  }
}

// Hjælpefunktion til at opdatere de enkelte krav i UI
function updateRequirementUI(reqId, isMet) {
  const req = document.getElementById(reqId);
  const icon = req.querySelector('.icon');
  
  if (isMet) {
    req.className = 'requirement met';
    icon.textContent = '✅';
  } else {
    req.className = 'requirement not-met';
    icon.textContent = '❌';
  }
}

// 3. Beregn password score baseret på komplekse faktorer
function calculatePasswordScore(password) {
  if (!password) return 0;
  
  let score = 0;
  
  // Grundlæggende længdeberegning (op til 40 point)
  score += Math.min(40, password.length * 4);
  
  // Varietet af tegn (op til 30 point)
  let varieties = {
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  let varietyCount = Object.values(varieties).filter(Boolean).length;
  score += varietyCount * 10;
  
  // Bonus for blanding af tegn (op til 15 point)
  let hasLowerAndUpper = varieties.lower && varieties.upper;
  let hasLetterAndNumber = (varieties.lower || varieties.upper) && varieties.number;
  let hasLetterNumberSpecial = hasLetterAndNumber && varieties.special;
  
  if (hasLowerAndUpper) score += 5;
  if (hasLetterAndNumber) score += 5;
  if (hasLetterNumberSpecial) score += 5;
  
  // Straf for gentagelser og mønstre (op til -30 point)
  let repeats = password.match(/(.+)\1+/g);
  if (repeats) score -= repeats.length * 5;
  
  // Straf for sekvenser (123, abc, etc.) (op til -20 point)
  if (/(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    score -= 20;
  }
  
  // Straf hvis kodeordet er almindeligt (op til -50 point)
  if (isCommonPassword(password)) {
    score -= 50;
  }
  
  // Endelig score (minimum 0, maksimum 100)
  return Math.max(0, Math.min(100, score));
}

// 4. Tjek om kodeordet er på almindelige kodeordsliste
function isCommonPassword(password) {
  if (password.length < 4) return false;
  
  // Konverter til lowercase for sammenligning
  let lowercasePassword = password.toLowerCase();
  
  // Tjek for eksakt match
  if (commonPasswords.includes(lowercasePassword)) return true;
  
  // Tjek for match med tal tilføjet i slutningen
  let basePassword = lowercasePassword.replace(/\d+$/, '');
  if (basePassword.length >= 4 && commonPasswords.includes(basePassword)) return true;
  
  return false;
}

// 5. Funktion til at vise/skjule kodeordstips
function togglePasswordTips() {
  const tips = document.getElementById('passwordTips');
  const btn = document.getElementById('showTipsBtn');
  
  if (tips.classList.contains('show')) {
    tips.classList.remove('show');
    btn.textContent = 'Vis tips til gode kodeord';
  } else {
    tips.classList.add('show');
    btn.textContent = 'Skjul tips';
  }
}

// 6. Funktion til at vise/skjule kodeordet
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('passwordInput');
  const toggleIcon = document.getElementById('toggleIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.className = 'fa fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    toggleIcon.className = 'fa fa-eye';
  }
}

// Kodeordsgenerering er fjernet i denne version

// 8. Konfetti-animation ved succes
function showSuccessConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// 9. Tjek kodeord og beregn point
function checkPassword() {
  const password = document.getElementById('passwordInput').value;
  
  // Afbryd hvis inputfeltet er tomt
  if (!password) {
    alert('Du skal indtaste et kodeord før du kan fortsætte.');
    return;
  }
  
  // Gem inputfeltet og kontroller
  document.getElementById('initial-screen').classList.add('hidden');
  
  // Tjek krav til kodeordet
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isNotCommon = !isCommonPassword(password);
  
  // Samlet krav opfyldt
  const requirements = {
    isLongEnough, hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isNotCommon
  };
  
  // Tæl antal opfyldte krav
  const metRequirementsCount = Object.values(requirements).filter(Boolean).length;
  
  // Beregn point baseret på de krav, der er opfyldt
  let pointsThisScenario = metRequirementsCount * 2;
  
  // For svage kodeord (styrke 1-2) - vis databrud skærmen
  if (passwordStrength <= 2) {
    showDatabrudScreen(password, requirements);
    
    // Marker at brugeren skal prøve igen
    tryAgainAfterError = true;
    hasChecked = true;
  }
  // For stærke nok kodeord (styrke 3+) - vis success skærmen
  else {
    // Opdater brugerens totale point
    userPoints += pointsThisScenario;
    localStorage.setItem("userPoints", userPoints);
    
    // Vis success skærm med feedback
    showSuccessScreen(password, requirements, pointsThisScenario);
    
    // Vis konfetti-animation hvis kodeordet er meget stærkt
    if (passwordStrength >= 4) {
      showSuccessConfetti();
    }
    
    // Marker at brugeren kan fortsætte
    tryAgainAfterError = false;
    hasChecked = true;
  }
}

// Vis databrud-skærmen med feedback om svagt kodeord
function showDatabrudScreen(password, requirements) {
  // Vis databrud-skærmen - fjern både hidden klasse og display:none
  const databrudScreen = document.getElementById('databrud-screen');
  databrudScreen.classList.remove('hidden');
  databrudScreen.style.display = 'block';
  
  // Skjul initialskærmen og success-skærmen
  document.getElementById('initial-screen').classList.add('hidden');
  document.getElementById('initial-screen').style.display = 'none';
  
  const successScreen = document.getElementById('success-screen');
  successScreen.classList.add('hidden');
  successScreen.style.display = 'none';
  
  // Beregn estimeret hackningstid baseret på kodeordets kompleksitet
  let hackTime = 'få sekunder';
  if (password.length <= 6) {
    hackTime = 'mindre end et sekund';
  } else if (password.length <= 8 && !requirements.hasSpecialChar) {
    hackTime = 'få minutter';
  } else if (passwordStrength === 2) {
    hackTime = 'nogle timer';
  }
  
  // Opdater hackningstid
  document.getElementById('hack-time').textContent = hackTime;
  
  // Start breach-animation
  if (document.querySelector('.breach-bar')) {
    document.querySelector('.breach-bar').style.width = '0%';
    setTimeout(() => {
      document.querySelector('.breach-bar').style.width = '100%';
    }, 100);
  }
  
  // Vis hvilke krav der ikke blev opfyldt
  const failedRequirementsContainer = document.getElementById('failed-requirements');
  failedRequirementsContainer.innerHTML = '';
  
  // Vis fejlede krav med tydelig rød markering
  if (!requirements.isLongEnough) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Minimum 8 tegn', false);
  }
  if (!requirements.hasUppercase) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét stort bogstav (A-Z)', false);
  }
  if (!requirements.hasLowercase) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét lille bogstav (a-z)', false);
  }
  if (!requirements.hasNumber) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét tal (0-9)', false);
  }
  if (!requirements.hasSpecialChar) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét specialtegn (!@#$%^&*)', false);
  }
  if (!requirements.isNotCommon) {
    failedRequirementsContainer.innerHTML += createRequirementHTML('Undgå almindelige kodeord og mønstre', false);
  }
  
  // Hvis der ikke var nogle fejlede krav (men kodeordet var stadig svagt)
  if (failedRequirementsContainer.innerHTML === '') {
    failedRequirementsContainer.innerHTML = createRequirementHTML('Dit kodeord er for simpelt og let at gætte', false);
  }
  
  // Vis kodeordstips-sektionen
  document.getElementById('passwordTips').style.display = 'block';
  
  // Find knapper i action-buttons div'en
  const actionButtons = document.querySelector('#databrud-screen .action-buttons');
  if (actionButtons) {
    // Fjern alle eksisterende knapper
    while (actionButtons.firstChild) {
      actionButtons.removeChild(actionButtons.firstChild);
    }
    
    // Tilføj kun 'Prøv igen' knappen
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.className = 'primary-btn';
    tryAgainBtn.id = 'tryAgainBtn';
    tryAgainBtn.textContent = 'Prøv igen';
    tryAgainBtn.onclick = resetSimulation;
    actionButtons.appendChild(tryAgainBtn);
  }
}

// Vis success-skærmen med feedback om stærkt kodeord
function showSuccessScreen(password, requirements, points) {
  // Vis success-skærmen - fjern både hidden klasse og display:none
  const successScreen = document.getElementById('success-screen');
  successScreen.classList.remove('hidden');
  successScreen.style.display = 'block';
  
  // Skjul initialskærmen og databrud-skærmen
  document.getElementById('initial-screen').classList.add('hidden');
  document.getElementById('initial-screen').style.display = 'none';
  
  const databrudScreen = document.getElementById('databrud-screen');
  databrudScreen.classList.add('hidden');
  databrudScreen.style.display = 'none';
  
  // Sæt styrke-tekst baseret på passwordStrength
  const strengthText = document.getElementById('success-strength-text');
  if (passwordStrength >= 5) {
    strengthText.textContent = 'meget stærkt';
    strengthText.style.color = '#27ae60';
  } else if (passwordStrength === 4) {
    strengthText.textContent = 'stærkt';
    strengthText.style.color = '#3498db';
  } else {
    strengthText.textContent = 'nogenlunde stærkt';
    strengthText.style.color = '#f39c12';
  }
  
  // Vis hvilke krav der blev opfyldt og ikke opfyldt
  const metRequirementsContainer = document.getElementById('met-requirements');
  metRequirementsContainer.innerHTML = '';
  
  // Vis status for alle krav, både opfyldte og ikke-opfyldte
  metRequirementsContainer.innerHTML += createRequirementHTML('Minimum 8 tegn', requirements.isLongEnough);
  metRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét stort bogstav (A-Z)', requirements.hasUppercase);
  metRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét lille bogstav (a-z)', requirements.hasLowercase);
  metRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét tal (0-9)', requirements.hasNumber);
  metRequirementsContainer.innerHTML += createRequirementHTML('Mindst ét specialtegn (!@#$%^&*)', requirements.hasSpecialChar);
  metRequirementsContainer.innerHTML += createRequirementHTML('Undgå almindelige kodeord og mønstre', requirements.isNotCommon);
  
  // Vis feedback om point og styrke
  const successFeedback = document.getElementById('success-feedback');
  successFeedback.innerHTML = `
    <strong>Godt arbejde!</strong> Du har optjent ${points} point i dette scenarie.
    ${passwordStrength >= 5 ? 'Dit kodeord er ekstremt stærkt og ville tage en hacker årevis at gætte.' : ''}
    ${passwordStrength === 4 ? 'Dit kodeord er stærkt og ville tage en hacker måneder eller år at gætte.' : ''}
    ${passwordStrength === 3 ? 'Dit kodeord kan stadig gøres stærkere ved at gøre det længere eller tilføje flere specialtegn.' : ''}
  `;
}

// Hjelpefunktion til at skabe HTML for et krav
function createRequirementHTML(text, isMet) {
  return `
    <div class="requirement ${isMet ? 'met' : 'not-met'}">
      <span class="icon">${isMet ? '✅' : '❌'}</span>
      <span class="text">${text}</span>
    </div>
  `;
}

// Funktion der sørger for at kun initialskærmen vises
function hideAllScreensExceptInitial() {
  // Vis kun initialskærmen
  document.getElementById('initial-screen').classList.remove('hidden');
  document.getElementById('initial-screen').style.display = 'block';
  
  // Skjul databrud-skærmen med både klasse og inline style
  const databrudScreen = document.getElementById('databrud-screen');
  databrudScreen.classList.add('hidden');
  databrudScreen.style.display = 'none';
  
  // Skjul success-skærmen med både klasse og inline style
  const successScreen = document.getElementById('success-screen');
  successScreen.classList.add('hidden');
  successScreen.style.display = 'none';
  
  // Skjul tips og krav
  if (document.getElementById('passwordTips')) {
    document.getElementById('passwordTips').style.display = 'none';
  }
  
  if (document.getElementById('live-requirements')) {
    document.getElementById('live-requirements').style.display = 'none';
  }
  
  // Reset breach-animation
  if (document.querySelector('.breach-bar')) {
    document.querySelector('.breach-bar').style.width = '0%';
  }
}

// Reset simuleringen så brugeren kan prøve igen
function resetSimulation() {
  // Skjul alle skærme først
  document.getElementById('databrud-screen').classList.add('hidden');
  document.getElementById('databrud-screen').style.display = 'none';
  document.getElementById('success-screen').classList.add('hidden');
  document.getElementById('success-screen').style.display = 'none';
  
  // Vis startskærmen igen
  document.getElementById('initial-screen').classList.remove('hidden');
  document.getElementById('initial-screen').style.display = 'block';
  
  // Nulstil input og status
  document.getElementById('passwordInput').value = '';
  document.getElementById('passwordInput').focus();
  hasChecked = false;
  tryAgainAfterError = false;
  
  // Nulstil styrke-indikatoren
  const meter = document.getElementById('strengthMeter');
  const strengthText = document.getElementById('strengthText');
  meter.className = 'strength-meter';
  strengthText.textContent = 'Kodeordsstyrke';
  strengthText.className = 'strength-text';
  passwordStrength = 0;
  
  // Sørg for at tips og krav er skjulte når vi starter forfra
  if (document.getElementById('passwordTips')) {
    document.getElementById('passwordTips').style.display = 'none';
  }
  
  if (document.getElementById('live-requirements')) {
    document.getElementById('live-requirements').style.display = 'none';
  }
  
  // Nulstil breach-animationen
  if (document.querySelector('.breach-bar')) {
    document.querySelector('.breach-bar').style.width = '0%';
  }
  
  // Fjern duplicate buttons på Databrud-skærmen og genopret original knap
  const databrudButtons = document.querySelector('#databrud-screen .action-buttons');
  if (databrudButtons) {
    // Fjern alle knapper
    databrudButtons.innerHTML = '';
    
    // Gendan "Prøv igen" knap
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.className = 'primary-btn';
    tryAgainBtn.id = 'tryAgainBtn';
    tryAgainBtn.textContent = 'Prøv igen';
    tryAgainBtn.onclick = function() { resetSimulation(); };
    databrudButtons.appendChild(tryAgainBtn);
  }
}

// 10. Navigation til næste scenarie
function goToNextScenario() {
  // Tjek om brugeren har et acceptabelt kodeord
  if (passwordStrength >= 3 && !document.getElementById('success-screen').classList.contains('hidden')) {
    // Kodeordet er stærkt nok og brugeren er på succes-skærmen, gå videre
    window.location.href = "sms.html"; // Go to scenario 4
    return;
  }
  
  // Hvis brugeren er på databrud-skærmen
  if (!document.getElementById('databrud-screen').classList.contains('hidden')) {
    alert('Du skal oprette et stærkere kodeord for at gå videre.');
    resetSimulation(); // Gå tilbage til kodeord-inputtet
    return;
  }
  
  // Hvis brugeren prøver at gå videre uden at have valideret
  alert('Du skal først kontrollere dit kodeord ved at trykke Enter.');
}
