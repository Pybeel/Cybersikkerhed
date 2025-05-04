document.addEventListener("DOMContentLoaded", () => {
  setProgress(100); // brug 25, 50, 75, 100 afhængigt af scenarie
});

function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
  }
}


document.addEventListener('DOMContentLoaded', () => {
    const points = parseInt(localStorage.getItem('userPoints')) || 0;
    const resultText = document.getElementById('resultText');
    const explanation = document.getElementById('explanation');
  
    if (points <= 3) {
      resultText.innerText = "💥 Databrud!";
      explanation.innerText = "Du tog for mange usikre valg. Et databrud kunne være sket! Lær af dine fejl og vær ekstra opmærksom fremover.";
    } else if (points <= 6) {
      resultText.innerText = "⚠️ Risikovurderet!";
      explanation.innerText = "Du tog flere gode valg, men også nogle risikable. Vær opmærksom på detaljerne fremover.";
    } else {
      resultText.innerText = "🔒 Sikker bruger!";
      explanation.innerText = "Fantastisk arbejde! Du navigerede sikkert gennem alle scenarier og beskyttede dine data effektivt.";
    }
  
    // Ryd localStorage for en ny start
    localStorage.removeItem('userPoints');
  });
  
  function restart() {
    window.location.href = "index.html"; // Start forfra
  }
  