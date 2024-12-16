//const prefixUrl = 'http://localhost:8080/';
const userId = localStorage.getItem('id');

function loadMyAccommodation(){
	doFetch(prefixUrl + 'api/get_my_accommodations/'+userId, 'GET', headers, null)
		.then((json) => {
			console.log(json);
									
			const container = document.getElementById("my_accommodations");
			displayAccommodationsCards(container, json, "No accommodations yet");
			displayPrices(json);
		})
		.catch((error) => {
			console.log(error);
		});
	
	loadPendingAccommodations();
	loadRejectedAccommodations();
}

function loadPendingAccommodations(){
	doFetch(prefixUrl + 'api/pending_accommodations/'+ userId, 'GET', headers, null)
		.then((json) => {
			console.log(json);
									
			const container = document.getElementById("pending_accommodations");
			displayAccommodationsCards(container, json, "No accommodations yet");
			displayPrices(json);
		})
		.catch((error) => {
			console.log(error);
		});
}

function loadRejectedAccommodations(){
	doFetch(prefixUrl + 'api/rejected_accommodations/'+ userId, 'GET', headers, null)
		.then((json) => {
			console.log(json);
			if(json && !isError(json) && json.length > 0){
				document.getElementById("rejected_container").style.visibility = "visible";
				const container = document.getElementById("rejected_accommodations");
				displayAccommodationsCards(container, json, "No accommodations");
				displayPrices(json);
				
				let rejected_buttons = document.getElementById("rejected_container").getElementsByTagName("button");
				for(let i=0; i<rejected_buttons.length; i++){
					rejected_buttons[i].setAttribute("onclick", "window.location.href='" + staticUrl + "accommodation_details.html?id=" + json[i].id + "&rejected=true'");
				}
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

function loadHousesToAccept(){
	doFetch(prefixUrl + 'api/get_accommodationsdto_to_approve', 'GET', headers, null)
			.then((json) => {
				console.log(json);
										
				const container = document.getElementById("accommodations");
				displayAccommodationsCards(container, json, "No accommodations to be approved",true);
			})
			.catch((error) => {
				console.log(error);
			});
}

