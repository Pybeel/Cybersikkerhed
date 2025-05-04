document.addEventListener("DOMContentLoaded", () => {
  setProgress(75); // brug 25, 50, 75, 100 afhængigt af scenarie
});

function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
  }
}


console.log("kodeord.js loaded!");
let userPoints = parseInt(localStorage.getItem("userPoints")) || 0;
let hasChecked = false;

function checkPassword() {
  if (hasChecked) return;
  hasChecked = true;

  const password = document.getElementById('passwordInput').value;
  const feedback = document.getElementById('feedback');
  let pointsThisScenario = 0; // Points earned in this scenario
  let result = "";

  // Check each requirement
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (isLongEnough) {
    result += "✅ Minimum 8 tegn opfyldt\n";
    pointsThisScenario++;
  }
  if (hasUppercase) {
    result += "✅ Mindst ét stort bogstav opfyldt\n";
    pointsThisScenario++;
  }
  if (hasLowercase) {
    result += "✅ Mindst ét lille bogstav opfyldt\n";
    pointsThisScenario++;
  }
  if (hasNumber) {
    result += "✅ Mindst ét tal opfyldt\n";
    pointsThisScenario++;
  }
  if (hasSpecialChar) {
    result += "✅ Mindst ét specialtegn opfyldt\n";
    pointsThisScenario++;
  }

  if (pointsThisScenario === 0) {
    result = "❌ Dit kodeord opfylder ingen af de vigtigste krav.";
  }

  feedback.innerText = result;

  // Add earned points
  userPoints += pointsThisScenario;
  localStorage.setItem("userPoints", userPoints);

  // Go to next scenario after 5 sec
  setTimeout(() => {
    goToNextScenario();
  }, 5000);
}

function goToNextScenario() {
  window.location.href = "sms.html"; // Go to scenario 4
}


