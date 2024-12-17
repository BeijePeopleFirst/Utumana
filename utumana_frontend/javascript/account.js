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
						
						/*let img = document.createElement('img')
						img.classList.add('profile-picture');
						if(json.profilePictureUrl){
							img.src = json.profile_picture_url;
						} else {
							img.src = "static/images/empty.png";
						}
						img.alt = "profile-picture";
						imgContaier.appendChild(img);*/
						
						console.log(json);
						userProvided = json;
						document.getElementById("bio").value = json.bio;
						
						//document.getElementById("profile_photo_user").src = json.profile_picture_url;
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
	//doFetch(prefixUrl + "api/user/store_photo", "POST", headers, formData)
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
	
	
	//document.getElementById("profile_photo_user").src = userProvided.profilePictureUrl;
	
}

/**
 * Download a list of files.
 * author speedplane
 */
/*function download_files(files) {
  function download_next(i) {
    if (i >= files.length) {
      return;
    }
    var a = document.createElement('a');
    a.href = files[i].download;
    a.target = '_parent';
    // Use a.download if available, it prevents plugins from opening.
    if ('download' in a) {
      a.download = files[i].filename;
    }
    // Add a to the doc for click to work.
   (document.body || document.documentElement).appendChild(a);
  if (a.click) {
    a.click(); // The click method is supported by most browsers.
    } else {
      $(a).click(); // Backup using jquery
    }
    // Delete the temporary link.
    a.parentNode.removeChild(a);
    // Download the next file with a small timeout. The timeout is necessary
    // for IE, which will otherwise only download the first file.
    setTimeout(function() {
      download_next(i + 1);
    }, 500);
  }
  // Initiate the first download.
  download_next(0);
}*/

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
 

