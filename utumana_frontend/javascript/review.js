
let currentUrl = new URL(window.location.href);
let searchParams = currentUrl.searchParams;

let reviewId = (searchParams.get("current_review") != null && searchParams.get("current_review") != "") ? searchParams.get("current_review") : null;
let encodedReviewObjStringFromDetails = searchParams.get("from_details_review");
let decodedString = undefined;

if(encodedReviewObjStringFromDetails != null && encodedReviewObjStringFromDetails != "") {
	decodedString = decodeURIComponent(encodedReviewObjStringFromDetails);
}

let review = undefined;

let bookingId = undefined;
//let booking = undefined;

let message = document.getElementById("message");

let title = document.getElementById("review_title");
let description = document.getElementById("review_description");

//STARS:
//---------------------------------------------------------------------------
let comfortStar1 = document.getElementById("cstar1");
let comfortStar2 = document.getElementById("cstar2");
let comfortStar3 = document.getElementById("cstar3");
let comfortStar4 = document.getElementById("cstar4");
let comfortStar5 = document.getElementById("cstar5");

let positionStar1 = document.getElementById("pstar1");
let positionStar2 = document.getElementById("pstar2");
let positionStar3 = document.getElementById("pstar3");
let positionStar4 = document.getElementById("pstar4");
let positionStar5 = document.getElementById("pstar5");

let convenienceStar1 = document.getElementById("star1");
let convenienceStar2 = document.getElementById("star2");
let convenienceStar3 = document.getElementById("star3");
let convenienceStar4 = document.getElementById("star4");
let convenienceStar5 = document.getElementById("star5");
//---------------------------------------------------------------------------

function loadStarsSelection() {
	
	if(review == undefined) return;
	
	let comfort=review.comfort;
	
	if(comfort===1){
		comfortStar1.checked = "checked";
	}else if (comfort===2){
		comfortStar2.checked = "checked";
	}else if (comfort===3){
		comfortStar3.checked = "checked";
	}else if (comfort===4){
		comfortStar4.checked = "checked";
	}else if (comfort===5){
		comfortStar5.checked = "checked";
	}
	
	let position=review.position;
	if(position===1){
		positionStar1.checked = "checked";
	}else if (position===2){
		positionStar2.checked = "checked";
	}else if (position===3){
		positionStar3.checked = "checked";
	}else if (position===4){
		positionStar4.checked = "checked";
	}else if (position===5){
		positionStar5.checked = "checked";
	}
	
	let convenience=review.convenience;
	if(convenience===1){
		convenienceStar1.checked = "checked";
	}else if (convenience===2){
		convenienceStar2.checked = "checked";
	}else if (convenience===3){
		convenienceStar3.checked = "checked";
	}else if (convenience===4){
		convenienceStar4.checked = "checked";
	}else if (convenience===5){
		convenienceStar5.checked = "checked";
	}
	
}

async function init() {
	
	initHeader();
	
	if(reviewId !== null || decodedString != undefined) {
		
		if(reviewId !== null) {
			
			//Fetch (if present) the review:
			await doFetch(prefixUrl + "api/review/" + reviewId, "GET", headers, null)
						.then(json => {
							printError(json);
							review = json;
						})
						.catch(error => {
							message.innerHTML = "Error while retrieving the Review Entity  ^_^";
							message.style.color = "red";
							console.error(error);
						});
		}
		else {
			review = JSON.parse(decodedString);
		}
					
		bookingId = review.bookingId;
					
		//booking = fetchBookingEntity(bookingId);
		
		//Lets load all the stars into the current page:		
		loadStarsSelection();
		
		//Now we initialize the other fields:
		title.value = review.title;
		description.innerHTML = review.description;
	}
	else {
		
		try {
			bookingId = (searchParams.get("booking_id") != null && searchParams.get("booking_id") != "") ? searchParams.get("booking_id") : null;
			if(bookingId == null || bookingId == "") throw new Error("The Booking ID MUST be provided");
			
			//booking = fetchBookingEntity(bookingId);
		}
		catch(error) {
			message.innerHTML = error.message;
			console.error(error);
		}
	}
	
}

/*********************************************************************************************
async function fetchBookingEntity(bookingId) {
	let tmp = undefined;
	
	//Fetch the booking:
	await doFetch(prefixUrl + "api/booking/" + bookingId, "GET", HEADERS, null)
			.then(json => {
				tmp = json;
			})
			.catch(error => {
				message.innerHTML = "Error while retrieving the Booking Entity  ^o^";
				message.style.color = "red";
				console.error(error);
			});
			
	return tmp;
}
*********************************************************************************************/

function goToDetails() {
	
	let comfortValueUsr = undefined;
	let convenienceValueUsr = undefined;
	let positionValueUsr = undefined;
	
	try {
		//Check for comfort:
		//--------------------------------------------------------------------------------
		for(let i = 1; i < 6; i++) {
			console.log("Testo cstar" + i);
			if((document.getElementById("cstar" + i)).checked == "checked" || (document.getElementById("cstar" + i)).checked == true) {
				comfortValueUsr = i;
				console.log(document.getElementById("cstar" + i).checked);
				break;
			}
			console.log("escludo cstar" + i);
		}
		//--------------------------------------------------------------------------------
		
		//Check for convenience:
		//--------------------------------------------------------------------------------
		for(let i = 1; i < 6; i++) {
			if((document.getElementById("star" + i)).checked == "checked" || (document.getElementById("star" + i)).checked == true) {
				convenienceValueUsr = i;
				break;
			}
		}
		//--------------------------------------------------------------------------------
			
		//Check for position:
		//--------------------------------------------------------------------------------
		for(let i = 1; i < 6; i++) {
			if((document.getElementById("pstar" + i)).checked == "checked" || (document.getElementById("pstar" + i)).checked == true) {
				positionValueUsr = i;
				break;
			}
		}
		//--------------------------------------------------------------------------------
			
	
		if(title.value == "" || title.value == null) throw new Error("Title field must be provided");
		if(description.value == "" || description.value == null) throw new Error("Description field must be provided");
		if(comfortValueUsr == undefined) throw new Error("Comfort field must be provided");
		if(convenienceValueUsr == undefined) throw new Error("Convenience field must be provided");
		if(positionValueUsr == undefined) throw new Error("Position field must be provided");
				
	}
	catch(error) {
		message.innerHTML = error.message;
		console.error(error);
		message.style.color = "red";
		
		return;
	}
	
	let overallRating = (comfortValueUsr + convenienceValueUsr + positionValueUsr) / 3;
	
	let reviewObj = {
		bookingId : bookingId,
		title : title.value,
		description : description.value,
		comfort : comfortValueUsr,
		convenience : convenienceValueUsr,
		position : positionValueUsr,
		overallRating : overallRating,
	}
	
	let reviewObjString = JSON.stringify(reviewObj);
	const encodedStringForURL = encodeURIComponent(reviewObjString);
	const url = staticUrl + "review_details.html?review=" + encodedStringForURL;
	
	window.location.href = url;
}