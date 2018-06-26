/*SCRIPT FOR TOP-RIGHT HAND CORNER NAV BAR ON MAIN PAGE*/

/*Display successful sign-in message for 3 seconds*/
console.log('Nav script.');
console.log(localStorage);


const loginSuccessMessage = document.getElementById("home-login");
const upArrow = document.getElementById("up-arrow");
const msg = document.getElementById("msg");
const msgText = document.getElementById("msg-text");

if (localStorage.username) {

	loginSuccessMessage.style.display = "block";
	upArrow.style.display = "block";
	msg.style.display = "block";
	msgText.innerHTML = "Welcome " + localStorage.username + "!";

    setTimeout(() => {
      loginSuccessMessage.style.display = "none";
    }, 4000);

}


/*Change navbar based on localStorage*/
const loggedIn = document.getElementById("loggedIn");
const loggedOut = document.getElementById("loggedOut");

if (localStorage.username) {
  loggedOut.style.display = "none";
} else {
  loggedIn.style.display = "none";
}

/*User logout*/
function logout() {
  localStorage.clear();
  window.location = "/";
}