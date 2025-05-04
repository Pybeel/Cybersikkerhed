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
  options.style.display = 'none';

  if (choice === 'click') {
    feedback.innerText = "❌ Forkert! Linket var en phishing-side, og dine oplysninger kunne blive stjålet.";
  } else if (choice === 'delete') {
    feedback.innerText = "✅ Godt valg! At slette beskeden beskytter dig mod svindel.";
    userPoints++;
  } else if (choice === 'google') {
    feedback.innerText = "✅ Flot! At google afsenderen kan afsløre, om beskeden er ægte.";
    userPoints++;
  }

  localStorage.setItem("userPoints", userPoints);

  setTimeout(() => {
    goToResult();
  }, 5000);
}

function goToResult() {
  window.location.href = "resultat.html"; 
}
