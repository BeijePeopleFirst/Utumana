
const params = new URLSearchParams(window.location.search);
let userId = params.get("id_to_edit");
const id = localStorage.getItem('id');

let username = undefined;


let titleMessage = document.getElementById("title_message");
let formContainer = document.getElementById("form-container");
let message = document.getElementById("message");

let newPasswordInput,confirmPasswordInput,emailInput,OldPasswordInput;

let idToUse = (userId) ? userId : id;
function init() {
	if(idToUse){	
		initHeader();
	}
	getAccount();
	createPage();
	createButtons();
}

function getAccount(){
	if(idToUse){		
		doFetch(prefixUrl + 'api/user/' + idToUse, 'GET', headers, null)
			.then(json => {
				username = json.email;
				let toInsert = "Reset Password for User " + json.name + json.surname + json.email;
				if(idToUse===id){
					toInsert = "reset my password";
				}
				titleMessage.innerHTML = toInsert;
			})
			.catch(error => {
				message.innerHTML = "Error while retrieving the User";
				message.style.color = "red";
				console.error(error);
			});
	}else{
		titleMessage.innerHTML = "Type your email to reset the passoword";
	}
}

function createPage(){
	if(!idToUse){
		createEmailField();
	}else if(idToUse===id){
		
	}
	
	let newPasswordLabel = document.createElement("lable");
	newPasswordLabel.for = "new";
	newPasswordLabel.innerHTML = "New password:";
	
	formContainer.appendChild(newPasswordLabel);
	
	newPasswordInput= document.createElement("input");
	newPasswordInput.type = "password";
	newPasswordInput.id = "new_password_field";
	newPasswordInput.name = "new";
	
	formContainer.appendChild(newPasswordInput);
	
	let confirmPasswordLabel = document.createElement("lable");
	confirmPasswordLabel.for = "confirm";
	confirmPasswordLabel.innerHTML = "Confirm password:";
		
	formContainer.appendChild(confirmPasswordLabel);
		
	confirmPasswordInput= document.createElement("input");
	confirmPasswordInput.type = "password";
	confirmPasswordInput.id = "confirm_password_field";
	confirmPasswordInput.name = "confirm";
		
	formContainer.appendChild(confirmPasswordInput);
}

function createEmailField(){
	let emailLabel = document.createElement("lable");
	emailLabel.for = "email";
	emailLabel.innerHTML = "email";
			
	formContainer.appendChild(emailLabel);
			
	emailInput= document.createElement("input");
	emailInput.type = "text";
	emailInput.id = "email_field";
	emailInput.name = "email";
			
	formContainer.appendChild(emailInput);
}

function createOldPasswordField(){
	let oldPasswordLabel = document.createElement("lable");
	oldPasswordLabel.for = "old";
	oldPasswordLabel.innerHTML = "Old password:";
			
	formContainer.appendChild(oldPasswordLabel);
			
	OldPasswordInput= document.createElement("input");
	OldPasswordInput.type = "password";
	OldPasswordInput.id = "old_password_field";
	OldPasswordInput.name = "old";
			
	formContainer.appendChild(OldPasswordInput);
}

function createButtons(){
	let buttonContainerDiv=document.createElement("div");
	buttonContainerDiv.classList.add("button-container");
	
	let resetPasswordButton =document.createElement("button");
	resetPasswordButton.type="button";
	resetPasswordButton.textContent="Reset password";
	
	if(idToUse){		
		resetPasswordButton.onclick= ()=>{
			resetPassword();
		}
	}else{
		resetPasswordButton.onclick= ()=>{
			resetPasswordNoLog();
		}
	}
	
	buttonContainerDiv.appendChild(resetPasswordButton);
	
	let goBackButton =document.createElement("button");
	goBackButton.type="button";
	goBackButton.textContent="Back";
	
	goBackButton.onclick= () =>{
		window.history.back();
	}
	
	buttonContainerDiv.appendChild(goBackButton);
	
	formContainer.appendChild(buttonContainerDiv);
}

function resetPasswordNoLog(){
	console.log('api/change_password');
	
	if(newPasswordInput.value !== confirmPasswordInput.value) {
			message.innerHTML = "The provided fields MUST correspond with each other";
			message.style.color = "orange";
			return;
		}
	else {
	
	body = {
			id : idToUse,
			password : "" + newPasswordInput.value,
			email : emailInput.value
		}
		
	fetch(prefixUrl + 'api/change_password', {
		  method: 'PATCH', 
		  body: JSON.stringify(body),
		  headers: {
		    'Content-type': 'application/json; charset=UTF-8',
		  },
		}).then(async response => {
			if(response.status != 401){
				let json = await response.json();
				printError(json);
				message.innerHTML = "Password Successfully UPDATED for user " + json.email;
				message.style.color = "green";
	 		}else{
				console.log("something whent wrong");
			}
		})
	}
}

 function resetPassword() {
	if(newPasswordInput.value !== confirmPasswordInput.value) {
		message.innerHTML = "The provided fields MUST correspond with each other";
		message.style.color = "orange";
		return;
	}
	else {	
		let body = {
			id : idToUse,
			password : "" + newPasswordInput.value,
		};

		
		doFetch(prefixUrl + 'api/user', 'PATCH', headers, JSON.stringify(body))
		.then(json => {
			printError(json);
			if(idToUse===id){
				message.innerHTML = "Password Successfully UPDATED";
			}else{			
				message.innerHTML = "Password Successfully UPDATED for user " + username;
			}
			message.style.color = "green";
		})
		
		
		return;
	}
}