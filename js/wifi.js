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

  if (choice === 'unsafe') {
    feedback.innerText = "❌ Offentligt WiFi uden VPN er risikabelt! Hackere kan opsnappe dine data.";
  } else if (choice === 'vpn') {
    feedback.innerText = "✅ Godt valg! VPN krypterer din trafik, selv på usikre netværk.";
    userPoints++;
  } else if (choice === 'mobile') {
    feedback.innerText = "✅ Super valg! Mobilnetværk er meget sikrere end offentligt WiFi.";
    userPoints++;
  }

  localStorage.setItem("userPoints", userPoints);


  options.style.display = 'none';

  
  setTimeout(() => {
    goToNextScenario();
  }, 5000);
}

function goToNextScenario() {
  window.location.href = "kodeord.html"; 
}
