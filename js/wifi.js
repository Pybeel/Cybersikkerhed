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
    // Skab et databrud element
    const databrudDiv = document.createElement('div');
    databrudDiv.className = 'databrud-alert';
    databrudDiv.innerHTML = `
      <h2>DATABRUD!</h2>
      <p>Du har valgt at bruge et gratis offentligt WiFi uden beskyttelse.</p>
      <p>En hacker på samme netværk har opsnappet dine data og fået adgang til:</p>
      <ul>
        <li>Dine login oplysninger</li>
        <li>Personlige informationer</li>
        <li>Potentielt bankoplysninger</li>
      </ul>
      <h3>Hvad kunne du have gjort bedre?</h3>
      <p>De sikrere valg ville have været:</p>
      <ul>
        <li><strong>Bruge en VPN</strong> - En VPN (Virtual Private Network) krypterer din internettrafik, selv på usikre netværk, så hackere ikke kan læse dine data.</li>
        <li><strong>Bruge dit mobilnetværk</strong> - Mobilnetværk er generelt meget sikrere end offentlige WiFi-netværk, da de er sværere at aflytte.</li>
      </ul>
      <p>Test afsluttet. Du kan prøve igen for at vælge en sikrere løsning.</p>
    `;
    
    // Tilføj databrud elementet til main
    const main = document.querySelector('main');
    main.appendChild(databrudDiv);
    
    // Fjern feedback teksten og gem options
    feedback.style.display = 'none';
    options.style.display = 'none';
    
    // Vis en knap til at prøve igen
    const retryBtn = document.createElement('button');
    retryBtn.innerText = 'Prøv igen';
    retryBtn.className = 'retry-button';
    retryBtn.onclick = function() {
      window.location.reload();
    };
    main.appendChild(retryBtn);
    
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
