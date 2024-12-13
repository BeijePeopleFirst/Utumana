// depends on utils.js, html_utils.js, post.js

function loadWhenEditing(accommodationId){
	initHeader();
	
	document.getElementById("progress_bar").style.display = "none";
	document.getElementById("save_button").innerHTML = "Save changes";
	
	// fetch accommodation info and put it in sessionStorage
	doFetch(prefixUrl + 'api/accommodation/' + accommodationId, 'GET', headers, null)
	.then((json) => {
		if(json.id == null){
			console.log(json);
			showError("info-container","Could not load the accommodation info. Please retry.");
		} else {
			console.log("Editing accommodation: ", json);
			
			resetValidities();
			
			document.getElementById("title").value = json.title
			if(json.description)
				document.getElementById("description").innerHTML = json.description;
			document.getElementById("beds").value = json.beds;
			document.getElementById("rooms").value = json.rooms;
			// set images TODO
		}
	})
	.catch((error) => {
		console.log(error, "Error trying to load accommodation for editing");
		showError("info-container","Could not load the accommodation info. Please retry.");
	});
	
}
function postInfoOnLoad(){
	const accommodationId = getIdFromURL(); 
	if(accommodationId != null){
		loadWhenEditing(accommodationId);
	} else {
		resetValidities();
		
		setElementValueFromStorage("title");
		setElementInnerHTMLFromStorage("description");
		setElementValueFromStorage("beds");
		setElementValueFromStorage("rooms");
	}
}

function resetValidityOfBeds(){
	document.getElementById("beds").ariaInvalid = "false";
	document.getElementById("beds_error").style.visibility = "hidden";
}
function resetValidityOfRooms(){
	document.getElementById("rooms").ariaInvalid = "false";
	document.getElementById("rooms_error").style.visibility = "hidden";
}
function resetValidityOfImages(){
	document.getElementById("images").ariaInvalid = "false";
	// ...
}
function resetValidities(){
	document.getElementById("title").ariaInvalid = "false";
	resetValidityOfBeds();
	resetValidityOfRooms();
	resetValidityOfImages()
}

function saveAccommodationInfo(){
	const title = document.getElementById("title").value;
	const description = document.getElementById("description").value;
	const beds = document.getElementById("beds").value;
	const rooms = document.getElementById("rooms").value;
	const images = document.getElementById("images");	// TODO
	
	resetValidities();
	
	if(!infoOK(title, description, beds, rooms))
		return;
	
	sessionStorage.setItem("title", title);
	sessionStorage.setItem("description", description);
	sessionStorage.setItem("beds", beds);
	sessionStorage.setItem("rooms", rooms);
	//sessionStorage.setItem("images", )
	
	const accommodationId = getIdFromURL(); 
	if(accommodationId == null){
		window.location.href = staticUrl + 'post_services.html';
	} else {
		// save info changes (approvalTimestamp = null will be set in backend)
		const accommodation = {
			id: 		parseInt(accommodationId),
			owner_id: 	parseInt(localStorage.getItem("id")),
			title: 		title,
			description: description,
			beds: 		parseInt(beds),
			rooms: 		parseInt(rooms)
		}
		
		doFetch(prefixUrl + 'api/accommodation/' + accommodationId, 'PATCH', headers, JSON.stringify(accommodation))
		.then((json) => {
			console.log("Edited info. Edited accommodation: ", json);
			
			// save images changes (approvalTimestamp = null will be set in backend)
			// TODO
			// do fetch ...
			// if ok :
			
			showSuccess("info-container","Accommodation info edited successfully. Waiting for approval or feedback from the admins.");
			
			// remove info from storage
			removeAccommodationFromStorage();
		})
		.catch((error) => {
			console.log(error, "Error trying to save edited accommodation info");

			// show error to user
			let errorMessage = document.getElementById("error");
			errorMessage.innerHTML = "Error saving changes. Please check your accommodation info and retry.";
			errorMessage.style.visibility = "visible";
		})
	}
}

function infoOK(title, description, beds, rooms){
	let ok = true;
	
	// title is a non-blank string
	if(isBlank(title)){
		ok = false;
		document.getElementById("title").ariaInvalid = "true";
	}
	
	// description can be anything for now
	
	// beds is an integer > 0
	if(beds == null || parseFloat(beds) <= 0 || parseFloat(beds) != parseInt(beds)){
		ok = false;
		document.getElementById("beds").ariaInvalid = "true";
		document.getElementById("beds_error").style.visibility = "visible";
	}
	
	// rooms is an integer >= 0
	if(rooms == null || parseFloat(rooms) < 0 || parseFloat(rooms) != parseInt(rooms)){
		ok = false;
		document.getElementById("rooms").ariaInvalid = "true";
		document.getElementById("rooms_error").style.visibility = "visible";
	}
	
	return ok;
}