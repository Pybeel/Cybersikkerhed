/**
 * WiFi Sikkerhedsscenarie
 * ====================
 *
 * Indholdsfortegnelse:
 * -------------------
 * 1. Initialisering
 *    - Event listeners
 *    - Progress bar opsætning
 *    - Variabel initialisering
 * 
 * 2. Bruger Interaktion
 *    - Valg håndtering (chooseOption)
 *    - Feedback visning
 *    - Animation triggering
 * 
 * 3. Sikkerhedsfeedback
 *    - Sikker mobilnetværk (2 point)
 *    - VPN løsning (1 point)
 *    - Usikker WiFi (0 point + databrud)
 * 
 * 4. Visuelle Elementer
 *    - Sikkerhedsmeter
 *    - Success/fejl ikoner
 *    - Databrud animation
 * 
 * 5. Data Håndtering
 *    - Point beregning
 *    - Local Storage
 *    - Scenarie data
 * 
 * 6. Navigation
 *    - Automatisk progression
 *    - Næste scenarie
 *
 * Point System:
 * -------------
 * - Mobilnetværk: 2 point (bedste valg)
 * - VPN: 1 point (acceptabelt valg)
 * - Usikret WiFi: 0 point (usikkert valg)
 */

document.addEventListener("DOMContentLoaded", () => {
  setProgress(50); // Sæt progress bar til 50%
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
  const options = document.querySelector('.wifi-options');
  const nextBtn = document.getElementById('nextBtn');

  if (choice === 'unsafe') {
    // Databrud skærmen
    const databrudElement = document.createElement('div');
    databrudElement.id = 'databrud-screen';
    databrudElement.className = 'password-result-screen';
    databrudElement.innerHTML = `
      <div class="databrud-message">
        <div class="warning-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Databrud!</h2>
        <p>Du har valgt at bruge et gratis offentligt WiFi uden beskyttelse. En hacker på samme netværk har opsnappet dine data.</p>
        
        <div class="breach-visualization">
          <div class="breach-data">
            <div class="breach-progress">
              <div class="breach-bar" id="breach-progress-bar"></div>
            </div>
            <p>Dit data blev stjålet på <span id="hack-time">få sekunder</span></p>
          </div>
        </div>
      </div>
      
      <div class="password-requirements" id="databrud-requirements">
        <h3>Kompromitteret data:</h3>
        <div id="failed-requirements">
          <div class="requirement">
            <div class="icon"><i class="fas fa-times-circle"></i></div>
            <div class="text">Dine login oplysninger</div>
          </div>
          <div class="requirement">
            <div class="icon"><i class="fas fa-times-circle"></i></div>
            <div class="text">Personlige informationer</div>
          </div>
          <div class="requirement">
            <div class="icon"><i class="fas fa-times-circle"></i></div>
            <div class="text">Potentielt bankoplysninger</div>
          </div>
        </div>
      </div>
      
      <div class="password-tips" id="passwordTips" style="display: block;">
        <h3>Hvad kunne du have gjort bedre?</h3>
        <p>De sikrere valg ville have været:</p>
        <div class="tips-content">
          <div class="tip-item good">
            <i class="fas fa-check-circle"></i>
            <p><strong>Bruge en VPN</strong> - En VPN (Virtual Private Network) krypterer din internettrafik, selv på usikre netværk, så hackere ikke kan læse dine data.</p>
          </div>
          <div class="tip-item good">
            <i class="fas fa-check-circle"></i>
            <p><strong>Bruge dit mobilnetværk</strong> - Mobilnetværk er generelt meget sikrere end offentlige WiFi-netværk, da de er sværere at aflytte.</p>
          </div>
        </div>
      </div>
    `;
    
    // Tilføj databrud elementet til main
    const main = document.querySelector('main');
    main.appendChild(databrudElement);
    
    // Fjern feedback teksten og gem options
    feedback.style.display = 'none';
    options.style.display = 'none';
    
    // Animér progress bar
    setTimeout(() => {
      const breachBar = document.getElementById('breach-progress-bar');
      if (breachBar) {
        breachBar.style.width = '100%';
      }
    }, 500);
    
    // Vis en knap til at prøve igen, med samme styling som tryAgainBtn i databrud-enhanced.css
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.style.marginTop = '2.5rem';
    actionButtons.style.textAlign = 'center';
    
    const retryBtn = document.createElement('button');
    retryBtn.innerText = 'Prøv igen';
    retryBtn.id = 'tryAgainBtn'; // Tilføjer id for at matche CSS-selektoren i databrud-enhanced.css
    retryBtn.style.padding = '0.9rem 2.2rem';
    retryBtn.style.fontSize = '1.1rem';
    retryBtn.style.borderRadius = '50px';
    retryBtn.style.border = 'none';
    retryBtn.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
    retryBtn.style.color = '#fff';
    retryBtn.style.cursor = 'pointer';
    retryBtn.style.transition = 'all 0.3s';
    retryBtn.style.margin = '1.2rem 0.6rem';
    retryBtn.style.fontWeight = '600';
    retryBtn.style.letterSpacing = '0.5px';
    retryBtn.style.boxShadow = '0 4px 10px rgba(231, 76, 60, 0.3)';
    
    retryBtn.onmouseover = function() {
      this.style.background = 'linear-gradient(to right, #c0392b, #a93226)';
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 6px 15px rgba(231, 76, 60, 0.4)';
    };
    
    retryBtn.onmouseout = function() {
      this.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 10px rgba(231, 76, 60, 0.3)';
    };
    
    retryBtn.onmousedown = function() {
      this.style.transform = 'translateY(-1px)';
      this.style.boxShadow = '0 3px 8px rgba(231, 76, 60, 0.4)';
    };
    
    retryBtn.onclick = function() {
      window.location.reload();
    };
    
    actionButtons.appendChild(retryBtn);
    databrudElement.appendChild(actionButtons);
    
    // Opdater localStorage til at markere testen som afsluttet
    localStorage.setItem("testCompleted", "true");
  } else if (choice === 'vpn') {
    feedback.innerHTML = `
      <div class="success-message">
        <div class="success-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="success-content">
          <h3>Godt valg!</h3>
          <p>VPN krypterer din trafik, selv på usikre netværk.</p>
          <div class="security-meter">
            <div class="meter-label">Sikkerhedsniveau:</div>
            <div class="meter-bar">
              <div class="meter-fill vpn-level"></div>
            </div>
            <div class="meter-value">God</div>
          </div>
          <div class="success-details">
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <span>Din data er krypteret</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <span>Din IP-adresse er skjult</span>
            </div>
          </div>
        </div>
      </div>
    `;
    feedback.className = 'success';
    userPoints++; // 1 point for VPN
    
    // Styled next button
    nextBtn.className = 'next-btn vpn-next';
    nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Videre til næste scenarie';
    
    // Animated display
    setTimeout(() => {
      nextBtn.style.opacity = '1';
      nextBtn.style.transform = 'translateY(0)';
    }, 1000);
    
    // Animate security meter
    setTimeout(() => {
      const meterFill = document.querySelector('.meter-fill.vpn-level');
      if (meterFill) meterFill.style.width = '75%';
    }, 100);
    
  } else if (choice === 'mobile') {
    feedback.innerHTML = `
      <div class="success-message">
        <div class="success-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="success-content">
          <h3>Super valg!</h3>
          <p>Mobilnetværk er meget sikrere end offentligt WiFi.</p>
          <div class="security-meter">
            <div class="meter-label">Sikkerhedsniveau:</div>
            <div class="meter-bar">
              <div class="meter-fill mobile-level"></div>
            </div>
            <div class="meter-value">Meget Høj</div>
          </div>
          <div class="success-details">
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <span>Krypteret forbindelse</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <span>Personlig forbindelse</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <span>Stærkere autentificering</span>
            </div>
          </div>
        </div>
      </div>
    `;
    feedback.className = 'success';
    userPoints += 2; // 2 point for mobilnetværk
    
    // Styled next button
    nextBtn.className = 'next-btn mobile-next';
    nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Videre til næste scenarie';
    
    // Animated display
    setTimeout(() => {
      nextBtn.style.opacity = '1';
      nextBtn.style.transform = 'translateY(0)';
    }, 1000);
    
    // Animate security meter
    setTimeout(() => {
      const meterFill = document.querySelector('.meter-fill.mobile-level');
      if (meterFill) meterFill.style.width = '100%';
    }, 100);
  }

  localStorage.setItem("userPoints", userPoints);
  options.style.display = 'none';
  
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
  
  // Find wifi scenariet hvis det allerede eksisterer i data
  const wifiIndex = scenarieData.findIndex(scene => scene.navn === 'Wifi');
  
  // Opdater wifi scenariet eller tilføj det, hvis det ikke findes
  const scoreValue = choice === 'mobile' ? 2 : (choice === 'vpn' ? 1 : 0);
  const wifiScenarie = {
    navn: 'Wifi',
    score: scoreValue,
    maxScore: 2,
    tip: 'Brug kun sikre wifi-netværk med kryptering eller VPN på offentlige netværk.',
    color: '#2ecc71',
    mangler: scoreValue === 2 ? [] : ['Brug af mobildata i stedet for usikret offentligt wifi']
  };
  
  if (wifiIndex !== -1) {
    scenarieData[wifiIndex] = wifiScenarie;
  } else {
    scenarieData.push(wifiScenarie);
  }
  
  // Gem opdateret scenarieData
  localStorage.setItem('scenarieData', JSON.stringify(scenarieData));
  
  // Kun automatisk fortsæt hvis det ikke er unsafe valg
  if (choice !== 'unsafe') {
    setTimeout(() => {
      goToNextScenario();
    }, 8000);
  }
}

function goToNextScenario() {
  window.location.href = "kodeord.html"; 
}
