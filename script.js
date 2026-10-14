//Get all needed DOM elements
const form = document.getElementsById("CheckInForm");
const nameInput=document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//track attendance
let count = 0;
const maxCount = 50; //50 people


//event listener
//handle form submission
form.addEventListener("submit", function (event))
{
  //when a form gets submitted by a browser, it refreshes the page
  //the following allows to keep the page
  //stops default behavior
  event.preventDefault();

  //Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  //get text thats defined within the selected option tag
  const teamName = teamSelect.selectedOptions(0).text

  console.log(name, teamName);

  //increment count
  count++;    //increments each time form is submitted
  console.log("Total check-ins: ", count);
};
