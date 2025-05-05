document.addEventListener("DOMContentLoaded", () => {
  setProgress(50); 
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
    // Skab et databrud element der matcher strukturen fra kodeord.html
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
    feedback.innerText = "✅ Godt valg! VPN krypterer din trafik, selv på usikre netværk.";
    userPoints++;
    nextBtn.style.display = 'block';
  } else if (choice === 'mobile') {
    feedback.innerText = "✅ Super valg! Mobilnetværk er meget sikrere end offentligt WiFi.";
    userPoints++;
    nextBtn.style.display = 'block';
  }

  localStorage.setItem("userPoints", userPoints);
  options.style.display = 'none';
  
  // Kun automatisk fortsæt hvis det ikke er unsafe valg
  if (choice !== 'unsafe') {
    setTimeout(() => {
      goToNextScenario();
    }, 5000);
  }
}

function goToNextScenario() {
  window.location.href = "kodeord.html"; 
}
