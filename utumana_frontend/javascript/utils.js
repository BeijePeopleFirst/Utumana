const prefixUrl = 'http://localhost/';
const staticUrl = '';
const headers = createRequestHeaders();

function createRequestHeaders(){
	const myHeaders = new Headers();
	
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
	
	return myHeaders;
}

async function doFetch(url, method, headers, body){
	return fetch(url, {
			  method: method, 
			  headers: headers,
			  mode: "cors",
			  body: body
		}).then(async response => {
			if(response.status == 401) {
				let retryResponse = await retry(url, method, headers, body);
				if(retryResponse && retryResponse.ok){
					return retryResponse.json();
				} else throw Error("Fetch failed");
			}else {
				return response.json();
			}
		});
}

async function retry(url, method, headers, body){
	// try to refresh token
	let refreshed = await refreshToken();
	console.log("refreshed =",refreshed);
	if(!refreshed){
		console.log("Could not refresh token");
		
		logout();
		return;
	}
	
	// retry fetch
	headers.set("Authorization", "Bearer " + localStorage.getItem("token"));
	return fetch(url, {
		  method: method, 
		  headers: headers,
		  mode: "cors",
		  body: body
	});
}

async function refreshToken(){
	let refresh_token = null;
	let cookies = document.cookie.split("; ");
	console.log("document.cookie ", document.cookie, " cookies = ", cookies);
	for(let i=0; i<cookies.length; i++){
		if(cookies[i].indexOf("refresh_token") >= 0){
			refresh_token = '' + cookies[i].split("=")[1];
		}
	}
	console.log("Refresh token from cookie: ", refresh_token);
	if(refresh_token == null){
		console.log("Error: no refresh token");
		return false;
	}
	
	let refreshed;
	await fetch(prefixUrl + 'api/refresh_token', {
			  method: 'POST', 
			  headers: {"Content-Type": "application/json"},
			  body:	JSON.stringify({refresh_token: refresh_token})
		}).then(async response => {
			if(response.ok){
				let json = await response.json();
				console.log("Refresh ok. json = ", json);
				localStorage.setItem("token", json.token);
				document.cookie = "refresh_token=" + json.refresh_token + ";SameSite=None";
				refreshed = true;
			} else {
				refreshed = false;
			}
		});
	return refreshed;
}

function deleteCookies() {
	console.log(document.cookie);
    let allCookies = document.cookie.split(';');

    // The "expire" attribute of every cookie is 
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (let i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
            + new Date(0).toUTCString();

    console.log(document.cookie);
}

function logout() {
	sessionStorage.clear();
	localStorage.clear();
	deleteCookies();
	window.location.href= staticUrl + "login.html";
}

function initHeader() {
		let header = document.getElementById("header");
		let nav = document.createElement("nav");
		let a1 = document.createElement("a");
		a1.href = "./home.html";
		a1.innerHTML = "Home";
		nav.appendChild(a1);
		
		let a2 = document.createElement("a");
		a2.href = "#";
		a2.innerHTML = "Notifications";
		nav.appendChild(a2);

		let a3 = document.createElement("a");
		a3.href = "./favorites.html";
		a3.innerHTML = "Favorites";
		nav.appendChild(a3);

		let a4 = document.createElement("a");
		//a4.href = "./post_accommodation.html";
		a4.href = "./post_intro.html";
		a4.innerHTML = "Post";
		nav.appendChild(a4);

		let a5 = document.createElement("a");
		a5.href = "./my_booking_guest.html";
		a5.innerHTML = "My Bookings";
		nav.appendChild(a5);

		let a6 = document.createElement("a");
		a6.href = "./profile.html";
		a6.innerHTML = "Profile";
		nav.appendChild(a6);

		let a7 = document.createElement("a");
		a7.href = "./login.html";
		a7.innerHTML = "Logout";
		a7.onclick = logout;
		nav.appendChild(a7);
		
		header.appendChild(nav);
}

function isError(json) {
	return json.message != undefined &&
		   json.status != undefined  &&
		   json.time != undefined ;
}

function printError(json){
	if(isError(json)){
		let message = document.getElementById("message");
							
		if(message){
			message.innerHTML = json.message;
		}
		throw Error(json.message);
	}
}

function displayAccommodationsCards(container, json, noAccommodationsMessage){
	container.innerHTML = '';
	
	let element;
	if(json.length == 0){
		element = document.createElement("h2");
		element.innerHTML = noAccommodationsMessage;
		container.appendChild(element);
		return;
	}
	
	let button, div, priceRange;
	for(let i=0; i<json.length; i++){		
		button = document.createElement("button");
		button.setAttribute("onclick", "getAccommodationDetails(" + json[i].id + ")");
		
		div = document.createElement("div");
		div.className = "accommodation-card";
		div.id="accommodation"+json[i].id;
		
		element = document.createElement("img");
		element.setAttribute("src", json[i].main_photo_url);
		element.setAttribute("alt", "Accommodation main photo");
		div.appendChild(element);
		
		element = document.createElement("h4");
		element.innerHTML = json[i].title;
		div.appendChild(element);
		
		element = document.createElement("p");
		let locationInfo = '';
		if(json[i].city != null)
			locationInfo = json[i].city + ", ";
		element.innerHTML = locationInfo + json[i].country;
		div.appendChild(element);
		
		element = getHeart(json[i].is_favourite, json[i].id);
		element.style.position = 'absolute';
		element.style.top = '2%';
		element.style.right = '2%';		
		element.addEventListener('click', function(event) {
            event.stopPropagation(); 
        });
        div.appendChild(element);

		button.appendChild(div);
		container.appendChild(button);
	}
}

function getAccommodationDetails(id){
	window.location.href = staticUrl + 'accommodation_details.html?id=' + id;
}

function displayPrices(json){
	loadedAccommodationIndexs = [];
	json.forEach((accommodation)=> {
			loadedAccommodationIndexs.push(accommodation.id);
	});
		
	doFetch(prefixUrl+ 'api/prices?ids='+loadedAccommodationIndexs,'GET',headers,null)
			.then((json) =>
			{
				createPricesHTML(json);
			})
}

function createPricesHTML(prices){
	for(let i =0 ;i<prices.length;i++){	
		element = document.createElement("span");
				if(prices[i].min_price == null || prices[i].max_price == null){
					priceRange = "";
				} else if(prices[i].min_price == prices[i].max_price){
						if(prices[i].min_price == 0)
							priceRange = "free";
						else
							priceRange = "&euro;" + prices[i].min_price.toFixed(2);
					} else {
						priceRange = "&euro;" + prices[i].min_price.toFixed(2) + "-" + prices[i].max_price.toFixed(2);
					}
				element.innerHTML = priceRange;
				document.getElementById("accommodation"+prices[i].accommodation_id).appendChild(element);
	}
}
	
function getHeart(isFavorite, id) {
	const userId = parseInt(localStorage.getItem("id"));
    let heart = document.createElement('button');
    heart.classList.add('inline-child');
    heart.id = 'heart';
    
    heart.innerHTML = isFavorite ? '<img style="height: 30px; width: 30px; box-shadow: none;" src="icons/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.svg" alt="remove from favourites" />' 
    							 : '<img style="height: 30px; width: 30px; box-shadow: none;" src="icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="add to favourites" />';
    
    heart.onclick = () => {
        isFavorite = !isFavorite;
        
     heart.innerHTML = isFavorite ? '<img style="height: 30px; width: 30px; box-shadow: none;" src="icons/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.svg" alt="remove from favourites" />' 
    							 : '<img style="height: 30px; width: 30px; box-shadow: none;" src="icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="add to favourites" />';
       
        if (isFavorite) {
			doFetch(prefixUrl + 'api/add-favourite/' + userId + '/' + id, 'PATCH', headers, null)
			    .then(response => {
			        console.log('Aggiunto ai preferiti');
			    })
			    .catch(error => {
			        console.error('Errore nell\'aggiunta ai preferiti', error);
			    });
        } else {
            doFetch(prefixUrl + 'api/remove-favourite/' + userId + '/' + id, 'PATCH', headers, null)
			    .then(response => {
			        console.log('Rimosso dai preferiti');
			    })
			    .catch(error => {
			        console.error('Errore nella rimozione dai preferiti', error);
			    });
        }
    };
    
    return heart;
}

