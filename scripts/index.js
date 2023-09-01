//
// ------------------------------------------------
// When Document Object Model (DOM) loaded
// ------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  //
  // Link UI elements and add event listener
  let startBtn = document.getElementById("start");
  startBtn.addEventListener("click", () => {
    window.location.replace("main.html");
  })
});
