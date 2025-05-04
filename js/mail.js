document.addEventListener("DOMContentLoaded", () => {
    setProgress(25); // brug 25, 50, 75, 100 afhængigt af scenarie
  });
  
  function setProgress(percent) {
    const bar = document.getElementById("progressBar");
    if (bar) {
      bar.style.width = percent + "%";
    }
  }

function setProgress(percentage) {
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = percentage + "%";
  }
  
  
  let correctClicks = 0;
  let totalRequired = 3;
  let clickedElements = 0;
  let userPoints = parseInt(localStorage.getItem("userPoints")) || 0;
  let hasFeedbackShown = false;
  
  const suspiciousElements = document.querySelectorAll('.clickable');
  const clickFeedback = document.getElementById('clickFeedback');
  const overallFeedback = document.getElementById('overallFeedback');
  
  suspiciousElements.forEach(el => {
    el.addEventListener('click', () => {
      if (el.classList.contains('clicked')) return;
  
      const isIssue = el.dataset.issue === "true";
      const factText = el.dataset.fact || "";
  
      clickedElements++;
  
      if (isIssue) {
        el.classList.add('clicked');
        correctClicks++;
        clickFeedback.innerText = "✅ Rigtigt! " + factText;
      } else {
        clickFeedback.innerText = "❌ Dette var faktisk legitimt.";
        el.style.backgroundColor = '#d1ecf1';
      }
  
      el.classList.add('disabled'); // Deaktiver elementet efter klik
    });
  });
  
  // Når brugeren klikker på "Videre til næste scenarie"
  function prepareNextStep() {
    if (hasFeedbackShown) return; // Bloker dobbeltklik
    hasFeedbackShown = true;
  
    if (correctClicks === 0) {
      overallFeedback.innerText = "❌ Vær forsigtig! Du overså alle faresignaler.";
    } else if (correctClicks >= 1 && correctClicks < 3) {
      overallFeedback.innerText = "⚠️ Godt forsøgt! Du fandt nogle faresignaler, men overså nogle.";
    } else if (correctClicks === 3) {
      overallFeedback.innerText = "✅ Fantastisk! Du spottede alle faresignaler i mailen.";
      userPoints++;
    }
  
    localStorage.setItem("userPoints", userPoints);
  
    // Vent 5 sekunder før vi går videre
    setTimeout(() => {
      goToNextScenario();
    }, 5000);
  }
  
  function goToNextScenario() {
    window.location.href = "wifi.html"; // næste scenarie
  }