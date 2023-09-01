// ------------------------------
// Global Variables
// ------------------------------

// Sides
const noValue = -1;
const home = 0;
const tie = 1;
const away = 2;

// Winning scores for each shot
const scoreForShot = [10, 5, 3];

// Data
let runningHomeScore = 0;
let runningAwayScore = 0;

let currentEndResult = {
  end: 1,
  homeScore: 0,
  awayScore: 0,
  noOfHomeTouchers: 0,
  noOfAwayTouchers: 0,
  winningSides: [noValue, noValue, noValue],
};

let endResults = [];

// Screen Variables
let mainTop = document
  .getElementsByClassName("score-wrap")[0]
  .getBoundingClientRect().top;
document.documentElement.style.setProperty("--content-top", `${mainTop}px`);

//
// -----------------------------------------------------
// Link UI Elements and add event listeners
// -----------------------------------------------------

// -- Scores --
let homeScoreLabel = document.querySelector("#home-score");
let awayScoreLabel = document.querySelector("#away-score");

// -- Score Card Button --
let scoreCardBtn = document.getElementById("score-card-btn__wrap");
scoreCardBtn.addEventListener("click", goScoreCardPage);

// -- End --
let endLabel = document.getElementById("end__count");

// -- Toucher Buttons --
// Home Touchers
let homeToucherBtn = document.querySelectorAll(".toucher.home");
for (let i = 0; i < homeToucherBtn.length; i++) {
  homeToucherBtn[i].addEventListener("click", toggleToucher);
  if (i > 0) {
    homeToucherBtn[i].style.visibility = "hidden";
    homeToucherBtn[i].style.opacity = "0";
  }
}

// Away Touchers
let awayToucherBtn = document.querySelectorAll(".toucher.away");
for (let i = 0; i < awayToucherBtn.length; i++) {
  awayToucherBtn[i].addEventListener("click", toggleToucher);
  if (i > 0) {
    awayToucherBtn[i].style.visibility = "hidden";
    awayToucherBtn[i].style.opacity = "0";
  }
}

// -- Shot Labels --
let shotLabels = document.getElementsByClassName("shot-label");

// -- Side Buttons --
let sideBtns = document.querySelectorAll(".side-btn");
for (let i = 0; i < sideBtns.length; i++) {
  sideBtns[i].addEventListener("click", toggleSide);
}

// -- Navigation Buttons on Main Page --
let nextBtn = document.querySelector("#next-end");
// nextBtn.addEventListener("click", showResult);
nextBtn.addEventListener("click", inputCheck); // working

// -- Modal Sheet --
let modalSheet = document.getElementById("modal");

// -- Navigation Buttons on Modal Sheet --
// Confirm End Button
let confirmEndBtn = document.getElementById("confirm-end");
confirmEndBtn.addEventListener("click", confirmEnd);

// Back Button
let closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", closeModalSheet);

//
// ------------------------------------------------
// When Document Object Model (DOM) loaded
// ------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document fully loaded and parsed");

  //
  // ----------------------------------------------
  // Check Local Storage for saved state
  // ----------------------------------------------
  //
  // Check whether there is previous end scores
  if (localStorage) {
    // Retrieve end results
    let endResultsJSON = localStorage.getItem("endResults");
    if (endResultsJSON) {
      endResults = JSON.parse(endResultsJSON);
    }
  } else {
    // Local Storage is not supported
    console.log("Local Storage is not supported");
  }

  if (sessionStorage) {
    // Retrieve result of current end
    let currentEndJSON = sessionStorage.getItem("currentEndResult");
    if (currentEndJSON) {
      currentEndResult = JSON.parse(currentEndJSON);
    } else {
      // if there is previous end results
      if (endResults.length > 0) {
        // Update end count
        currentEndResult.end = endResults.length + 1;
      }
    }

    // Update Running Scores
    console.table(endResults);
    runningHomeScore = endResults.reduce(
      (sum, item) => (sum += item.homeScore),
      0
    );
    runningAwayScore = endResults.reduce(
      (sum, item) => (sum += item.awayScore),
      0
    );

    // Restore button States
    updateScreen();
    restoreBtnState();
  } else {
    // Session Storage is not supported
    console.log("Session Storage is not supported");
  }

  // Debug purpose
  const width = window.innerWidth;
  const height = window.innerHeight;
  document.getElementById(
    "info"
  ).innerHTML += `width: ${width}, height: ${height}`;
});

//
// ----------------------------------------------------------------------
// Funtion: goScoreCardPage
// Description: Go to Score Card Page
// ----------------------------------------------------------------------
function goScoreCardPage() {
  // Change URL via window object
  window.open("scorecard.html", "ScoreCardWindow");
}

//
// ---------------------------------------
// funtion toggle state of toucher button
// ---------------------------------------
function toggleToucher() {
  // Check button pressed
  const btnPressed = this;
  let btnSide = noValue;
  if (btnPressed.classList.contains("home")) {
    btnSide = home;
  } else if (btnPressed.classList.contains("away")) {
    btnSide = away;
  } else {
    console.log("Toucher button not belong to any side");
  }

  // Locate the button in Corresponding array
  let btnIndex = -1;
  switch (btnSide) {
    case home:
      btnIndex = Array.prototype.indexOf.call(homeToucherBtn, btnPressed);
      btn = homeToucherBtn;
      break;
    case away:
      btnIndex = Array.prototype.indexOf.call(awayToucherBtn, btnPressed);
      btn = awayToucherBtn;
  }

  if (btnIndex < 0) {
    console.log("Button not found");
    return;
  }

  // Check if button is 'ON' before user click
  if (btnPressed.classList.contains("pressed")) {
    // Deduct 3 points from corresponding score
    switch (btnSide) {
      case home:
        currentEndResult.homeScore = currentEndResult.homeScore - 3;
        currentEndResult.noOfHomeTouchers =
          currentEndResult.noOfHomeTouchers - 1;
        break;
      case away:
        currentEndResult.awayScore = currentEndResult.awayScore - 3;
        currentEndResult.noOfAwayTouchers =
          currentEndResult.noOfAwayTouchers - 1;
    }

    // Hide the next button, if there is one
    if (btnIndex < btn.length - 1) {
      btn[btnIndex + 1].style.visibility = "hidden";
      btn[btnIndex + 1].style.opacity = "0";
    }

    // Button is 'OFF' before user click
  } else {
    // Add 3 points to corresponding side
    switch (btnSide) {
      case home:
        currentEndResult.homeScore = currentEndResult.homeScore + 3;
        currentEndResult.noOfHomeTouchers =
          currentEndResult.noOfHomeTouchers + 1;
        break;
      case away:
        currentEndResult.awayScore = currentEndResult.awayScore + 3;
        currentEndResult.noOfAwayTouchers =
          currentEndResult.noOfAwayTouchers + 1;
    }

    // Show the next button except for the last one
    if (btnIndex < btn.length - 1) {
      btn[btnIndex + 1].style.visibility = "visible";
      btn[btnIndex + 1].style.opacity = "1";
    }
  }

  // toggle class 'pressed'
  btnPressed.classList.toggle("pressed");

  // Disable/Re-enable the next button, if there is one
  if (btnIndex < btn.length - 1) {
    btn[btnIndex + 1].classList.toggle("disabled");
  }

  // Disable/Re-enable the previous button, if there is one
  if (btnIndex > 0) {
    btn[btnIndex - 1].classList.toggle("disabled");
  }

  // Update scores
  saveCurrentEnd();
  updateScreen();
}

//
// -------------------------------------------------------------------------
// Funtion: toggleSide
// Description: Toggle state of side buttons and update scores accordingly
// -------------------------------------------------------------------------
function toggleSide() {
  // Locate the pressed side button in side buttons array
  let sideBtnPressed = this;
  let sideBtnIndex = Array.prototype.indexOf.call(sideBtns, sideBtnPressed);

  // Figure out which row and which side button(home, tie, away) is pressed
  const rowPressed = Math.floor(sideBtnIndex / 3);
  const sideIndex = sideBtnIndex % 3;
  let points = parseInt(sideBtnPressed.parentElement.dataset.points, 10);

  // If Side Button not found in array, Log error to console
  if (sideBtnIndex < 0) {
    console.log("Side Button not found");
    return;
  }

  // Check if all side buttons is not preseed before this button is pressed
  if (currentEndResult.winningSides[rowPressed] === noValue) {
    // toggle this button state and update score
    sideBtnPressed.classList.toggle("side-btn_pressed");
    switch (sideIndex) {
      case 0:
        currentEndResult.homeScore = currentEndResult.homeScore + points;
        break;
      case 1:
        currentEndResult.homeScore = currentEndResult.homeScore + points / 2;
        currentEndResult.awayScore = currentEndResult.awayScore + points / 2;
        break;
      case 2:
        currentEndResult.awayScore = currentEndResult.awayScore + points;
    }

    // update winningSides flag
    currentEndResult.winningSides[rowPressed] = sideIndex;

    // Else, one of the side buttons is already pressed
  } else {
    // If this button is in 'pressed' state before it is pressed
    if (currentEndResult.winningSides[rowPressed] == sideIndex) {
      // toggle this button state
      sideBtnPressed.classList.toggle("side-btn_pressed");

      // Update Score
      switch (sideIndex) {
        case 0:
          currentEndResult.homeScore = currentEndResult.homeScore - points;
          break;
        case 1:
          currentEndResult.homeScore = currentEndResult.homeScore - points / 2;
          currentEndResult.awayScore = currentEndResult.awayScore - points / 2;
          break;
        case 2:
          currentEndResult.awayScore = currentEndResult.awayScore - points;
      }

      // update winningSides flag
      currentEndResult.winningSides[rowPressed] = -1;

      // Else (Another side button is already pressed)
    } else {
      // toggle the 'pressed' button state
      const pressedBtnIndex =
        3 * rowPressed + currentEndResult.winningSides[rowPressed];
      sideBtns[pressedBtnIndex].classList.toggle("side-btn_pressed");

      // toggle this button state
      sideBtnPressed.classList.toggle("side-btn_pressed");

      // Reset scores for the old winning side
      switch (currentEndResult.winningSides[rowPressed]) {
        case 0:
          currentEndResult.homeScore = currentEndResult.homeScore - points;
          break;
        case 1:
          currentEndResult.homeScore = currentEndResult.homeScore - points / 2;
          currentEndResult.awayScore = currentEndResult.awayScore - points / 2;
          break;
        case 2:
          currentEndResult.awayScore = currentEndResult.awayScore - points;
      }

      // Update scores for the new winning side
      switch (sideIndex) {
        case 0:
          currentEndResult.homeScore = currentEndResult.homeScore + points;
          break;
        case 1:
          currentEndResult.awayScore = currentEndResult.awayScore + points / 2;
          currentEndResult.homeScore = currentEndResult.homeScore + points / 2;
          break;
        case 2:
          currentEndResult.awayScore = currentEndResult.awayScore + points;
      }

      // update winningSides flag
      currentEndResult.winningSides[rowPressed] = sideIndex;
    }
  }

  // Update State
  saveCurrentEnd();
  updateScreen();
}

//
// ---------------------------------------------------------------
// Function: saveCurrentEnd
// Description: Update current scores and state to local storage
// ---------------------------------------------------------------
function saveCurrentEnd() {
  // Update Storage
  if (sessionStorage) {
    sessionStorage.setItem(
      "currentEndResult",
      JSON.stringify(currentEndResult)
    );
  } else {
    console.log("Browser does not support local storage");
  }
}

//
// ----------------------------------------------------------
// Funtion: updateScreen
// Description: Update scores on screen
// ----------------------------------------------------------
function updateScreen() {
  // Update Scores
  homeScoreLabel.innerHTML = (
    runningHomeScore + currentEndResult.homeScore
  ).toString();
  awayScoreLabel.innerHTML = (
    runningAwayScore + currentEndResult.awayScore
  ).toString();
}

//
// ----------------------------------------------------------
// Funtion: restoreBtnState
// Description: Restore all button state on screen
// ----------------------------------------------------------
function restoreBtnState() {
  // Update end count
  endLabel.innerHTML = currentEndResult.end.toString();

  // Update Home Touchers Buttons state
  for (let i = 0; i < currentEndResult.noOfHomeTouchers; i++) {
    // Change the current button to 'pressed' state
    homeToucherBtn[i].classList.add("pressed");

    // Show the next button except for the last one
    if (i < 5) {
      homeToucherBtn[i + 1].style.visibility = "visible";
      homeToucherBtn[i + 1].style.opacity = "1";
      homeToucherBtn[i + 1].classList.remove("disabled");
    }

    // Diable the previous button
    if (i > 0) {
      homeToucherBtn[i - 1].classList.add("disabled");
    }
  }

  // Update Away Touchers Buttons state
  for (let i = 0; i < currentEndResult.noOfAwayTouchers; i++) {
    // Change the current button to 'pressed' state
    awayToucherBtn[i].classList.add("pressed");

    // Show the next button except for the last one
    if (i < 5) {
      awayToucherBtn[i + 1].style.visibility = "visible";
      awayToucherBtn[i + 1].style.opacity = "1";
      awayToucherBtn[i + 1].classList.remove("disabled");
    }

    // Diable the previous button
    if (i > 0) {
      awayToucherBtn[i - 1].classList.add("disabled");
    }
  }

  // Update state of Winning Sides buttons
  for (let i = 0; i < 3; i++) {
    if (currentEndResult.winningSides[i] !== noValue) {
      sideBtns[3 * i + currentEndResult.winningSides[i]].classList.add(
        "side-btn_pressed"
      );
    }
  }
}

//
// ------------------------------------------------------------
// Funtion: inputCheck
// Description: Check whether all input is valid
//              1. All shot are record the winning side,
//                 either home, tie or away button is pressed
//              2. When one of the tie button is pressed,
//                 there are only 3 scenarios:
//                 1st shot and 2nd shot tie;
//                 2nd shot and 3rd shot tie;
//                 1st shot 2nd shot and 3rd shot all tie;
// ------------------------------------------------------------
function inputCheck() {
  // If there is any no value in winning sides array, that means one of
  // winning shot is not selected yet
  if (currentEndResult.winningSides.includes(-1)) {
    // Check which one is not selected and show warning sign
    for (let i = 0; i < currentEndResult.winningSides.length; i++) {
      if (currentEndResult.winningSides[i] === -1) {
        shotLabels[i].classList.add("warning");
      } else {
        shotLabels[i].classList.remove("warning");
      }
    }

    // Break the checking
    return;
  } else {
    // All winning shots are selected
    Array.from(shotLabels).forEach((label) => {
      label.classList.remove("warning");
    });
  }

  // If 1st shot is tie, then 2nd shot must be tie too
  if (
    currentEndResult.winningSides[0] === tie &&
    currentEndResult.winningSides[1] !== tie
  ) {
    shotLabels[0].classList.add("warning");
    shotLabels[1].classList.add("warning");
    return;
  }

  // If 2nd shot is tie and 1st shot is not tie, then 3rd shot must be tie too
  if (
    currentEndResult.winningSides[0] !== tie &&
    currentEndResult.winningSides[1] === tie &&
    currentEndResult.winningSides[2] !== tie
  ) {
    shotLabels[1].classList.add("warning");
    return;
  }

  // Input is valid, show result
  showResult();
}

//
// ----------------------------------------------------------
// Funtion: showResult
// Description: Show result summary on modal sheet
// ----------------------------------------------------------
function showResult() {
  let homeScoreTotal = 0;
  let awayScoreTotal = 0;

  // Update Result sheet header
  let modalHeader = document.getElementById("modal__header");
  modalHeader.textContent = `End ${currentEndResult.end} Result`;

  // Update Home Toucher Score
  let totalHomeTouchers = document.getElementById("touchers__home");
  totalHomeTouchers.innerHTML = (
    currentEndResult.noOfHomeTouchers * 3
  ).toString();
  homeScoreTotal = currentEndResult.noOfHomeTouchers * 3;

  // Update Away Toucher Score
  let totalAwayTouchers = document.getElementById("touchers__away");
  totalAwayTouchers.innerHTML = (
    currentEndResult.noOfAwayTouchers * 3
  ).toString();
  awayScoreTotal = currentEndResult.noOfAwayTouchers * 3;

  // Update Shot Scores
  let shotScores = [];
  for (let i = 0; i < currentEndResult.winningSides.length; i++) {
    switch (currentEndResult.winningSides[i]) {
      case -1:
        shotScores[2 * i] = 0;
        shotScores[2 * i + 1] = 0;
        break;
      case 0:
        shotScores[2 * i] = scoreForShot[i];
        shotScores[2 * i + 1] = 0;
        homeScoreTotal = homeScoreTotal + scoreForShot[i];
        break;
      case 1:
        shotScores[2 * i] = scoreForShot[i] / 2;
        shotScores[2 * i + 1] = scoreForShot[i] / 2;
        homeScoreTotal = homeScoreTotal + scoreForShot[i] / 2;
        awayScoreTotal = awayScoreTotal + scoreForShot[i] / 2;
        break;
      case 2:
        shotScores[2 * i] = 0;
        shotScores[2 * i + 1] = scoreForShot[i];
        awayScoreTotal = awayScoreTotal + scoreForShot[i];
        break;
      default:
        break;
    }
  }

  let shotScoresText = document.querySelectorAll(".shot-scores");
  for (let i = 0; i < shotScoresText.length; i++) {
    shotScoresText[i].innerHTML = shotScores[i].toString();
  }

  // Update Total Score
  document.getElementById("total__home").innerHTML = homeScoreTotal.toString();
  document.getElementById("total__away").innerHTML = awayScoreTotal.toString();

  // Show Result Modal Sheet
  modalSheet.style.display = "block";
}

//
// -------------------------------------------------------------------------------------
// Funtion: confirmEnd
// Description: Store End Result, reset current end and button state, hide modal sheet
// -------------------------------------------------------------------------------------
function confirmEnd() {
  //
  // Store End Result
  // NOTE: Beware that a deep clone of currentEndResult is pushed into endResults instead of
  // the object itself. Otherwise, the reference of currentEndResult will be passed to endResults
  // array instead, which will alter the value of endResults last entry with all changes made to
  // currentEndResult
  endResults.push(JSON.parse(JSON.stringify(currentEndResult)));
  if (localStorage) {
    localStorage.setItem("endResults", JSON.stringify(endResults));
  }

  // Update Running Scores
  runningHomeScore += currentEndResult.homeScore;
  runningAwayScore += currentEndResult.awayScore;

  // If not finish 7 ends, prepare for next end
  if (currentEndResult.end < 7) {
    // Reset Current End Result
    currentEndResult.end += 1;
    currentEndResult.homeScore = 0;
    currentEndResult.awayScore = 0;
    currentEndResult.noOfHomeTouchers = 0;
    currentEndResult.noOfAwayTouchers = 0;
    currentEndResult.winningSides = [noValue, noValue, noValue];
    saveCurrentEnd();

    // Reset Button State
    resetBtnState();

    // Hide Result Modal Sheet
    closeModalSheet();

    // Game finshed, show Final Scores Sheet and clean-up
  } else {
    gameWrapUp();
  }
}

//
// -----------------------------------------------------------------
// Funtion: resetBtnState
// Description: Reset Toucher Buttons and Side Buttons
// -----------------------------------------------------------------
function resetBtnState() {
  //
  // Update end count
  endLabel.innerHTML = currentEndResult.end;

  // -- Reset Toucher Buttons --
  // Reset Home Touchers
  for (let i = 0; i < homeToucherBtn.length; i++) {
    homeToucherBtn[i].classList.remove("pressed");
    if (i === 0) {
      homeToucherBtn[i].style.visibility = "visible";
      homeToucherBtn[i].style.opacity = "1";
      homeToucherBtn[i].classList.remove("disabled");
    } else {
      homeToucherBtn[i].style.visibility = "hidden";
      homeToucherBtn[i].style.opacity = "0";
      homeToucherBtn[i].classList.add("disabled");
    }
  }

  // Reset Away Touchers
  for (let i = 0; i < awayToucherBtn.length; i++) {
    awayToucherBtn[i].classList.remove("pressed");
    if (i === 0) {
      awayToucherBtn[i].style.visibility = "visible";
      awayToucherBtn[i].style.opacity = "1";
      awayToucherBtn[i].classList.remove("disabled");
    } else {
      awayToucherBtn[i].style.visibility = "hidden";
      awayToucherBtn[i].style.opacity = "0";
      awayToucherBtn[i].classList.add("disabled");
    }
  }

  // Reset Side Buttons
  for (let i = 0; i < sideBtns.length; i++) {
    sideBtns[i].classList.remove("side-btn_pressed");
  }
}

//
// ----------------------------------------------------------------------
// Funtion: closeModal
// Description: Close the current modal sheet (End Result Confirmation)
// ----------------------------------------------------------------------
function closeModalSheet() {
  // Close Result Modal Sheet
  modalSheet.style.display = "none";
}

//
// ----------------------------------------------------------------------
// Funtion: gameWarpUp
// Description: Build the Final Score Sheet to wrap up the game
// ----------------------------------------------------------------------
function gameWrapUp() {
  // Count total touchers for both teams
  let totalTouchersHome = endResults.reduce((runningTotal, er) => {
    return runningTotal + er.noOfHomeTouchers;
  }, 0);

  let totalTouchersAway = endResults.reduce((runningTotal, er) => {
    return runningTotal + er.noOfAwayTouchers;
  }, 0);

  // Count highest end score for both teams
  let highestEndScoreHome = endResults.reduce(
    (highest, end) => Math.max(highest, end.homeScore),
    0
  );
  let highestEndScoreAway = endResults.reduce(
    (highest, end) => Math.max(highest, end.awayScore),
    0
  );

  // Build Modal Header
  let modalHeader = document.getElementById("modal__header");
  modalHeader.textContent = `Final Scores`;

  // Build Modal Container
  let finalSummary = `
        <div id="final__wrap">
          <div id="final__home" class="score_500 home">${runningHomeScore}</div>
          <div id="final__away" class="score_500 away">${runningAwayScore}</div>
        </div>
        <div id="home-label-2" class="label">HOME</div>
        <div id="away-label-2" class="label">AWAY</div>
        <div id="total-touchers__label" class="label">Total Touchers</div>
        <div id="total-touchers__home" class="score_250 home">${totalTouchersHome}</div>
        <div id="total-touchers__away" class="score_250 away">${totalTouchersAway}</div>
        <div id="highest-end__label" class="label">Highest End</div>
        <div id="highest-end__home" class="score_250 home">${highestEndScoreHome}</div>
        <div id="highest-end__away" class="score_250 away">${highestEndScoreAway}</div>
        <div id="score-card-row" class="score-card-btn__wradiv">
          <div id="score-card-btn__icon"> 
            <img src="./resources/images/score-card-icon.png" alt="score card icon" />
          </div>
          <div id="score-card-btn__label">
            <p>Score Card</p>
          </div>
        </div>
      `;

  let modalContainer = document.getElementById("modal__container");
  modalContainer.style.setProperty(
    "grid-template-rows",
    "5rem repeat(3, 3rem) 7rem"
  );
  modalContainer.innerHTML = finalSummary;

  // Add event listener for Score Card icon and label
  let scoreCardRow = document.getElementById("score-card-row");
  scoreCardRow.addEventListener("click", goScoreCardPage);

  // Reset the Navigation bar to hold the 'Finish' button
  let modalNavBarHTML = `<button id="finish-game" class="cta">Finsh</button>`;
  let modalNavBar = document.getElementById("modal__nav-bar");
  modalNavBar.innerHTML = modalNavBarHTML;
  let finishBtn = document.getElementById("finish-game");
  finishBtn.addEventListener("click", gameOver);
}

//
// --------------------------------------------------------------------------------
// Funtion: gameOver
// Description: Clean up local Storage and session Storage, go back to index page
// --------------------------------------------------------------------------------
function gameOver() {
  //
  // Double confirm with user to end the game
  const yes = window.confirm("Sure to finish Game? All scores will be erased");

  // If confirmed, clear locage storage and return to home page
  if (yes) {
    if (localStorage) {
      localStorage.removeItem("endResults");
    }

    if (sessionStorage) {
      sessionStorage.removeItem("currentEndResult");
    }

    window.location.assign("index.html");
  }
}
