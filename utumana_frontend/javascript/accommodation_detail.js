
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

document.addEventListener('DOMContentLoaded', () => getAccommodationDetail(id));

const userId = parseInt(localStorage.getItem("id"));

 function getAccommodationDetail(id) {	 
	let isRejected = params.get('rejected');
	let endpoint;
	if(isRejected != null && isRejected == "true"){
		endpoint = 'api/rejected_accommodation/'
	} else{
		endpoint = 'api/accommodation/';
	}
	
	
	doFetch(prefixUrl + endpoint + id, 'GET', headers, null)
	.then(json => {
		
		document.getElementsByClassName('loader')[0].remove();
		
		let top = document.getElementById("top");
		let title = document.getElementById("title");
		
		title.innerHTML = json.title;
		document.title = json.title;
		
		doFetch(prefixUrl + 'api/accommodation_info/' + json.id,'GET', headers, null)
			.then(info => {
				let isFavorite = info.isFavourite;
				
				let heart = getHeart(isFavorite);
				top.appendChild(heart);				

			});
		
		let generalInfo = document.getElementById("generalInfo");
		let p = document.createElement('p');
		p.innerText = json.city + ', ' + json.province + ', ' + json.country;

		generalInfo.appendChild(p);
		 
		let photos = document.getElementById("photos");
				 
		if(json.photos) {
			 let left = document.createElement('div');
			 left.classList.add('left-image');
			 left.style.backgroundImage = 'url('+json.main_photo_url + ')';
			 photos.appendChild(left);
			 
			 let right = document.createElement('div');
			 right.classList.add('right-grid');
			 
			 let rightPhotos = json.photos.slice(1,5);
			 
			 rightPhotos.forEach(photo => {
			 	 let imgDiv = document.createElement('img');
			 	 imgDiv.src =  photo.photo_url;
			 	 imgDiv.alt = 'Accommodation photo';
				 right.appendChild(imgDiv);
				 photos.appendChild(right);
			 });
			 

			 let morePhoto = document.getElementById('morePhotos');
			 morePhoto.href = 'all_photos.html?accommodationId=' + json.id;
			 morePhoto.style.fontStyle = 'italic';

		 }
		 
		 let rooms = document.getElementById("rooms");
		 
		 if(json.rooms && json.beds) {
			 let p = document.createElement('p');
			 p.innerHTML = json.rooms + (json.rooms > 1 ? " rooms " : " room ") + 
			 			   json.beds + (json.beds > 1 ? " beds " : " bed ");		 			   
			 rooms.appendChild(p);
		 }
		 
		 let description = document.getElementById("description");
		 
		 if(json.description) {
			 let des = document.createElement('div');
			 des.innerHTML = json.description;
			 description.appendChild(des);
		 }
		 
		 let services = document.getElementById("services");
		 
		 if(json.services) {		 
			 json.services.forEach(service => {
	 			 let div = document.createElement('div');
				 div.classList.add('inline');
				 	 
				 let img = document.createElement('img');
			 	 img.src = service.icon_url;
			 	 img.alt = 'service icon';
			 	 img.classList.add('icon');
			 	 
			 	 let title = document.createElement('span');
			 	 title.classList.add('inline-child');
			 	 title.innerHTML = service.title;
			 	 
			 	 div.appendChild(img);
			 	 div.appendChild(title);
			 	 
			 	 services.appendChild(div);
			 }); 
		 } else {
			 let noSer = document.createElement('p');
			 noSer.innerText = "No services";
			 services.appendChild(noSer);
		 }
		 
		 let calendar = document.getElementById('calendar');
	 	 let now = new Date(Date.now());
	 	 console.log("year: " + now.getFullYear());
	 	 console.log("month: " + now.getMonth());
		 getCalendar(calendar, now.getFullYear(), now.getMonth());
		 
		 let buttons = document.getElementById("buttons");
		 buttons.id = 'buttons';
		 
		 if(!json.approval_timestamp) { //accomodation not approved yet	
			doFetch(prefixUrl + 'api/accommodation_info/' + json.id, 'GET', headers, null)
			.then(info => {
				 if (info.isAdmin == true) {
		            let approve = createApproveButton(json);
		            buttons.appendChild(approve);
		            
		            let reject = createRejectButton(json);
					buttons.appendChild(reject);
												
		        } else if(info.isOwner == true) {
					buttons.innerHTML = "<p>Waiting for approval by the admin.</p>";
				}
		    })
		    .catch(error => {
		        console.error('Admin check failed:', error);
		    });
			} else { // accommodation is already approved
				doFetch(prefixUrl + 'api/accommodation_info/' + json.id, 'GET', headers, null)
				.then(info => {
					if(info.isAdmin == true) { //admin
						buttons.innerHTML = "<p>Accommodation approved on: " + json.approvalTimestamp + "</p>"
					
						if(info.isOwner == false) { // admin but non owner
							if(info.hasPendingBooking || info.hasAcceptedBooking) {
								let div = document.createElement('div');
								div.id = 'cancel';
								div.classList.add('inline');
								
								buttons.appendChild(div);
								
								let span = document.createElement('span');
								span.classList.add('inline-child');
								span.textContent = info.hasPendingBooking == true? 
													"Waiting for the host to accept your booking request. " :
													"Your booking request was accepted. Please wait until after your stay to make a new booking";
								
								div.appendChild(span);
								
								let cancelButton = createCancelButton(json, info.bookingId);
								div.appendChild(cancelButton);
							} else {
								let bookButton = createBookButton(json);
								buttons.appendChild(bookButton);							
							}		
						} else if(info.isOwner == true) { // admin and owner
							let editButton = createEditButton(json.id, "post_intro.html", 'Edit info');
							document.getElementById("description").appendChild(editButton);
							
							editButton = createEditButton(json.id, "post_services.html", 'Edit services');
							document.getElementById("services").appendChild(editButton);
							
							editButton = createEditButton(json.id, "post_address.html", 'Edit address');
							document.getElementById("generalInfo").appendChild(editButton);
							
							editButton = createEditButton(json.id, "post_availabilities.html", 'Edit availability');
							document.getElementById("edit_av").appendChild(editButton);						
						}
					
					let deleteButton = createDeleteButton(json);
					buttons.appendChild(deleteButton);
					
				} else { // not admin					
					if(info.isOwner == true) { // not admin but owner
						buttons.innerHtml = '<p>Accommodation approved on:' + info.approval +'</p>';
						
						let editButton = createEditButton(json.id, "post_intro.html", 'Edit info');
						document.getElementById("description").appendChild(editButton);
						
						editButton = createEditButton(json.id, "post_services.html", 'Edit services');
						document.getElementById("services").appendChild(editButton);
						
						editButton = createEditButton(json.id, "post_address.html", 'Edit address');
						document.getElementById("generalInfo").appendChild(editButton);
						
						editButton = createEditButton(json.id, "post_availabilities.html", 'Edit availability');
						document.getElementById("edit_av").appendChild(editButton);	
						
						let deleteButton = createDeleteButton(json);
						buttons.appendChild(deleteButton);
					} else { // not admin not owner
						if(info.hasPendingBooking || info.hasAcceptedBooking) {
							let div = document.createElement('div');
							div.id = 'cancel';
							div.classList.add('inline');
							
							buttons.appendChild(div);
							
							let span = document.createElement('span');
							span.classList.add('inline-child');
							span.id = 'status';
							span.textContent = info.hasPendingBooking == true? 
												"Waiting for the host to accept your booking request. " :
												"Your booking request was accepted. Please wait until after your stay to make a new booking";
							
							div.appendChild(span);
							
							let cancelButton = createCancelButton(json, info.bookingId);
		                	div.appendChild(cancelButton);
								
						} else {
							let bookButton = createBookButton(json);
							buttons.appendChild(bookButton);							
						}
					}
				}
					
				let reviews = document.getElementById("reviews");
				let rev = document.createElement('div');
				rev.classList.add('reviews');
				if(info.reviews.length == 0){
					let noRev = document.createElement('p');
					noRev.innerHTML = 'No reviews yet.';
					reviews.appendChild(noRev);
				} else {
					info.reviews.forEach(review => {
						let div = document.createElement('div');
						div.classList.add('text');
						div.classList.add('review');
						div.classList.add('inline');
						
						div.innerHTML = '<p class="review-title">'+ review.title +'</p>';
						
						let overall = createStarsReview(review, 'Overall');
						let comfort = createStarsReview(review, 'Comfort');
						let position = createStarsReview(review, 'Position');
						let convenience = createStarsReview(review, 'Convenience');
						
						div.appendChild(overall);
						div.appendChild(comfort);
						div.appendChild(position);
						div.appendChild(convenience);
						
						rev.appendChild(div);
					});
					reviews.appendChild(rev);
				}
				
			})			
		}
		
	})
}
			
function createBookButton(json){
	let bookButton = document.createElement('button');
	bookButton.textContent = 'Book';
	bookButton.classList.add('button');
	bookButton.onclick = () => {
   		window.location.href = staticUrl + 'booking.html?accommodationId=' + json.id;
	};
	
	return bookButton;
}

function createCancelButton(json, bookingId) {
	let cancelButton = document.createElement('button');
	cancelButton.textContent = 'Cancel Booking';
	cancelButton.classList.add('button');
	cancelButton.onclick = () => {
		let modalContent = document.createElement('div');
		modalContent.innerHTML = '<h3>Confirm booking cancel</h3>Are you sure you want to cancel this booking?<br> ';
		
		let onConfirm = function() {
			doFetch(prefixUrl + 'api/delete_booking/' + bookingId,'DELETE', headers, null);
			document.getElementById('cancel').remove();
			let buttonToRemove = document.getElementById('delete');
			if(buttonToRemove != null) buttonToRemove.remove();
			document.getElementById('buttons').appendChild(createBookButton(json));
			document.getElementById('buttons').appendChild(createDeleteButton(json));
		}
		
		let onCancel = function() {
			console.log('Booking delete');
		}
		
		createModal(modalContent, onConfirm,'red', onCancel);
	}
	return cancelButton;
}

function createDeleteButton(json) {
	let deleteButton = document.createElement('button');
	deleteButton.id = 'delete';
	deleteButton.classList.add('button');
	deleteButton.textContent = "Delete";
	deleteButton.onclick = () => {
		let modalContent = document.createElement('div');
		modalContent.innerHTML = '<h3>Confirm Delete Accommodation</h3>Are you sure you want to delete this accommodation?<br> ';
		
		let onConfirm = function() {
			doFetch(prefixUrl + 'api/delete_accommodation/' + json.id,'DELETE', headers, null);
			window.location.href = staticUrl + 'home.html';
		}
		
		let onCancel = () => {}
		
		createModal(modalContent, onConfirm,'red', onCancel);
	};
	
	return deleteButton;
}

function createEditButton(id, htmlFileName, buttonText) {
	let editButton = document.createElement('button');
	editButton.textContent = buttonText;
	editButton.classList.add('button');
	editButton.onclick = () => {
		window.location.href= staticUrl + htmlFileName + '?id=' + id;
	};	
	
	return editButton;
}

function createApproveButton(json) {
	let approve = document.createElement('button');
    approve.textContent = 'Approve';
    approve.classList.add('button');
    approve.onclick = () => {
		let body = JSON.stringify({
		    id: json.id,
		    ownerId: json.ownerId,
		    approvalTimestamp: new Date(Date.now()).toISOString()
		});
        
        let modalContent = document.createElement('div');
		modalContent.innerHTML = '<h3>Confirm Approve Accommodation</h3>Are you sure you want to approve this accommodation?<br> ';
		
		let onConfirm = function() {
	        doFetch(prefixUrl + 'api/update_accommodation/', 'PATCH', headers, body)
	        .then(result => {
	            console.log('Approved:', result);
	        })
	        .catch(error => {
	            console.error('Approval error:', error);
	        });
		}
		
		let onCancel = () => {}
		
		createModal(modalContent, onConfirm,'green', onCancel);
	};
    return approve;
}			

function createRejectButton(json) {
	let reject = document.createElement('button');
	reject.classList.add('button');
    reject.textContent = 'Reject';
    reject.onclick = () => {
        let modalContent = document.createElement('div');
		modalContent.innerHTML = '<h3>Confirm Reject Accommodation</h3>Are you sure you want to reject this accommodation?<br> ';
		
		let onConfirm = function() {
			doFetch(prefixUrl + 'api/delete_accommodation/' + json.id, 'DELETE', headers, null)
	        .then(result => {
	            console.log('Reject:', result);
	        })
	        .catch(error => {
	            console.error('Reject error:', error);
	        });
	        window.location.href = staticUrl + 'home.html';
		}
		
		let onCancel = () => {}
		
		createModal(modalContent, onConfirm,'red', onCancel);
    };
	
	return reject;
}

function createStarsReview(review, type = new String()){
	let div = document.createElement('div');
	div.classList.add('star-rating');
	div.innerHTML = '<div class ="lable">'+ type + ': </div>';
	
	let rating = null;
	
	switch(type) {
		case "Overall": 
			rating = review.overallRating;
			break;
		case "Comfort":
			rating = review.comfort;
			break;
		case "Position":
			rating = review.position;
			break;
		case "Convenience":
			rating = review.convenience;
			break;
	}
	
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

function getHeart(isFavorite) {
    let heart = document.createElement('button');
    heart.classList.add('inline-child');
    heart.id = 'heart';
    
    heart.innerHTML = isFavorite ? '<img src="static/icons/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.svg" alt="remove from favourites" />' 
    							 : '<img src="static/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="add to favourites" />';
    
    heart.onclick = () => {
        isFavorite = !isFavorite;
        
     heart.innerHTML = isFavorite ? '<img src="static/icons/favorite_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.svg" alt="remove from favourites" />' 
    							 : '<img src="static/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="add to favourites" />';
       
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
