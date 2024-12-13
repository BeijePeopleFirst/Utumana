
function loadBooking(){
	const params = new URLSearchParams(window.location.search);
	const accommodationId = params.get('accommodationId');
	
	let div;
	let elem;
	doFetch(prefixUrl + 'api/accommodation/' + accommodationId, 'GET', headers, null)
	 .then(accommodation => {	
		 
		 document.getElementsByClassName('loader')[0].remove();
		 	 
		 div = document.getElementById('accommodation');
		 
		 elem = document.createElement('img');
		 elem.src = accommodation.main_photo_url;
		 elem.alt = 'Accommodation main photo';
		 div.appendChild(elem);
		 
		 elem = document.createElement('h4');
		 elem.innerText = accommodation.title;
		 div.appendChild(elem);
		 
		 elem = document.createElement('p');
		 elem.innerText = accommodation.city + ', ' + accommodation.country;
		 div.appendChild(elem);
		 
		 elem = document.createElement('p');
		 elem.innerText = accommodation.rooms + (accommodation.rooms > 1 ? " rooms " : " room ") + 
			 			  accommodation.beds + (accommodation.beds > 1 ? " beds " : " bed ");
		 div.appendChild(elem);			 
		 
		 div = document.getElementById('booking');
		 
		 elem = document.createElement('label');
		 elem.innerText = 'Check-in: ';
		 div.appendChild(elem);
		 
		 elem = document.createElement('input');
		 elem.type = 'date';
		 elem.min = Date.now();
		 elem.id = 'checkIn';
		 elem.oninput = () => {
			 let enable = document.getElementById('checkOut');
			 if(enable.disabled != true) {
				 calcualtePrice(accommodation.id, document.getElementById('checkIn').value, document.getElementById('checkOut').value)
			     .then(finalPrice => {
					 if(isError(finalPrice)) {
	 					 if(document.getElementById('error')) document.getElementById('error').remove();
	 					 if(document.getElementById('price')) document.getElementById('price').remove();
						 elem = document.createElement('p');
						 elem.id = 'error';
						 elem.classList.add('error');
						 elem.innerText = finalPrice.message;
	 					 div.appendChild(elem);	
	 					 document.getElementById('book').disabled = true;
					 } else {
						 if(document.getElementById('price')) document.getElementById('price').remove();
						 if(document.getElementById('error')) document.getElementById('error').remove();
				         let price = document.createElement('p');
				         price.id = 'price';
				         price.innerHTML = 'Total price: ' + finalPrice + '€';
				         div.appendChild(price);
				         document.getElementById('book').disabled = false;
			         }
			     })
			     .catch(error => {
			         console.error('Error calculating price:', error);
			     });				 
			 } else {
			 	enable.disabled = false;
			 }
		 }
		 div.appendChild(elem); 
		 
		 elem = document.createElement('label');
		 elem.innerHTML = '<br>Check-out: ';
		 div.appendChild(elem);
		 
		 elem = document.createElement('input');
		 elem.type = 'date';
		 elem.min = Date.now();
		 elem.id = 'checkOut';
		 elem.disabled = 'disabled';
		 elem.oninput = () => {
		     calcualtePrice(accommodation.id, document.getElementById('checkIn').value, document.getElementById('checkOut').value)
		     .then(finalPrice => {
				 if(isError(finalPrice)) {
 					 if(document.getElementById('error')) document.getElementById('error').remove();
 					 if(document.getElementById('price')) document.getElementById('price').remove();
					 elem = document.createElement('p');
					 elem.id = 'error';
					 elem.classList.add('error');
					 elem.innerText = finalPrice.message;
 					 div.appendChild(elem);	
 					 document.getElementById('book').disabled = true;
				 } else {
					 if(document.getElementById('price')) document.getElementById('price').remove();
					 if(document.getElementById('error')) document.getElementById('error').remove();
			         let price = document.createElement('p');
			         price.id = 'price';
			         price.innerHTML = 'Total price: ' + finalPrice + '€';
			         div.appendChild(price);
			         document.getElementById('book').disabled = false;
		         }
		     })
		     .catch(error => {
		         console.error('Error calculating price:', error);
		     });
		 }
		 div.appendChild(elem);
		 
		 elem = document.createElement('p');
		 elem.innerHTML = 'By submitting this booking request, you accept to share your name,<br> surname and email with the accommodation\'s owner.';
		 div.appendChild(elem);
		 
		 elem = document.createElement('button');
		 elem.classList.add('button');
		 elem.innerText = 'Book';
		 elem.id = 'book';
		 elem.disabled = true;
		 elem.onclick = () => generateModal(accommodation.id);
		 div.appendChild(elem);
		 
		 elem = document.createElement('button');
		 elem.classList.add('button');
		 elem.innerText = 'Cancel';
		 elem.onclick = () => {window.history.back()};
		 div.appendChild(elem);		 
	})
}

function isError(json) {
	return json.message != undefined &&
		   json.status != undefined  &&
		   json.time != undefined ;
}

// booking.js

function generateModal(id) {
    const headers = createRequestHeaders();
    
    const modalContent = document.createElement('div');
    
    const checkInDate = new Date(document.getElementById('checkIn').value);
    const checkOutDate = new Date(document.getElementById('checkOut').value);
    const price = document.getElementById('price').textContent.substring(13);
    
    const detailsP = document.createElement('p');
    detailsP.innerHTML = `
    	<h2>Booking summary</h2>
        CHECK-IN: ${checkInDate.toDateString()}<br>
        CHECK-OUT: ${checkOutDate.toDateString()}<br>
        TOTAL PRICE: ${price}
    `;
    modalContent.appendChild(detailsP);
    
    let onConfirm = function() {
		doFetch(prefixUrl + 'api/book/' + id + '?checkIn=' + document.getElementById('checkIn').value + '&checkOut=' + document.getElementById('checkOut').value, 'POST', headers, null)
        .then(json => {
            if(isError(json)) {
                const errorP = document.createElement('p');
                errorP.id = 'error';
                errorP.classList.add('error');
                errorP.innerText = json.message;
                modalContent.appendChild(errorP);
            } else {
                const successP = document.createElement('p');
                successP.id = 'success';
                successP.classList.add('success');
                successP.innerText = "Booking request sent to the owner successfully";
                modalContent.appendChild(successP);
            }
        });	
        window.location.href = staticUrl + 'accommodation_details.html?id=' + id;
	}

	let onCancel = function () {
		console.log('Booking delete');
	}
    createModal(modalContent,onConfirm, 'green' , onCancel);
}

function calcualtePrice(accommodationId, checkIn, checkOut){
	const headers = createRequestHeaders();
	return doFetch(prefixUrl + 'api/calculate_price/'+accommodationId+'?checkIn=' + checkIn + '&checkOut=' + checkOut, 'GET', headers, null);
}

		
	