document.addEventListener("DOMContentLoaded", () => {
  setProgress(25); // brug 25, 50, 75, 100 afhængigt af scenarie
});

function setProgress(percent) {
  const bar = document.getElementById("progressBar");
  if (bar) {
    bar.style.width = percent + "%";
  }
}




