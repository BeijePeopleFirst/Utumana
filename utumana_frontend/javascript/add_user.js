
let name = document.getElementById("name");
let surname = document.getElementById("surname");
let email = document.getElementById("email");
let bio = document.getElementById("bio");
let password = document.getElementById("password");

let message = document.getElementById("message");

function checkisAdmin() {
	
	doFetch(prefixUrl + 'api/testIsAdmin', 'GET', headers, null)
	.then(json => {
		console.log(json.isAdmin);
	})
	.catch(error => setMessage(error.message, "red"))
	
}

function init() {
	checkisAdmin();
}

function createNewUser() {
	
	let object = {
		name: name.value,
		surname : surname.value,
		email : email.value,
		bio : bio.value,
		password : password.value
	};
		
	let body = JSON.stringify(object);
	
	doFetch(prefixUrl + 'api/user', 'POST', headers, body)
	.then(json => {
		printError(json);
		window.location.href = staticUrl + "user_list.html";
	})
	  .catch(error => setMessage(error.message, "red"))
	
}

/**
 * @param {string} text -> The message to display
 * @param {string} color -> The color to apply to the text
 */
function setMessage(text, color) {
	message.innerHTML = text;
	message.style.color = color;
}