
 function getAllPhotos(){
	 const params = new URLSearchParams(window.location.search);
	 const id = params.get('accommodationId');
	 const container = document.getElementById('loadPhotos');

	doFetch(prefixUrl + 'api/accommodation/' +id, 'GET', headers, null)
	.then(accommodation => {
		let photos = document.getElementById('loadPhotos');
		photos.innerHTML = '';
		accommodation.photos.forEach(photo => {
			let img = document.createElement('img');
			img.src = photo.photo_url;
			img.alt = 'photo';
			container.appendChild(img);
		})
	})
	
	let btn = document.getElementById('btn');
	btn.onclick = () => {window.history.back()};

 }