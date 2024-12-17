/**
 * 
 */
const id = localStorage.getItem('id');
//const headers = new Headers();
//headers.append("Authorization", "Bearer " + localStorage.getItem("token"));

let userProvided = undefined;

function on_load(){
	
    		// load profile picture		
			doFetch(prefixUrl+'api/user/'+id, 'GET', headers, null)
					.then((json) => {
						let imgContaier = document.getElementsByClassName('img-container')[0];
						
						
						imgContaier.innerHTML='';
						
						let img = document.createElement('img')
						img.classList.add('profile-picture');
						if(json.profilePictureUrl){
							img.src = json.profilePictureUrl;
						} else {
							img.src = "/icons/empty.png";
						}
						img.alt = "profile-picture";
						img.id = "profile_photo_user";
						imgContaier.appendChild(img);
						
						console.log(json);
						userProvided = json;
						document.getElementById("bio").value = json.bio;
						
						
					})
					.catch((error) => {
						console.log(error);
			});
			
			
			
    	}
function update_profile_picture(){
    		// let user choose a picture from file system
    		// send PATCH with new profile picture
			let popupSelectImage = document.createElement("div");
			popupSelectImage.style.position = "fixed";
			popupSelectImage.style.top = "50%";
			popupSelectImage.style.left = "50%";
			popupSelectImage.style.transform = "translate(-50%, -50%)";
			popupSelectImage.style.zIndex = "1000";
			popupSelectImage.id = "select_popup";
			popupSelectImage.style.display = "flex";
			popupSelectImage.style.flexDirection = "row";
			popupSelectImage.className = "popupSelectProfilePhoto";
			popupSelectImage.style.backgroundColor = "green";
			popupSelectImage.style.border = "5px solid blue";
			
			let imgForm = document.createElement("form");
			imgForm.enctype = "multipart/form-data";
			let label = document.createElement("label");
			label.htmlFor = "input_img";
			label.innerHTML = "Choose a Photo: ";
			let inputImg = document.createElement("input");
			inputImg.id = "input_img";
			inputImg.type = "file";
			
			imgForm.appendChild(label);
			imgForm.appendChild(inputImg);
						
			let buttonConfirm = document.createElement("button");
			buttonConfirm.type = "button";
			buttonConfirm.innerHTML = "Confirm";
			buttonConfirm.onclick = function() {
										saveSelectedPhotoOnServerDisk(inputImg.files[0]);
									}
			imgForm.appendChild(buttonConfirm);
			
			popupSelectImage.appendChild(imgForm);
			
			document.body.appendChild(popupSelectImage);
}

/**
 * @param {File} file
 */
function saveSelectedPhotoOnServerDisk(file) {
	console.log("PRINTO IL FILE SOTTO");
	console.log(file);
	console.log("INIZIO TEST PALLAS");
	
	let formData = new FormData();
	formData.append("img", file);//content-type=multipart/*
	
	console.log("STAMPO FORM DATA");
	console.log(formData);
	
	
	let headersOth = new Headers();
	headersOth.append("Authorization", "Bearer " + localStorage.getItem("token"));
	headersOth.append("Accept", "*/*");
		
	
	doFetch(prefixUrl + "api/user/store_photo", "POST", headersOth, formData)
	.then(json => {
		printError(json);
		console.log(json);
		
		let body = {"profile_picture" : json.url, "id" : userProvided.id,};
		console.log("NEXT");
		console.log("bODY ->", body);
		
		let otherHeaders = createRequestHeaders();
		
		doFetch(prefixUrl + "api/user", "PATCH", otherHeaders, JSON.stringify(body))
			.then(json2 => {
				printError(json2);
				document.getElementById("profile_photo_user").src = json2.profilePictureUrl;
			})
			.catch(error2 => {
					let msg = document.getElementById("message");
					msg.innerHTML = error2.message;
					msg.style.color = "red";
					console.error(error2);
				})
	})
	.catch(error => {
		let msg = document.getElementById("message");
		msg.innerHTML = error.message;
		msg.style.color = "red";
		console.error(error);
	});
	
	let popUpToClose = document.getElementById("select_popup");
	popUpToClose.remove();
	
}

function update_bio(){
    		// send PATCH with new bio
			let bio = document.getElementById("bio").value;
			
			let object = {
				bio : bio,
				id:id,
			}
			
			let body = JSON.stringify(object);
			
			doFetch(prefixUrl+'api/user', 'PATCH', headers, body)
				.then((json) => {
					console.log(json);
					document.getElementById("bio").value = json.bio;
				})
				.catch((error) => {
					console.log(error);
				});
}

function back_to_profile(){
	window.location.href = staticUrl + "profile.html";
}
 

