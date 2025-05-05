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
  const smsMessage = document.querySelector('.sms-message');
  
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
    
    // Animér breach bar hvis den findes
    setTimeout(() => {
      const breachBar = databrudScreen.querySelector('.breach-bar');
      if (breachBar) {
        breachBar.style.width = '100%';
      }
    }, 500);
  } else {
    // Korrekt valg - vis "Se resultat" knappen
    if (choice === 'delete') {
      feedback.innerText = "✅ Godt valg! At slette beskeden beskytter dig mod svindel.";
      feedback.className = 'success';
      userPoints += 1; // 1 point for at slette
    } else if (choice === 'google') {
      feedback.innerText = "✅ Flot! At google afsenderen kan afsløre, om beskeden er ægte.";
      feedback.className = 'success';
      userPoints += 2; // 2 point for at google
    }
    
    // Vis "Se resultat" knappen
    resultBtn.style.display = 'inline-block';
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
