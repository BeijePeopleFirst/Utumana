// depends on utils.js, post.js

function loadWhenEditing(accommodationId){
	initHeader();
	
	document.getElementById("progress_bar").style.display = "none";
	document.getElementById("save_button").innerHTML = "Save changes";
	document.getElementById("instruction").innerHTML = "Edit services";
	
	// fetch accommodation's services
	doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/services', 'GET', headers, null)
	.then((json) => {
		console.log(json);
		
		if(json.status != null){
			showError("services_container","Could not load the accommodation's services. Please retry.");
		} else {
			displayServices(document.getElementById("selected_services"), json, "", true);
			
			let ids = [];
			for(let i=0; i<json.length; i++){
				ids.push(json[i].id);
			}
			sessionStorage.setItem("services", JSON.stringify(ids));
		}
	})
	.catch((error) => {
		console.log(error, "Error trying to load accommodation's services");
		showError("services_container","Could not load the accommodation's services. Please retry.");
	});
}

function postServicesOnLoad(){
	const accommodationId = getIdFromURL();
	if(accommodationId != null){
		loadWhenEditing(accommodationId);
	} else {
		let selected = getArrayFromStorage("services");
	
		// load selected services
		if(selected.length == 0){
			selected = [1,2,3,4,7];	// default suggestions for services
			doFetch(prefixUrl + 'api/services?ids=' + selected, 'GET', headers, null)
				.then((json) => {
					console.log(json);
					displayServices(document.getElementById("search_results"), json, "", false);
				})
				.catch((error) => {
					console.log(error, "Error trying to load selected services");
				});
		} else {
			doFetch(prefixUrl + 'api/services?ids=' + selected, 'GET', headers, null)
			.then((json) => {
				console.log(json);
				displayServices(document.getElementById("selected_services"), json, "", true);
			})
			.catch((error) => {
				console.log(error, "Error trying to load selected services");
			});
		}
	}
}

function searchService(){
	const titleToSearch = document.getElementById("search_service").value;
	if(!titleToSearch)	return;
	
	// fetch matching services
	doFetch(prefixUrl + 'api/services/search?title=' + encodeURIComponent(titleToSearch), 'GET', headers, null)
	.then((json) => {
		console.log(json);
		
		let selected = getArrayFromStorage("services");
		json = json.filter(service => selected.includes(service.id) == false);
		console.log("selected", selected, ", json", json)
		
		const container = document.getElementById("search_results");
		displayServices(container, json, "No services found");
	})
	.catch((error) => {
		console.log(error, "Error trying to search services");
	})
}

function displayServices(container, json, noServicesMessage, checked = false){
	container.innerHTML = '';
	
	let element;
	if(!json || json.length == 0){
		element = document.createElement("p");
		element.innerHTML = noServicesMessage;
		container.appendChild(element);
		return;
	}
	
	let div, id;
	for(let i=0; i<json.length; i++){
		id = json[i].id;
		
		div = document.createElement("div");
		div.setAttribute("id", id)
		
		element = document.createElement("input");
		element.setAttribute("type", "checkbox");
		element.setAttribute("onclick", "moveService(this," + id +")");
		if(checked === true)	element.checked = true;
		div.appendChild(element);
		
		element = document.createElement("img");
		element.setAttribute("src", json[i].icon_url);
		element.setAttribute("alt", "service_icon")
		element.setAttribute("id", "icon" + json[i].id);
		div.appendChild(element);
		
		element = document.createElement("label");
		element.setAttribute("for", "icon" + json[i].id);
		element.innerHTML = json[i].title;
		div.appendChild(element);
		
		container.appendChild(div);
	}
}

function moveService(checkbox, id){
	let selected = getArrayFromStorage("services");
	
	let serviceDiv = document.getElementById(id);
	serviceDiv.remove();
	if(checkbox.checked == true){
		document.getElementById("selected_services").appendChild(serviceDiv);
		selected.push(id);
	}else {
		const index = selected.indexOf(id);
		selected.splice(index, 1);
	}
	sessionStorage.setItem("services", JSON.stringify(selected));
}

function saveAccommodationServices(){
	// services already in session storage and up to date
	
	const accommodationId = getIdFromURL(); 
	if(accommodationId == null){
		window.location.href = staticUrl + 'post_address.html';
	} else {
		let selected = getArrayFromStorage("services");
		
		// save changes (no need for admin approval)
		doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/services', 'PATCH', headers, JSON.stringify(selected))
		.then((json) => {
			if(json.status){
				console.log(json);
				// show error to user
				let errorMessage = document.getElementById("error");
				errorMessage.innerHTML = "Error saving changes. Please check your accommodation's services and retry.";
				errorMessage.style.visibility = "visible";
			}else {
				console.log("Edited services. Edited accommodation: ", json);
				
				showSuccess("services_container","Accommodation services edited successfully.");
				
				const container = document.getElementById("services_container");
				container.appendChild(document.createElement("br"));
				
				let button = document.createElement("button");
				button.setAttribute("type", "button");
				button.setAttribute("onclick", "window.location.href='" + staticUrl + "accommodation_details.html?id="+ accommodationId + "'");
				button.innerHTML = "Go to your accommodation's details";
				container.appendChild(button);
				
				// remove info from storage
				removeAccommodationFromStorage();
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to save edited accommodation's services");
			
			// show error to user
			let errorMessage = document.getElementById("error");
			errorMessage.innerHTML = "Error saving changes. Please check your accommodation services and retry.";
			errorMessage.style.visibility = "visible";
		});
	}
}