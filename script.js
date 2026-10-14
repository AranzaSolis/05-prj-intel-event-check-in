//log into the console
//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput=document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const celebrationDialog = document.getElementById("celebrationDialog");
const winnerMessage = document.getElementById("winnerMessage");
const confettiContainer = document.getElementById("confettiContainer");
const closeCelebration = document.getElementById("closeCelebration");

//track attendance
let count = 0;
const maxCount = 50; // 50
let attendees = [];

//Display saved attendees by creating text-only list entries.
function displayAttendees() {
  attendeeList.textContent = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendeeItem = document.createElement("li");
    const attendeeName = document.createElement("span");
    const attendeeTeam = document.createElement("span");

    attendeeName.textContent = attendees[i].name;
    attendeeTeam.textContent = attendees[i].team;
    attendeeTeam.classList.add("attendee-team");
    attendeeItem.appendChild(attendeeName);
    attendeeItem.appendChild(attendeeTeam);
    attendeeList.appendChild(attendeeItem);
  }
}

//Play a bright, rising video-game-style congratulations sound.
function playCelebrationSound() {
  if (!window.AudioContext) {
    console.error("This browser does not support the celebration sound.");
    return;
  }

  const audioContext = new window.AudioContext();
  const startTime = audioContext.currentTime;
  const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];

  for (let i = 0; i < notes.length; i++) {
    const noteStart = startTime + i * 0.13;
    const noteEnd = noteStart + 0.22;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = notes[i];
    volume.gain.setValueAtTime(0.001, noteStart);
    volume.gain.exponentialRampToValueAtTime(0.08, noteStart + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.001, noteEnd);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  }

  setTimeout(function () {
    audioContext.close();
  }, 1000);
}

//Restore saved attendance counts and refresh the page totals.
try {
  const savedCountsText = localStorage.getItem("eventCheckInCounts");

  if (savedCountsText !== null) {
    const savedCounts = JSON.parse(savedCountsText);

    if (
      !savedCounts ||
      !Number.isInteger(savedCounts.total) ||
      savedCounts.total < 0 ||
      !Number.isInteger(savedCounts.water) ||
      savedCounts.water < 0 ||
      !Number.isInteger(savedCounts.zero) ||
      savedCounts.zero < 0 ||
      !Number.isInteger(savedCounts.power) ||
      savedCounts.power < 0
    ) {
      throw new Error("Saved attendance counts are invalid.");
    }

    count = savedCounts.total;
    attendees = savedCounts.attendees || [];
    if (
      !Array.isArray(attendees) ||
      attendees.some(function (attendee) {
        return (
          !attendee ||
          typeof attendee.name !== "string" ||
          typeof attendee.team !== "string"
        );
      })
    ) {
      throw new Error("Saved attendee list is invalid.");
    }

    attendeeCount.textContent = count;
    document.getElementById("waterCount").textContent = savedCounts.water;
    document.getElementById("zeroCount").textContent = savedCounts.zero;
    document.getElementById("powerCount").textContent = savedCounts.power;
    progressBar.style.width = `${Math.round((count / maxCount) * 100)}%`;
    displayAttendees();
  }
} catch (error) {
  console.error("Could not restore attendance counts from local storage.", error);
}

closeCelebration.addEventListener("click", function () {
  celebrationDialog.close();
});

//event listener
//handle form submission
form.addEventListener("submit", function (event)
{
  //when a form gets submitted by a browser, it refreshes the page
  //the following allows to keep the page
  //stops default behavior
  event.preventDefault();

  //Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  //get text thats defined within the selected option tag
  const teamName = teamSelect.selectedOptions[0].text

  console.log(name, teamName);

  //increment count
  count++;    //increments each time form is submitted
  console.log("Total check-ins: ", count);

  //Show the updated attendee total on the page.
  attendeeCount.textContent = count;

  //update progress bar
  const percentage = Math.round((count/maxCount)*100) + "%";
  console.log("Progress: ", percentage);

  //Set the progress bar width to the calculated percentage.
  progressBar.style.width = percentage;

  //update team counter
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent); //parseInt converts it into a number

  const newTotal = current + 1;
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Add this attendee to the on-page list and the saved attendance record.
  attendees.push({ name: name, team: teamName });
  displayAttendees();

  //Save the total and each team's count in the browser.
  try {
    localStorage.setItem(
      "eventCheckInCounts",
      JSON.stringify({
        total: count,
        water: Number(document.getElementById("waterCount").textContent),
        zero: Number(document.getElementById("zeroCount").textContent),
        power: Number(document.getElementById("powerCount").textContent),
        attendees: attendees
      })
    );
  } catch (error) {
    console.error("Could not save attendance counts to local storage.", error);
  }

  //show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}`;
  console.log(message);

  //Display the welcome message on the page.
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

 //////////////////////////////////////////////////////////
  //When the check-in goal is reached, find the team with the most attendees.
  if (count === maxCount) {
    const teams = [
      {
        name: "Team Water Wise",
        count: Number(document.getElementById("waterCount").textContent)
      },
      {
        name: "Team Net Zero",
        count: Number(document.getElementById("zeroCount").textContent)
      },
      {
        name: "Team Renewables",
        count: Number(document.getElementById("powerCount").textContent)
      }
    ];
    let highestCount = 0;
    let winningTeams = [];

    //Include every team tied for the highest count.
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].count > highestCount) {
        highestCount = teams[i].count;
        winningTeams = [teams[i].name];
      } else if (teams[i].count === highestCount) {
        winningTeams.push(teams[i].name);
      }
    }
//////////////////////////////////////////

    //Play a party-blower sound when the goal celebration begins.
    playCelebrationSound();

    //Show the winner in a separate popup
    winnerMessage.textContent = `Winning team: ${winningTeams.join(" and ")}`;
    for (let i = 0; i < 40; i++) {
      const confettiPiece = document.createElement("span");
      confettiPiece.classList.add("confetti-piece");
      confettiPiece.style.left = `${Math.random() * 100}%`;
      confettiPiece.style.animationDelay = `${Math.random()}s`;
      confettiContainer.appendChild(confettiPiece);
    }
    celebrationDialog.showModal();
    setTimeout(function () {
      confettiContainer.textContent = "";
    }, 4000);
  }

  form.reset(); //method that clears all input fields in the form
});