document.addEventListener("DOMContentLoaded", () => {
  setProgress(100);
});

function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
  }
}

let userPoints = parseInt(localStorage.getItem("userPoints")) || 0;
let hasAnswered = false;

function chooseOption(choice) {
  if (hasAnswered) return;
  hasAnswered = true;

  const feedback = document.getElementById('feedback');
  const options = document.querySelector('.sms-options');
  const resultBtn = document.getElementById('result-btn');
  const databrudScreen = document.getElementById('databrud-screen');
  const smsMessage = document.querySelector('.phone-frame');
  
  // Få fat i instruktionsteksterne
  const paragraphs = document.querySelectorAll('main.sms > p');
  const smsIntroText = paragraphs[0]; // "Du modtager følgende SMS:"
  const questionText = paragraphs[1]; // "Hvad gør du?"
  
  // Skjul options, SMS-besked og instruktionstekster
  options.style.display = 'none';
  smsMessage.style.display = 'none';
  smsIntroText.style.display = 'none';
  questionText.style.display = 'none';

  if (choice === 'click') {
    // Vis databrud-skærmen med det samme uden forsinkelse
    feedback.style.display = 'none';
    databrudScreen.style.display = 'block';
    
    // Animér breach bar 
    setTimeout(() => {
      const breachBar = databrudScreen.querySelector('.breach-bar');
      if (breachBar) {
        breachBar.style.width = '100%';
      }
    }, 500);
  } else {
    // Korrekt valg - vis "Se resultat" knappen
    if (choice === 'delete') {
      feedback.innerHTML = `
        <div class="success-message">
          <div class="success-icon">
            <i class="fas fa-trash-alt"></i>
          </div>
          <div class="success-content">
            <h3>Godt valg!</h3>
            <p>At slette mistænkelige beskeder uden at klikke på links er en sikker praksis der beskytter dig mod svindel.</p>
            <div class="security-meter">
              <div class="meter-label">Sikkerhedsniveau:</div>
              <div class="meter-bar">
                <div class="meter-fill delete-level"></div>
              </div>
              <div class="meter-value">God</div>
            </div>
            <div class="success-details">
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span>Undgår phishing-forsøg</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span>Beskytter personlige data</span>
              </div>
            </div>
          </div>
        </div>
      `;
      feedback.className = 'success';
      userPoints += 1; // 1 point for at slette
      
      // Security Meter
      setTimeout(() => {
        const meterFill = document.querySelector('.meter-fill.delete-level');
        if (meterFill) meterFill.style.width = '70%';
      }, 100);
      
    } else if (choice === 'google') {
      feedback.innerHTML = `
        <div class="success-message">
          <div class="success-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="success-content">
            <h3>Excellent valg!</h3>
            <p>At verificere afsenderen ved at søge information online er den sikreste tilgang til mistænkelige beskeder.</p>
            <div class="security-meter">
              <div class="meter-label">Sikkerhedsniveau:</div>
              <div class="meter-bar">
                <div class="meter-fill google-level"></div>
              </div>
              <div class="meter-value">Meget Høj</div>
            </div>
            <div class="success-details">
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span>Aktiv verifikation</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span>Finder legitime kontaktpunkter</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span>Identificerer kendte svindelforsøg</span>
              </div>
            </div>
          </div>
        </div>
      `;
      feedback.className = 'success';
      userPoints += 2; // 2 point for at google
      
      // Animate security meter
      setTimeout(() => {
        const meterFill = document.querySelector('.meter-fill.google-level');
        if (meterFill) meterFill.style.width = '100%';
      }, 100);
    }
    
    // Vis "Se resultat" knappen med komplet inline styling
    resultBtn.innerHTML = 'Se resultat';
    
    // Anvender alle styles direkte for at undgå CSS-kompileringsproblemer
    resultBtn.style.display = 'inline-block';
    resultBtn.style.marginTop = '2rem';
    resultBtn.style.padding = '0.75rem 2rem';
    resultBtn.style.fontSize = '1.1rem';
    resultBtn.style.background = 'linear-gradient(to right, #007acc, #005fa3)';
    resultBtn.style.color = 'white';
    resultBtn.style.border = 'none';
    resultBtn.style.borderRadius = '8px';
    resultBtn.style.cursor = 'pointer';
    resultBtn.style.fontWeight = '600';
    resultBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
  }

  localStorage.setItem("userPoints", userPoints);
  
  // Gem scenarieData i localStorage
  let scenarieData = [];
  try {
    const savedData = localStorage.getItem('scenarieData');
    if (savedData) {
      scenarieData = JSON.parse(savedData);
    }
  } catch (e) {
    console.error('Fejl ved indlæsning af scenarieData:', e);
    scenarieData = [];
  }
  
  // Find SMS scenariet hvis det allerede eksisterer i data
  const smsIndex = scenarieData.findIndex(scene => scene.navn === 'SMS');
  
  // Opdater SMS scenariet eller tilføj det, hvis det ikke findes
  const scoreValue = choice === 'google' ? 2 : (choice === 'delete' ? 1 : 0);
  const smsScenarie = {
    navn: 'SMS',
    score: scoreValue,
    maxScore: 2,
    tip: 'Del aldrig følsomme informationer i SMS-beskeder uden at bekræfte afsenderens identitet.',
    color: '#e67e22',
    mangler: scoreValue === 2 ? [] : ['Verificering af afsenderens telefonnummer før du svarer']
  };
  
  if (smsIndex !== -1) {
    scenarieData[smsIndex] = smsScenarie;
  } else {
    scenarieData.push(smsScenarie);
  }
  
  // Gem opdateret scenarieData
  localStorage.setItem('scenarieData', JSON.stringify(scenarieData));
}

function goToResult() {
  window.location.href = "resultat.html";
}
