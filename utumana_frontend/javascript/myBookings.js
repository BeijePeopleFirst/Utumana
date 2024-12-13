/**
 * 
 */
const id = localStorage.getItem('id');

function load_bookings_guest(){
	load_bookings(prefixUrl+'api/myBookingGuest',false);
}

function load_bookings_host(){
	load_bookings(prefixUrl+'api/myBookingHost',true);
}

function load_bookings(apiUrl,isHost) {
	const container = document.getElementById("container");
	
	console.log(apiUrl);
	doFetch(apiUrl, 'GET', headers, null)
		.then((json) => {
			document.getElementsByClassName('loader')[0].remove();
			console.log(json);
			display_bookings(json,container,"No bookings as guest",isHost);
			})
		.catch((error) => {
			console.log(error);
		});
}

function display_bookings(json,container,noAccommodationsMessage,isHost){
		let element;
		if(json.length == 0){
			element = document.createElement("h2");
			element.innerHTML = noAccommodationsMessage;
			container.appendChild(element);
			return;
		}
		
		let row = document.createElement("tr");
		
		let bookingIDTh = document.createElement("th");
		bookingIDTh.style.display = "none";
		bookingIDTh.innerHTML = "BOOKING ID";
		row.appendChild(bookingIDTh);
		
		let accommodationth=document.createElement("th");
		accommodationth.colSpan=2;
		accommodationth.innerHTML = 'Accommodation';
		row.appendChild(accommodationth);
		
		let CheckInth=document.createElement("th");
		CheckInth.innerHTML = 'Check-in';
		row.appendChild(CheckInth);
		
		let checkOutth=document.createElement("th");
		checkOutth.innerHTML = 'Check-out';
		row.appendChild(checkOutth);
		
		let priceth=document.createElement("th");
		priceth.innerHTML = 'Price';
		row.appendChild(priceth);
				
		let statusth=document.createElement("th");
		statusth.innerHTML = 'Status';
		row.appendChild(statusth);
						
		let detailsth=document.createElement("th");
		detailsth.innerHTML = 'details';
		row.appendChild(detailsth);
		
		container.appendChild(row);
				
		for(let i=0; i<json.length; i++){
			display_booking(json[i],container,isHost);
		}
		
}

function display_booking(booking,container,isHost){
	//button accommodation details
	console.log(booking);
	let row = document.createElement("tr");
	
	let bookingIDTd = document.createElement("td");
	bookingIDTd.style.display = "none";
	bookingIDTd.innerHTML = "" + booking.id;
	console.log("STAMPO IL BOOKING -> ", booking.id);
	row.appendChild(bookingIDTd);
	
	let accommodationImagetd=document.createElement("td");
	
	let accommodationImage=document.createElement("img");
	
	accommodationImage.onclick = ()=>{
		getAccommodationDetails(booking.accommodationId)
	}
	accommodationImage.src=booking.accommodationMainPhotoURL;
	accommodationImage.style.width="100px";
	accommodationImage.alt = "";
	accommodationImagetd.appendChild(accommodationImage);
	
	row.appendChild(accommodationImagetd);
	
	let accommodationTitletd=document.createElement("td");
	accommodationTitletd.innerHTML = "" +booking.accommodationName;
	row.appendChild(accommodationTitletd);
	
	let checkIntd=document.createElement("td");
	checkIntd.innerHTML = "" +booking.checkIn;
	console.log("check in "+ booking.checkIn);
	row.appendChild(checkIntd);
		
	let checkOuttd=document.createElement("td");
	checkOuttd.innerHTML = "" +booking.checkOut;
	row.appendChild(checkOuttd);
			
	let pricetd=document.createElement("td");
	pricetd.innerHTML = "" +booking.price;
	row.appendChild(pricetd);
				
	let statustd=document.createElement("td");
	statustd.innerHTML = "" +booking.status;
	statustd.id="status"+booking.id;
	row.appendChild(statustd);
	
	let bookingActiontd=document.createElement("td");
	if(!isHost){		
			if(booking.status == "DONE" && (booking.reviewId == null || booking.reviewId == undefined)){
				
				let writeReviewButton=document.createElement("button");
				writeReviewButton.type="button";
				writeReviewButton.innerHTML = "Write Review";
				writeReviewButton.onclick = function() {
					openWriteReviewTab(bookingIDTd.innerHTML);
				}
				bookingActiontd.appendChild(writeReviewButton);
			}
	}else{
		if(booking.status == "PENDING"){
			let buttonsDiv = document.createElement("div");
			
			buttonsDiv.className = "right-button";
			buttonsDiv.id = 'button-div'+booking.id;

			createAcceptBookingButton(buttonsDiv,booking);
			createRejectBookingButton(buttonsDiv,booking);

			bookingActiontd.appendChild(buttonsDiv);
		}
	}
	row.appendChild(bookingActiontd);
	container.appendChild(row);
	
}

function createRejectBookingButton(buttonsDiv,booking){
	let button = document.createElement("button");
	button.type = "button";
	
	button.onclick = () => {
		    let modalContent = document.createElement('div');
			modalContent.innerHTML = '<h3>Reject Booking</h3>Are you sure you want to reject this booking?<br> ';
			
			let onConfirm = function() {
				rejectBooking(booking.id);
			}
			
			let onCancel = () => {}
			
			createModal(modalContent, onConfirm,'red', onCancel);
		};
	
	let image = document.createElement("img");
	image.className = "buttonImage";
	image.setAttribute("src", "./static/images/no.jpg");
	image.setAttribute("alt", "reject");
	button.appendChild(image);
	buttonsDiv.appendChild(button);
}

function createAcceptBookingButton(buttonsDiv,booking){
	let button = document.createElement("button");
	button.type = "button";
	
	button.onclick = () => {
	    let modalContent = document.createElement('div');
		modalContent.innerHTML = '<h3>Confirm this Booking</h3>Are you sure you want to confirm this booking?<br> ';
		
		let onConfirm = function() {
			acceptBooking(booking.id);
		}
		
		let onCancel = () => {}
		
		createModal(modalContent, onConfirm,'green', onCancel);
	};
		
	image = document.createElement("img");
	image.className = "buttonImage";
	image.setAttribute("src", "./static/images/yes.jpg");
	image.setAttribute("alt", "approve");
	button.appendChild(image);
	buttonsDiv.appendChild(button);
}

function acceptBooking(bookingId){
	manageBooking('/approve',bookingId);
}

function rejectBooking(bookingId){
	manageBooking('/reject',bookingId);
}

function manageBooking(action,bookingId){
			 
	doFetch(prefixUrl + 'api/manage_booking/'+bookingId+action, 'PATCH', headers, null)
	.then((json) => {
		printError(json);
		console.log(json);
		document.getElementById('status'+bookingId).innerHTML = "" +json.status;
		document.getElementById('button-div'+bookingId).remove();
	})
	.catch((error) => {
		console.log(error);
	});
}

function openWriteReviewTab(bookingID) {
	console.log("STAMPO -> ", bookingID);
	window.location.href = staticUrl + "review.html?booking_id=" + bookingID;
}

function getAccommodationDetails(accommodationId){
	window.location.href = staticUrl + 'accommodation_details.html?id=' + accommodationId;
}

