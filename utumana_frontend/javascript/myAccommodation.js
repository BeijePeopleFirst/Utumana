//const prefixUrl = 'http://localhost:8080/';
const userId = localStorage.getItem('id');

function loadMyAccommodation(){
	doFetch(prefixUrl + 'api/get_my_accommodations/'+userId, 'GET', headers, null)
		.then((json) => {
			console.log(json);
									
			const container = document.getElementById("latest_accommodations");
			displayAccommodationsCards(container, json, "No accommodations yet",false);
			displayPrices(json);
		})
		.catch((error) => {
			console.log(error);
		});
}

function loadHousesToAccept(){
	doFetch(prefixUrl + 'api/get_accommodationsdto_to_approve', 'GET', headers, null)
			.then((json) => {
				console.log(json);
										
				const container = document.getElementById("latest_accommodations");
				displayAccommodationsCards(container, json, "No accommodations to be approved",true);
			})
			.catch((error) => {
				console.log(error);
			});
}

