/**
 * 
 */
const id = localStorage.getItem('id');

//It tells if a Review Details popup is open already
let isAViewAlreadyOpen = false;

function load_user(){
		doFetch(prefixUrl+'api/user/'+id, 'GET', headers, null)
				.then((json) => {
					console.log(json);
					document.getElementsByClassName('loader')[0].remove();
					document.getElementById("user-name").innerHTML = json.name;
					document.getElementById("user-surname").innerHTML = json.surname;
					document.getElementById("user-email").innerHTML = json.email;
					document.getElementById("user-bio").innerHTML = json.bio;
					
					let profileImg = document.createElement('img');					
					profileImg.src = json.profilePictureUrl ? json.profilePictureUrl : 	"static/images/empty.png";	
					profileImg.alt = 'Profile Picture';
					profileImg.classList.add('profile-picture');
					document.getElementsByClassName('profile-container')[0].appendChild(profileImg);
					
					if(json.isAdmin){
						document.getElementById("admin-link").style.visibility = 'visible';
					}
					
					//do not use displayReviews the json does not have the reviews property
					let review;
					for(let i=0; i<json.reviews.length; i++){
						review = json.reviews[i];
						displayReview(review);
					}		
				})
				.catch((error) => {
					console.log(error);
				});
}

function loadReviews(){
	//removing all html then replace with review edited
	document.getElementById("reviews-container").textContent = '';
	doFetch(prefixUrl+'api/review/user/'+id, 'GET', headers, null)
	.then((json) => {
		console.log(json);
		printError(json);
		displayReviews(json)   			
	})
	.catch((error) => {
		console.log(error);
	});
}

function displayReviews(json){
	let review;
	for(let i=0; i<json.length; i++){
		review = json[i];
		displayReview(review);
	}
}

function displayReview(review){
    let reviewElement = document.createElement("div");
    reviewElement.className = "review";

    let reviewBodyElement = document.createElement("div");
    let starsElement = document.createElement("div");
    starsElement.className = "star-rating";
    let starsInsideDiv  = document.createElement("div");

    const fullStars = review.overall_rating - (review.overall_rating % 1);
    let span;
    span = createStarsReview(review);

     starsInsideDiv.appendChild(span);


    starsElement.appendChild(starsInsideDiv);
    reviewBodyElement.appendChild(starsElement);

    let paragraph = document.createElement("p");
    paragraph.innerHTML = "Title: " + review.title;
    reviewBodyElement.appendChild(paragraph);

    paragraph = document.createElement("p");
    paragraph.innerHTML = review.description;
    reviewBodyElement.appendChild(paragraph);

    reviewElement.appendChild(reviewBodyElement);
    
    let reviewActions = document.createElement("div");
    reviewActions.className = "right";

	if(review.approval_timestamp){
	            paragraph = document.createElement("p");
	            paragraph.className = "approved";
	            paragraph.innerHTML = "APPROVED";
	            reviewActions.appendChild(paragraph);
	        } else {
	            let buttonsDiv = document.createElement("div");
	            buttonsDiv.className = "right-button";
		createRejectReviewButton(buttonsDiv,review);
		createApproveReviewButton(buttonsDiv,review);
	            reviewActions.appendChild(buttonsDiv);
	        }
	        let br = document.createElement("br");
	        reviewActions.appendChild(br);
	        let button = document.createElement("button");
	        button.setAttribute("onclick", "getReview(" + review.id + ")");
	        button.innerHTML = "Details";
			/*button.onclick = function() {
			openReviewDetailsPage(review);*/
			button.onclick = async function() {
					//openReviewDetailsPage(review);
					
					if(isAViewAlreadyOpen) return;
					
					await openReviewDetailsPopup(review.id);
					
				}
		//}
	        reviewActions.appendChild(button);
	        reviewElement.appendChild(reviewActions);
	        document.getElementById("reviews-container").appendChild(reviewElement);
	
	
	}
		
	function createApproveReviewButton(buttonsDiv,review){
		let button = document.createElement("button");
		button.setAttribute("onclick", "approveReview(" + review.id + ")");
		
		button.onclick = () => {
			    let modalContent = document.createElement('div');
				modalContent.innerHTML = '<h3>Confirm this review</h3>Are you sure you want to confirm this review?<br> ';
				
				let onConfirm = function() {
					approveReview(review.id);
				}
				
				let onCancel = () => {}
				
				createModal(modalContent, onConfirm,'green', onCancel);
			};
		
		image = document.createElement("img");
		image.setAttribute("src", "./static/images/yes.jpg");
		image.setAttribute("alt", "approve");
		button.appendChild(image);
		buttonsDiv.appendChild(button);
	}
	
	function createRejectReviewButton(buttonsDiv,review){
		let button = document.createElement("button");
		button.setAttribute("onclick", "rejectReview(" + review.id + ")");
		
		button.onclick = () => {
				    let modalContent = document.createElement('div');
					modalContent.innerHTML = '<h3>Reject Review</h3>Are you sure you want to reject this review?<br> ';
					
					let onConfirm = function() {
						rejectReview(review.id);
					}
					
					let onCancel = () => {}
					
					createModal(modalContent, onConfirm,'red', onCancel);
				};
		
		let image = document.createElement("img");
		image.setAttribute("src", "./static/images/no.jpg");
		image.setAttribute("alt", "reject");
		button.appendChild(image);
		buttonsDiv.appendChild(button);
	
	
    /*reviewActions.appendChild(buttonsDiv);

    reviewElement.appendChild(reviewActions);
    
    document.getElementById("reviews-container").appendChild(reviewElement);*/
}

function openReviewDetailsPage(review) {
	let reviewObjString = JSON.stringify(review);
	let encodedString = encodeURIComponent(reviewObjString);
	window.location.href = staticUrl + "review_details.html?review=" + encodedString + "&from_profile=true";
}

function getReview(id){
	// fetch get review/id
	doFetch(prefixUrl + 'api/review/'+id, 'GET', headers, null)
		.then((json) => {
			console.log(json);
		})
		.catch((error) => {
			console.log(error);
	});
}

function approveReview(id){	 
	manageReview(id,'PATCH');
}

function rejectReview(id){
	manageReview(id,'DELETE');
}

function manageReview(id,method){
	doFetch(prefixUrl + 'api/review/'+id, method, headers, null)
	.then((json) => {
		console.log(json);
		printError(json);
		loadReviews();
	})
	.catch((error) => {
		console.log(error);
	});
}

function createStarsReview(review){
	let div = document.createElement('div');
	div.classList.add('star-rating');
	div.innerHTML = '<div class ="lable">'+ 'overall rating' + ': </div>';
	
	let rating = review.overallRating;
	
	let stars = document.createElement('div');
	let fullStars = rating - (rating % 1);
	for(let i = 1; i <= 5; i++) {
		if(i <= fullStars) {
			let full = document.createElement('span');
			full.classList.add('star');
			full.classList.add('star-full');
			full.innerText = '★'; //U+2605
			stars.appendChild(full);
		} else if(i == fullStars + 1) {
			let half = document.createElement('span');
			half.classList.add('star');
			half.classList.add('star-half');
			
			half.style.background = 'linear-gradient(to right, gold ' + (rating % 1) * 100 + '%, lightgray '+ (rating % 1) * 100 + '%)';
			half.style.webkitBackgroundClip = 'text';
			half.style.webkitTextFillColor = 'transparent';
			half.style.color = 'gold';
			
			half.innerText = '★'; //U+2605
			
			stars.appendChild(half);                          
		} else {
			let empty = document.createElement('span');
			
			empty.classList.add('star');
			empty.classList.add('star-empty');
			empty.innerText = '★'; //U+2605
			
			stars.appendChild(empty);
		}
	}
	
	div.appendChild(stars);
	
	return div;
}

async function openReviewDetailsPopup(reviewID) {
	
	isAViewAlreadyOpen = true;
	
	let fullReviewOBJ = undefined;
	let message = document.getElementById("message");
	
	await doFetch(prefixUrl + "api/review/" + reviewID, "GET", headers, null)
			.then(json => {
					printError(json);
					fullReviewOBJ = json;
				})
			.catch(error => {
				message.innerHTML = "" + error.message;
				message.style.color = "red";
				console.error(error);
			})
	
	
	let container = document.createElement("div");
	container.style.display = "flex";
	container.style.flexDirection = "column";
	container.id = "popup-review-content";
	container.style.textAlign = "center";
	container.style.zIndex = "1000";
	//container.style.position = "absolute";
	container.style.position = "fixed";
	//container.style.top = "200px";
	//container.style.left = "300px";
	container.style.top = "50%";
	container.style.left = "50%";
	container.style.transform = "translate(-50%, -50%)";
	container.style.backgroundColor = "rgb(120, 120, 120)";
	container.style.color = "#EBEBEB";
	container.style.border = "solid 6px green";
	
	//Top Title:
	let reviewTitle = document.createElement("p");
	reviewTitle.innerHTML = "" + fullReviewOBJ.title;
	reviewTitle.className = "review-title";
	container.appendChild(reviewTitle);
	
	//Stars:
	let ratingsContainer = document.createElement("div");
	ratingsContainer.className = "review-star";
	
	//Overall:
	let overall1 = document.createElement("div");
	overall1.className = "star-rating";
	let overallLabel = document.createElement("div");
	overallLabel.className = "lable";
	overallLabel.style.color = "#EBEBEB";
	overallLabel.innerHTML = "Overall Rating:";
	let overallStars = document.createElement("div");
	
	overall1.appendChild(overallLabel);
		
	
	//Comfort:
	let comfort1 = document.createElement("div");
	comfort1.className = "star-rating";
	let comfortLabel = document.createElement("div");
	comfortLabel.className = "lable";
	comfortLabel.style.color = "#EBEBEB";
	comfortLabel.innerHTML = "Comfort:";
	let comfortStars = document.createElement("div");

	comfort1.appendChild(comfortLabel);
	
	
	//Position:
	let position1 = document.createElement("div");
	position1.className = "star-rating";
	let positionLabel = document.createElement("div");
	positionLabel.className = "lable";
	positionLabel.style.color = "#EBEBEB";
	positionLabel.innerHTML = "Position:";
	let positionStars = document.createElement("div");

	position1.appendChild(positionLabel);
	
	
	//Convenience:
	let convenience1 = document.createElement("div");
	convenience1.className = "star-rating";
	let convenienceLabel = document.createElement("div");
	convenienceLabel.className = "lable";
	convenienceLabel.style.color = "#EBEBEB";
	convenienceLabel.innerHTML = "Convenience:";
	let convenienceStars = document.createElement("div");

	convenience1.appendChild(convenienceLabel);
	
	initializeAllRatingCriteriaStars(fullReviewOBJ, overallStars, comfortStars, positionStars, convenienceStars);
	overall1.appendChild(overallStars);
	comfort1.appendChild(comfortStars);
	position1.appendChild(positionStars);
	convenience1.appendChild(convenienceStars);
	
	ratingsContainer.appendChild(overall1);
	ratingsContainer.appendChild(comfort1);
	ratingsContainer.appendChild(position1);
	ratingsContainer.appendChild(convenience1);
		
	container.appendChild(ratingsContainer);
	
	//Mid page description:
	let descriptionMidPage = document.createElement("p");
	descriptionMidPage.innerHTML = fullReviewOBJ.description;
	container.appendChild(descriptionMidPage);
	
	
	//Close Button:
	let buttons = document.createElement("div");
	buttons.style.textAlign = "center";
	buttons.style.marginTop = "20px";
	
	let closeBTN = document.createElement("button");
	closeBTN.type = "button";
	closeBTN.onclick = function() {
		let page = document.getElementById("popup-review-content");
		isAViewAlreadyOpen = false;
		page.remove();
	}
	closeBTN.innerHTML = "CLOSE";
	buttons.appendChild(closeBTN);
	
	container.appendChild(buttons);
	
	//Append to the Document Body and display:
	document.body.appendChild(container);
}

function initializeAllRatingCriteriaStars(review, overall, comfort, position, convenience) {
	let overallRatingSTR = review.overallRating;
	let comfortRatingSTR = review.comfort;
	let positionRatingSTR = review.position;
	let convenienceRatingSTR = review.convenience;
	
	//Overall Rating Section:
	//#####################################################################
	starCreationSupport(overallRatingSTR, overall);
	//#####################################################################
	
	
	//Comfort Rating Section:
	//#####################################################################
	starCreationSupport(comfortRatingSTR, comfort);
	//#####################################################################
	
	
	//Position Rating Section:
	//#####################################################################
	starCreationSupport(positionRatingSTR, position);
	//#####################################################################
	
	
	//Convenience Rating Section:
	//#####################################################################
	starCreationSupport(convenienceRatingSTR, convenience);
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
	