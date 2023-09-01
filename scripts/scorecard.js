// ------------------------------
// Global Variables
// ------------------------------

// Winning scores for each shot
const shotScore = [10, 5, 3];

//
// -----------------------------------------------------
// Link screen items and add event listener to buttons
// -----------------------------------------------------

// Retrieve Viewport height and set height of content
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// Prepare content whenever page show
window.addEventListener("pageshow", getResult);

// End Row
// let endRows = document.getElementsByClassName("end-header");
// console.table(endRows);
// console.log(endRows.length);
// for (let i = 0; i < endRows.length; i++) {
//   console.log(i);
//   // endRows[i].addEventListener('click', () => {
//   //   console.log("Click detected");
//   // });
// }

// Close Button
const closeBtn = document.getElementById("close-btn");
closeBtn.addEventListener("click", () => {
  window.close();
});

//
// ------------------------------------------------------------------
// Funtion: getResult
// Description: Retrieve End Results from Storage and update screen
// ------------------------------------------------------------------
function getResult() {
  // Initialize variables
  const main = document.getElementById("main");
  let endResults = [];

  // Check and retrieve end scores if exists
  if (localStorage) {
    let endResultsJSON = localStorage.getItem("endResults");
    endResults = JSON.parse(endResultsJSON);
    console.log(endResults); // Debug
  } else {
    // Local Storage not suggported
    console.log("Local Storage not supported");
  }

  // If there is End Scores records
  if (endResults) {
    // Derive Aggregate Scores
    // -- Initiate aggregrate scores
    let aggHomeScore = 0;
    let aggAwayScore = 0;

    // -- Get score details of each end
    for (let i = 0; i < endResults.length; i++) {
      const endResult = endResults[i];

      // Retrieve scores from each end and accumulate to aggregrate scores
      aggHomeScore += endResult.homeScore;
      aggAwayScore += endResult.awayScore;

      // Construct End header
      // const end = document.createElement("p");
      // end.innerHTML = endResult.end.toString();
      // main.appendChild(end);

      // const homeScoreThisEnd = document.createElement("p");
      // homeScoreThisEnd.innerHTML = endResult.homeScore.toString();
      // main.appendChild(homeScoreThisEnd);

      // const homeScoreAfterEnd = document.createElement("p");
      // homeScoreAfterEnd.innerHTML = aggHomeScore.toString();
      // main.appendChild(homeScoreAfterEnd);

      // const awayScoreThisEnd = document.createElement("p");
      // awayScoreThisEnd.innerHTML = endResult.awayScore.toString();
      // main.appendChild(awayScoreThisEnd);

      // const awayScoreAfterEnd = document.createElement("p");
      // awayScoreAfterEnd.innerHTML = aggAwayScore.toString();
      // main.appendChild(awayScoreAfterEnd);

      // Working......
      let divRow = document.createElement("div");
      divRow.classList.add("end-row");

      let divHeader = document.createElement("div");
      divHeader.classList.add("end-header");
      let rowContent = `
        <p id="chevron" class="fa fa-chevron-down fa-lg" style="color: #ffffff;" aria-hidden="true"></p>
        <p class="score_200 neutral">${endResult.end.toString()}</p>
        <p></p>       
        <p class="score_200 home">${endResult.homeScore.toString()}</p>
        <p class="score_200 home">${aggHomeScore.toString()}</p>
        <p></p>
        <p class="score_200 away">${endResult.awayScore.toString()}</p>
        <p class="score_200 away">${aggAwayScore.toString()}</p>
      `;
      divHeader.innerHTML = rowContent;
      divHeader.addEventListener("click", expandRow);

      divRow.appendChild(divHeader);

      // Construct End details
      // -- Touchers score
      let homeToucherScore = endResult.noOfHomeTouchers * 3;
      let awayToucherScore = endResult.noOfAwayTouchers * 3;

      // -- Winning shot scores
      let winningShots = [];
      for (j = 0; j < endResult.winningSides.length; j++) {
        switch (endResult.winningSides[j]) {
          case 0: // Home
            winningShots[j] = [shotScore[j], 0];
            break;
          case 1: // Tie
            winningShots[j] = [shotScore[j] / 2, shotScore[j] / 2];
            break;
          case 2: // Away
            winningShots[j] = [0, shotScore[j]];
            break;
          default: // Not suppose to happen
            winningShots.push([0, 0]);
        }
      }

      // Construct HTML fragment for end detail scores
      let divDetails = document.createElement("div");
      divDetails.classList.add("end-details");
      let detailContent = `
        <p class="score_160 home">${homeToucherScore.toString()}</p>
        <p class="tag_small neutral">Touchers</p>
        <p class="score_160 away">${awayToucherScore.toString()}</p>
        <p class="score_160 home">${winningShots[0][0].toString()}</p>
        <p class="tag_small neutral">1st Shot</p>
        <p class="score_160 away">${winningShots[0][1].toString()}</p>
        <p class="score_160 home">${winningShots[1][0].toString()}</p>
        <p class="tag_small neutral">2nd Shot</p>
        <p class="score_160 away">${winningShots[1][1].toString()}</p>
        <p class="score_160 home">${winningShots[2][0].toString()}</p>
        <p class="tag_small neutral">3rd Shot</p>
        <p class="score_160 away">${winningShots[2][1].toString()}</p>
      `;
      divDetails.innerHTML = detailContent;
      divRow.appendChild(divDetails);

      main.appendChild(divRow);
    }
  } else {
    console.log("No results found");
  }
}

//
// ------------------------------------------------------------------
// Funtion: expandRow
// Description: Expand end score row
// ------------------------------------------------------------------
function expandRow(e) {
  console.log("Clicked");
  e.currentTarget.parentNode.classList.toggle("expanded");
}
