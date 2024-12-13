
const params = new URLSearchParams(window.location.search);
let userId = params.get("id_to_edit");

let nameUsr = document.getElementById("name");
let surname = document.getElementById("surname");
let email = document.getElementById("email");
let bio = document.getElementById("bio");
let message = document.getElementById("message");
let id = document.getElementById("id");

let nameUsrOldValue = undefined;
let surnameOldValue = undefined;
let emailOldValue = undefined;
let bioOldValue = undefined;


function initFields() {
	
	//Now lets load the user:
	//fetch(PREFIX_URL + "api/user/" + userId)
	doFetch(prefixUrl + 'api/user/' + userId, 'GET', headers, null)
	.then(json => {
		nameUsr.value = json.name;
		nameUsrOldValue = json.name;
		
		surname.value = json.surname;
		surnameOldValue = json.surname;
		
		email.value = json.email;
		emailOldValue = json.email;
		
		bio.value = json.bio;
		bioOldValue = json.bio;
		
		id.value = json.id;
	})
	.catch(error => setMessage(error.message, "red"))
	
}

/**
 * This function initializes the page
 */
function init() {
	initFields();
}

/**
 * This Function applies the provided changes
 */
function applyChanges() {
	let newName = (nameUsr.value != nameUsrOldValue) ? nameUsr.value : undefined;
	let newSurname = (surname.value != surnameOldValue) ? surname.value : undefined;
	let newBio = (bio.value != bioOldValue) ? bio.value : undefined;
	let newEmail = (email.value != emailOldValue) ? email.value : undefined;
	
	let object = {};
	object["id"] = userId;
	
	if(newName != undefined) object["name"] = newName;
	if(newSurname != undefined) object["surname"] = newSurname;
	if(newBio != undefined) object["bio"] = newBio;
	if(newEmail != undefined) object["email"] = newEmail;
		
	let body = JSON.stringify(object);
	
	//fetch(PREFIX_URL + "api/user", {
	doFetch(prefixUrl + 'api/user', 'PATCH', headers, body)
	.then(json => {
		printError(json);
		setMessage("User correctly modified", "green");
		//window.location.href = staticUrl + "user_list.html";
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