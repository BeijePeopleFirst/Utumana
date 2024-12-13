	
 function loadFavorites(){
	const userId = parseInt(localStorage.getItem("id"));

	let container = document.getElementById("container");

	doFetch(prefixUrl + 'api/favorites/' + userId, 'GET', headers, null)
		.then(favourites => {
			displayAccommodationsCards(container, favourites, "No favorites yet");
			displayPrices(favourites);
 		})
 }
 
 function getPrice(accommodation) {
	let priceRange = '';
		if(accommodation.min_price == null || accommodation.max_price == null){
			priceRange = "";
		} else if(accommodation.min_price == accommodation.max_price){
				if(accommodation.min_price == 0)
					priceRange = "free";
				else
					priceRange = "€" + accommodation.min_price.toFixed(2);
			} else {
				priceRange = "€" + accommodation.min_price.toFixed(2) + "-" + accommodation.max_price.toFixed(2);
			}
		return priceRange;
 }
 