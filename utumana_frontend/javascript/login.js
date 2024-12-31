
function signin() {
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let message = document.getElementById("message");
	
	//console.log("email: ", email);
	//console.log("password: ", password);
	
	fetch(prefixUrl + 'api/signin', {
	  method: 'POST', 
	  body: JSON.stringify({
	    email: email,
	    password: password,
	  }),
	  headers: {
	    'Content-type': 'application/json; charset=UTF-8',
	  },
	}).then(async response => {
		if(response.ok){
			let json = await response.json();
			localStorage.setItem('id',json.id);
			localStorage.setItem("token", json.token);
			document.cookie = "refresh_token=" + json.refresh_token;// + ";SameSite=Lax";
 			window.location.href = staticUrl + "home.html";
 		}else{
			 message.innerHTML="Error Occurred: invalid email or password";
			 message.style.color = "red";
 			 //throw new Error("Login Failed");
 		}
		
	});
}

function resetPassword(){
	window.location.href = staticUrl + "reset_user_password.html";
}

function checkToken(){
	let token = localStorage.getItem("token");
	if(token != null)
		window.location.href = staticUrl + 'home.html';
}

