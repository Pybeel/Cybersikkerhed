document.addEventListener('DOMContentLoaded', () => {
  // Hent brugerens point og scenariedata fra localStorage
  const points = parseInt(localStorage.getItem('userPoints')) || 0;
  const maxPoints = 12; // maksimalt antal opnåelige point (4 scenarier med hver 3 point)
  const percentScore = Math.round((points / maxPoints) * 100);
  
  // Hent scenariedata, hvis det er tilgængeligt, ellers brug default værdier
  let scenarieData = [];
  try {
    const savedData = localStorage.getItem('scenarieData');
    if (savedData) {
      scenarieData = JSON.parse(savedData);
    } else {
      // Standard scenariedata hvis intet er gemt
      scenarieData = [
        { 
          navn: 'Kodeord', 
          score: 2, 
          maxScore: 3, 
          tip: 'Brug komplekse kodeord med tal, specialtegn og varierende tegn.',
          color: '#3498db', // Blå
          mangler: ['Brug af forskellige kodeord til forskellige konti']
        },
        { 
          navn: 'Mail', 
          score: 1, 
          maxScore: 3, 
          tip: 'Tjek altid afsenderens e-mailadresse og vær kritisk over for links.',
          color: '#9b59b6', // Lilla
          mangler: ['Verificering af afsenders legitimitet', 'Kontrol af URL før du klikker']
        },
        { 
          navn: 'Wifi', 
          score: 2, 
          maxScore: 3, 
          tip: 'Brug kun sikre wifi-netværk med kryptering eller VPN på offentlige netværk.',
          color: '#2ecc71', // Grøn
          mangler: ['Verificering af netværket før tilslutning']
        },
        { 
          navn: 'SMS', 
          score: 2, 
          maxScore: 3, 
          tip: 'Del aldrig følsomme informationer i SMS-beskeder uden at bekræfte afsenderens identitet.',
          color: '#e67e22', // Orange
          mangler: ['Verificering af afsenderens telefonnummer før du svarer']
        }
      ];
    }
  } catch (e) {
    console.error('Fejl ved indlæsning af scenariedata:', e);
    // Fallback data
    scenarieData = [
      { 
        navn: 'Kodeord', 
        score: Math.floor(points/4), 
        maxScore: 3, 
        tip: 'Brug komplekse kodeord med tal, specialtegn og varierende tegn.',
        color: '#3498db',
        mangler: ['Brug af forskellige kodeord til forskellige konti']
      },
      { 
        navn: 'Mail', 
        score: Math.floor(points/4), 
        maxScore: 3, 
        tip: 'Tjek altid afsenderens e-mailadresse og vær kritisk over for links.',
        color: '#9b59b6',
        mangler: ['Verificering af afsenders legitimitet', 'Kontrol af URL før du klikker']
      },
      { 
        navn: 'Wifi', 
        score: Math.floor(points/4), 
        maxScore: 3, 
        tip: 'Brug kun sikre wifi-netværk med kryptering eller VPN på offentlige netværk.',
        color: '#2ecc71',
        mangler: ['Verificering af netværket før tilslutning']
      },
      { 
        navn: 'SMS', 
        score: Math.floor(points/4), 
        maxScore: 3, 
        tip: 'Del aldrig følsomme informationer i SMS-beskeder uden at bekræfte afsenderens identitet.',
        color: '#e67e22',
        mangler: ['Verificering af afsenderens telefonnummer før du svarer']
      }
    ];
  }

  // Beregn samlede resultater
  const totalScore = scenarieData.reduce((acc, scene) => acc + scene.score, 0);
  const totalMaxScore = scenarieData.reduce((acc, scene) => acc + scene.maxScore, 0);
  const totalPercent = Math.round((totalScore / totalMaxScore) * 100);
  
  // Vis den samlede resultatoversigt
  visualiserResultater(scenarieData, totalScore, totalMaxScore, totalPercent);

  // Elementer til opdatering
  const resultText = document.getElementById('resultText');
  const explanation = document.getElementById('explanation');
  const resultIcon = document.getElementById('resultIcon');
  const resultTitle = document.getElementById('resultTitle');
  const securityLevel = document.getElementById('securityLevel');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  
  // Sæt styling baseret på score
  if (totalPercent <= 33) {
    // Databrud resultat
    resultTitle.innerText = "DATABRUD!";
    resultTitle.style.color = "#e74c3c";
    resultText.innerText = "Din score viser kritisk risikoniveau.";
    explanation.innerText = "Du tog for mange usikre valg. Et databrud kunne være sket! Lær af dine fejl og vær ekstra opmærksom fremover.";
    securityLevel.innerText = "Kritisk lav";
    resultIcon.classList.remove('fa-exclamation-triangle');
    resultIcon.classList.add('fa-skull-crossbones');
    setProgress(totalPercent);
    animateDataBreach();
  } else if (totalPercent <= 66) {
    // Risikofuldt resultat
    resultTitle.innerText = "RISIKOVURDERET";
    resultTitle.style.color = "#f39c12";
    resultText.innerText = "Din score viser moderat risikoniveau.";
    explanation.innerText = "Du tog flere gode valg, men også nogle risikable. Vær opmærksom på detaljerne fremover for at øge din sikkerhed.";
    securityLevel.innerText = "Moderat";
    resultIcon.classList.remove('fa-exclamation-triangle');
    resultIcon.classList.add('fa-exclamation-circle');
    resultIcon.style.color = "#f39c12";
    setProgress(totalPercent);
  } else {
    // Sikker resultat
    resultTitle.innerText = "SIKKER BRUGER";
    resultTitle.style.color = "#2ecc71";
    resultText.innerText = "Din score viser højt sikkerhedsniveau.";
    explanation.innerText = "Fantastisk arbejde! Du navigerede sikkert gennem alle scenarier og beskyttede dine data effektivt.";
    securityLevel.innerText = "Høj";
    resultIcon.classList.remove('fa-exclamation-triangle');
    resultIcon.classList.add('fa-shield-alt');
    resultIcon.style.color = "#2ecc71";
    setProgress(totalPercent);
  }
  
  // Opret og vis scenarieoversigt
  visScenarieoversigt(scenarieData);
  
  // Generer personlige tips baseret på brugerens score i de forskellige scenarier
  genererPersonligeTips(scenarieData);
  
  // Ryd localStorage for en ny start (kommenteret ud for demo formål - fjern kommentering i produktion)
  // localStorage.removeItem('userPoints');
  // localStorage.removeItem('scenarieData');
});

// Sæt progressbar baseret på score
function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    setTimeout(() => {
      bar.style.width = percent + "%";
    }, 500); // Kort forsinkelse for animation
    
    // Vælg farve baseret på procent
    if (percent <= 33) {
      bar.style.background = "linear-gradient(90deg, #e74c3c, #c0392b)";
    } else if (percent <= 66) {
      bar.style.background = "linear-gradient(90deg, #f39c12, #d35400)";
    } else {
      bar.style.background = "linear-gradient(90deg, #2ecc71, #27ae60)";
    }
  }
}

// Animér databrud effekten
function animateDataBreach() {
  const screen = document.getElementById("databrud-screen");
  screen.classList.add("breach-animation");
  
  // Skab pulserende rød effekt
  let opacity = 0.2;
  let increasing = true;
  const pulseInterval = setInterval(() => {
    if (increasing) {
      opacity += 0.05;
      if (opacity >= 0.4) increasing = false;
    } else {
      opacity -= 0.05;
      if (opacity <= 0.1) increasing = true;
    }
    screen.style.boxShadow = `0 0 30px rgba(231, 76, 60, ${opacity}), 0 0 100px rgba(231, 76, 60, ${opacity/2})`;
  }, 50);
  
  // Stop pulsering efter 10 sekunder
  setTimeout(() => {
    clearInterval(pulseInterval);
  }, 10000);
}

function restart() {
  window.location.href = "index.html"; // Start forfra
}

// Vis scenarie oversigt med brugerens performance
function visScenarieoversigt(scenarieData) {
  const scenariosContainer = document.getElementById('scenariosContainer');
  if (!scenariosContainer) return;
  
  // Ryd container
  scenariosContainer.innerHTML = '';
  
  // Tilføj scenarie kort for hvert scenarie
  scenarieData.forEach(scenarie => {
    // Beregn procent score for dette scenarie
    const scenariePercent = Math.round((scenarie.score / scenarie.maxScore) * 100);
    
    // Bestem farve baseret på score
    let statusClass, statusIcon;
    if (scenariePercent <= 33) {
      statusClass = 'status-danger';
      statusIcon = 'fa-times-circle';
    } else if (scenariePercent <= 66) {
      statusClass = 'status-warning';
      statusIcon = 'fa-exclamation-circle';
    } else {
      statusClass = 'status-success';
      statusIcon = 'fa-check-circle';
    }
    
    // Opret scenarie kort
    const scenarieCard = document.createElement('div');
    scenarieCard.className = `scenarie-card ${statusClass}`;
    
    scenarieCard.innerHTML = `
      <div class="scenarie-header">
        <i class="fas ${statusIcon}"></i>
        <h4>${scenarie.navn}</h4>
      </div>
      <div class="scenarie-content">
        <div class="score-bar-container">
          <div class="score-bar" style="width: ${scenariePercent}%"></div>
        </div>
        <div class="score-text">${scenarie.score} af ${scenarie.maxScore} point</div>
      </div>
    `;
    
    scenariosContainer.appendChild(scenarieCard);
  });
}

// Generer personlige sikkerhedstips baseret på brugerens resultater
function genererPersonligeTips(scenarieData) {
  const tipsContainer = document.getElementById('tipsContainer');
  if (!tipsContainer) return;
  
  // Ryd container
  tipsContainer.innerHTML = '';
  
  // Generelle sikkerhedstips
  const generelleTips = [
    { kategori: 'Kodeord', tip: 'Brug en password manager til at generere og gemme unikke kodeord.', icon: 'fa-key' },
    { kategori: 'Mail', tip: 'Klik aldrig på links i e-mails fra ukendte afsendere.', icon: 'fa-envelope-open-text' },
    { kategori: 'Wifi', tip: 'Brug VPN når du bruger offentlige wifi-netværk.', icon: 'fa-wifi' },
    { kategori: 'SMS', tip: 'Del aldrig personlige oplysninger via SMS uden at validere afsenderens identitet.', icon: 'fa-sms' },
    { kategori: 'Opdateringer', tip: 'Hold altid dine enheder og software opdateret med de seneste sikkerhedsopdateringer.', icon: 'fa-sync-alt' },
    { kategori: 'Social Media', tip: 'Vær opmærksom på hvilke oplysninger du deler på sociale medier.', icon: 'fa-users' },
    { kategori: 'Backup', tip: 'Lav jævnlige backups af dine vigtige data.', icon: 'fa-cloud-upload-alt' }
  ];
  
  // Find scenarier hvor brugeren klarede sig dårligt (score <= 50%)
  const lavScoreScenarier = scenarieData.filter(scenarie => {
    return (scenarie.score / scenarie.maxScore) <= 0.5;
  });
  
  // Kombiner personlige tips baseret på dårlige scenarier med generelle tips
  const alleTips = [];
  
  // Tilføj personlige tips baseret på scenariedata
  lavScoreScenarier.forEach(scenarie => {
    alleTips.push({
      kategori: scenarie.navn,
      tip: scenarie.tip,
      icon: scenarie.navn === 'Kodeord' ? 'fa-key' : 
            scenarie.navn === 'Mail' ? 'fa-envelope-open-text' : 
            scenarie.navn === 'Wifi' ? 'fa-wifi' : 
            scenarie.navn === 'SMS' ? 'fa-sms' : 'fa-shield-alt',
      personlig: true
    });
  });
  
  // Tilføj generelle tips (men undgå dubletter fra personlige tips)
  generelleTips.forEach(gtip => {
    // Tjek om vi allerede har et personligt tip fra denne kategori
    const harAlleredeTip = alleTips.some(tip => tip.kategori === gtip.kategori);
    
    // Hvis vi ikke allerede har et personligt tip fra denne kategori, tilføj det generelle tip
    if (!harAlleredeTip) {
      // Tilføj kun hvis vi har mindre end 5 tips i alt (prioriter personlige tips)
      if (alleTips.length < 5) {
        alleTips.push({
          ...gtip,
          personlig: false
        });
      }
    }
  });
  
  // Opret tip elementer
  alleTips.forEach(tip => {
    const tipItem = document.createElement('div');
    tipItem.className = `tip-item ${tip.personlig ? 'personlig-tip' : ''}`;
    
    tipItem.innerHTML = `
      <div class="tip-icon">
        <i class="fas ${tip.icon}"></i>
      </div>
      <div class="tip-content">
        <h4>${tip.kategori}</h4>
        <p>${tip.tip}</p>
      </div>
    `;
    
    tipsContainer.appendChild(tipItem);
  });
  
  // Hvis der ikke er nogen tips, vis en besked
  if (alleTips.length === 0) {
    tipsContainer.innerHTML = `
      <div class="no-tips">
        <i class="fas fa-thumbs-up"></i>
        <p>Godt klaret! Du har klaret alle scenarier godt.</p>
      </div>
    `;
  }
}

// Visualiser samlet resultatoversigt med cirkeldiagram og forbedringsområder
function visualiserResultater(scenarieData, totalScore, totalMaxScore, totalPercent) {
  // Elementer til opdatering
  const resultsChart = document.getElementById('resultsChart');
  const chartLegend = document.getElementById('chartLegend');
  const totalScoreDisplay = document.getElementById('totalScoreDisplay');
  const improvementAreas = document.getElementById('improvementAreas');
  
  if (!resultsChart || !chartLegend || !totalScoreDisplay || !improvementAreas) return;
  
  // 1. Opret cirkeldiagram
  // Beregn vinkler for cirkeldiagram baseret på scores (i forhold til max points)
  let startAngle = 0;
  let html = '';
  
  // Opret selve cirkeldiagrammet med CSS conic-gradient
  let conicGradient = 'conic-gradient(';
  let legendHTML = '';
  
  // Sortér scenariedata efter score (højeste først) for visuel konsistens
  const sortedData = [...scenarieData].sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore));
  
  sortedData.forEach((scenarie, index) => {
    const scorePercent = (scenarie.score / scenarie.maxScore) * 100;
    const endAngle = startAngle + (scenarie.maxScore / totalMaxScore) * 360;
    const color = scenarie.color || `hsl(${index * 90}, 70%, 50%)`;
    
    // Tilføj til conic-gradient
    if (index > 0) conicGradient += ', ';
    conicGradient += `${color} ${startAngle}deg ${endAngle}deg`;
    
    // Tilføj til legend
    legendHTML += `
      <div class="legend-item">
        <div class="color-box" style="background-color: ${color}"></div>
        <div class="legend-text">${scenarie.navn}: ${scenarie.score}/${scenarie.maxScore} (${Math.round(scorePercent)}%)</div>
      </div>
    `;
    
    startAngle = endAngle;
  });
  
  conicGradient += ')';
  
  // Sæt cirkeldiagram
  resultsChart.style.background = conicGradient;
  resultsChart.innerHTML = `
    <div class="chart-center">
      <span>${totalPercent}%</span>
    </div>
  `;
  
  // Tilføj styling til chart center
  const chartCenter = resultsChart.querySelector('.chart-center');
  if (chartCenter) {
    chartCenter.style.position = 'absolute';
    chartCenter.style.top = '50%';
    chartCenter.style.left = '50%';
    chartCenter.style.transform = 'translate(-50%, -50%)';
    chartCenter.style.width = '120px';
    chartCenter.style.height = '120px';
    chartCenter.style.backgroundColor = 'rgba(25, 27, 31, 0.9)';
    chartCenter.style.borderRadius = '50%';
    chartCenter.style.display = 'flex';
    chartCenter.style.justifyContent = 'center';
    chartCenter.style.alignItems = 'center';
    chartCenter.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
    chartCenter.style.zIndex = '2';
    chartCenter.style.border = '2px solid rgba(255, 255, 255, 0.1)';
    
    const centerSpan = chartCenter.querySelector('span');
    if (centerSpan) {
      centerSpan.style.fontSize = '2.2rem';
      centerSpan.style.fontWeight = '700';
      
      // Få farve baseret på score
      if (totalPercent >= 67) {
        centerSpan.style.color = '#2ecc71'; // Grøn for høj score
      } else if (totalPercent >= 34) {
        centerSpan.style.color = '#f39c12'; // Gul for middel score
      } else {
        centerSpan.style.color = '#e74c3c'; // Rød for lav score
      }
    }
  }
  
  // Sæt legend
  chartLegend.innerHTML = legendHTML;
  
  // 2. Vis samlet score
  let scoreClass = 'score-medium';
  if (totalPercent >= 67) {
    scoreClass = 'score-high';
  } else if (totalPercent <= 33) {
    scoreClass = 'score-low';
  }
  
  // Definer bedømmelsestekst baseret på score
  let scoreBedoemmelse = 'Moderat';
  if (totalPercent >= 80) {
    scoreBedoemmelse = 'Fremragende';
  } else if (totalPercent >= 67) {
    scoreBedoemmelse = 'God';
  } else if (totalPercent <= 33) {
    scoreBedoemmelse = 'Kritisk';
  }
  
  totalScoreDisplay.innerHTML = `
    <div class="score-title">Samlet Sikkerhedsniveau</div>
    <div class="score-value ${scoreClass}">${totalPercent}%</div>
    <div class="score-label">${scoreBedoemmelse} (${totalScore} af ${totalMaxScore} mulige point)</div>
  `;
  
  // 3. Vis forbedringsområder
  // Saml alle manglende sikkerhedsforanstaltninger
  let manglendeItems = [];
  
  scenarieData.forEach(scenarie => {
    if (scenarie.score < scenarie.maxScore && scenarie.mangler && scenarie.mangler.length > 0) {
      // Tilføj hver mangel med reference til scenariet
      scenarie.mangler.forEach(mangel => {
        manglendeItems.push({
          scenarie: scenarie.navn,
          mangel: mangel
        });
      });
    }
  });
  
  // Vis forbedringsområder
  if (manglendeItems.length > 0) {
    let missingHTML = `<div class="improvement-title">Forbedringsmuligheder</div>`;
    
    manglendeItems.forEach(item => {
      missingHTML += `
        <div class="missing-item">
          <div class="missing-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="missing-content">
            <h4>${item.scenarie}</h4>
            <p>${item.mangel}</p>
          </div>
        </div>
      `;
    });
    
    improvementAreas.innerHTML = missingHTML;
  } else {
    improvementAreas.innerHTML = `
      <div class="improvement-title">Ingen forbedringsområder</div>
      <div class="no-missing">
        <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 1rem;"></i>
        <p>Godt klaret! Du har taget alle nødvendige sikkerhedsforanstaltninger.</p>
      </div>
    `;
  }
}