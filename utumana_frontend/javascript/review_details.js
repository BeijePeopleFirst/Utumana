
let currentUrl = new URL(window.location.href);
let searchParams = currentUrl.searchParams;

let message = document.getElementById("message");

let encodedReviewObjString = searchParams.get("review");
let isFromProfile = searchParams.get("from_profile");
if(isFromProfile != null && isFromProfile != "") {
	let loader = document.createElement('div');
	loader.classList.add('loader');
	loader.style.top = '50%';
	document.getElementById('overall_rating_stars').appendChild(loader);
}

if(encodedReviewObjString == "" || encodedReviewObjString == null) {
	message.innerHTML = "No Valid Review";
	message.style.color = "red";
	console.error(new Error("No Valid Review was provided"));
}

let decodedReviewObjString = decodeURIComponent(encodedReviewObjString);

let review = JSON.parse(decodedReviewObjString);

let bookingID = review.bookingId;

//Review Fields:
//-----------------------------------------------------------------------------------
let titleTop = document.getElementById("review_title");
let title = document.getElementById("title_input_form");
let overallRating = document.getElementById("overallRating_input_form");
let comfort = document.getElementById("comfort_input_form");
let position = document.getElementById("position_input_form");
let convenience = document.getElementById("convenience_input_form");
let description = document.getElementById("description_input_form");
let descriptionMid = document.getElementById("description_field_mid_page");

//STARS GRAPHIC VISUALIZATION:
//*************************************************************************
let overallRatingStars = document.getElementById("overall_rating_stars");
let comfortStars = document.getElementById("comfort_stars");
let positionStars = document.getElementById("position_stars");
let convenienceStars = document.getElementById("convenience_stars");
//*************************************************************************
//-----------------------------------------------------------------------------------

let saveButton = document.getElementById("save_review_button");

async function init() {
	
	if(isFromProfile != null && isFromProfile != "") {
		saveButton.remove();
		console.log("INIZIO");
		
		await initializeReviewCorrectly(review.id)
		.then(res => {
			let rev = document.getElementsByClassName('loader')[0];
			if(rev) {
				rev.remove();
			}
			printError(res);
			review = res;
		})
		.catch(error => {
			message.innerHTML = error.message;
			console.error(error);
		});	
		
		console.log("FINE -> ", review);
	}

	
	titleTop.innerHTML = review.title;
	descriptionMid.innerHTML = review.description;
	
	title.value = review.title;
	overallRating.value = review.overallRating;
	comfort.value = review.comfort;
	position.value = review.position;
	convenience.value = review.convenience;
	description.value = review.description;
		
	initializeAllRatingCriteriaStars();
}

function initializeAllRatingCriteriaStars() {
	let overallRatingSTR = review.overallRating;
	let comfortRatingSTR = review.comfort;
	let positionRatingSTR = review.position;
	let convenienceRatingSTR = review.convenience;
	
	//Overall Rating Section:
	//#####################################################################
	starCreationSupport(overallRatingSTR, overallRatingStars);
	//#####################################################################
	
	
	//Comfort Rating Section:
	//#####################################################################
	starCreationSupport(comfortRatingSTR, comfortStars);
	//#####################################################################
	
	
	//Position Rating Section:
	//#####################################################################
	starCreationSupport(positionRatingSTR, positionStars);
	//#####################################################################
	
	
	//Convenience Rating Section:
	//#####################################################################
	starCreationSupport(convenienceRatingSTR, convenienceStars);
	//#####################################################################
				
}

function starCreationSupport(score, htmlElement) {
	for(let i = 0; i < 5; i++) {
			
		let starElement = document.createElement("span");
		starElement.innerHTML = "★";
		
		if(i === score - score % 1) {
			starElement.classList.add("star", "star-empty");
			//starElement.style.background = "linear-gradient(to right, gold " + ((score % 1) * 100) + "%, lightgray " + ((score % 1) * 100) + "%)";
		}
		else if(i < score - score % 1) {
			starElement.classList.add("star", "star-full");
		}
		else {
			starElement.classList.add("star", "star-empty");
		}
		
		htmlElement.appendChild(starElement);
	}
}

async function saveReview() {
	console.log(JSON.stringify(review));
	await doFetch(prefixUrl + "api/review", "POST", headers, JSON.stringify(review))
	.then(json => {
		console.log(json);
	})
	.catch(error => {
		message.innerHTML = error.message;
		console.error(error);
	});
	
	let booking = undefined;
	
	await doFetch(prefixUrl + "api/booking/" + bookingID, "GET", headers, null)
			.then(json => {
				booking = json;
			})
			.catch(error => {
				message.innerHTML = error.message;
				console.error(error);
			});
			
	await doFetch(prefixUrl + "api/review_by_booking_id/" + bookingID, "GET", headers, null)
			.then(json => {
				review = json;
				console.log("Found Review -> ", review);
			})
			.catch(error => {
				message.innerHTML = error.message;
				console.error(error);
			});
			
	//Now I set the review to the Booking Entity:
	booking["review"] = review;
	
	//Lets update the booking in the DataBase:
	await doFetch(prefixUrl + "api/booking_assign_review/" + bookingID, "PATCH", headers, JSON.stringify(booking))
			.then(json => console.log("Booking Updated into -> ", json))
			.catch(error => {
				message.innerHTML = error.message;
				console.error(error);
			});
	
	window.location.href = staticUrl + "my_booking_guest.html";
}

function initializeReviewCorrectly(id) {
		
	return doFetch(prefixUrl + "api/review/" + id, "GET", headers, null)
			.then(json => json)
			.catch(error => {
				message.innerHTML = error.message;
				console.error(error);
			});
	
	//console.log("STAMPO LA REVIEW -> ", tmp);
}

function getBackToEditing() {
	
	let url = undefined;
	
	if(isFromProfile == null || isFromProfile == "") {
		let reviewObjString = JSON.stringify(review);
		const encodedStringForURL = encodeURIComponent(reviewObjString);
		url = staticUrl + "review.html?from_details_review=" + encodedStringForURL;
	}
	else {
		url = staticUrl + "profile.html";
	}
	
	window.location.href = url;
}