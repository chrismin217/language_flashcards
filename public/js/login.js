console.log('login script.');

function formSubmit(formElement) {
	
	let user = formElement.username.value;
	let pw = formElement.password.value;

	let xhr = new XMLHttpRequest();

	xhr.addEventListener("load", function(e) {

		if (this.responseText.length > 200) {
			//means that the XHR has returned a res.render template, and the user/pw is invalid. temporary workaround for now.
			const loginMsg = document.getElementById("login-msg");
			loginMsg.style.display = "block";
			setTimeout(() => {
				loginMsg.style.display = "none";
			}, 3000);
			return false;

		} else {
			//otherwise, user/pw matches and is successful.
			let loggedUser = JSON.parse(this.responseText);

			localStorage.setItem("id", loggedUser.id);
			localStorage.setItem("username", loggedUser.username);
			window.location = "/";
		}

	});

	xhr.open("POST", "http://127.0.0.1:8080/login", true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send("username=" + user + "&password=" + pw);

	return false;
}