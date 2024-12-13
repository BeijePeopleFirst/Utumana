
let message = document.getElementById("message");

function load_users() {
	let users = document.getElementById("users");
	let table = document.createElement("table");
	
	let header1 = document.createElement("th");
	header1.style.display = "none";
	
	let header2 = document.createElement("th");
	let header3 = document.createElement("th");
	let header4 = document.createElement("th");
	/*let header5 = document.createElement("th");
	let header6 = document.createElement("th");
	let header7 = document.createElement("th");
	let header8 = document.createElement("th");*/
	let header9 = document.createElement("th");
	
	header1.innerHTML = "ID";
	header2.innerHTML = "Name";
	header3.innerHTML = "Surname";
	header4.innerHTML = "Email";
	/*header5.innerHTML = "Bio";
	header6.innerHTML = "isAdmin";
	header7.innerHTML = "Profile picture URL";
	header8.innerHTML = "Rating";*/
	header9.innerHTML = "Operations";
	
	table.appendChild(header1);
	table.appendChild(header2);
	table.appendChild(header3);
	table.appendChild(header4);
	/*table.appendChild(header5);
	table.appendChild(header6);
	table.appendChild(header7);
	table.appendChild(header8);*/
	table.appendChild(header9);
	
	
	doFetch(prefixUrl + 'api/users', 'GET', headers, null)
			.then((json) => {
				document.getElementsByClassName('loader')[0].remove();
				if(Object.keys(json).length === 0) {
						users.innerHTML = "No Users where found";
						return;
					}
					else {
						
						//let id = undefined;
						let name = undefined; 
						let surname = undefined;
						let email = undefined;
						/*let bio = undefined;
						let isAdmin = undefined;
						let profilePic = undefined;
						let rating = undefined;*/
									
						
						//console.log(json);
						for(let usr of json) {
							
							let id = usr.id;
							name = usr.name;
							surname = usr.surname;
							email = usr.email;
							/*bio = usr.bio;
							isAdmin = usr.isAdmin;
							profilePic = usr.profilePictureUrl;
							rating = usr.rating;*/
							
							
							let row = document.createElement("tr");
							let col1 = document.createElement("td");
							col1.style.display = "none";
							//col1.innerHTML = "" + id;
							
							let idCont = document.createElement("div");
							idCont.id = "USER" + id;
							idCont.innerHTML = "" + id;
							col1.appendChild(idCont);
							
							row.appendChild(col1);
							
							let col2 = document.createElement("td");
							col2.innerHTML = "" + name;
							row.appendChild(col2);
							
							let col3 = document.createElement("td");
							col3.innerHTML = "" + surname;
							row.appendChild(col3);

							let col4 = document.createElement("td");
							col4.innerHTML = "" + email;
							row.appendChild(col4);

							/*let col5 = document.createElement("td");
							col5.innerHTML = "" + bio;
							row.appendChild(col5);

							let col6 = document.createElement("td");
							col6.innerHTML = "" + isAdmin;
							row.appendChild(col6);

							let col7 = document.createElement("td");
							col7.innerHTML = "" + profilePic;
							row.appendChild(col7);

							let col8 = document.createElement("td");
							col8.innerHTML = "" + rating;
							row.appendChild(col8);*/
							
							let col9 = document.createElement("td");
							
							//Buttons Container:
							//---------------------------------------------------------------------------
							let buttonCont = document.createElement("div");
							buttonCont.style.display = "flex";
							buttonCont.style.flexDirection = "row";
							
							//Buttons:
							//*************************************************************
							let resetPWDButton = document.createElement("button");
							resetPWDButton.innerHTML = "Reset Password";
							resetPWDButton.onclick = function() {
								
								resetPasswordSelectedUser(id);
								
							};
							buttonCont.appendChild(resetPWDButton);
							
							let editAccButton = document.createElement("button");
							editAccButton.innerHTML = "Edit User";
							editAccButton.onclick = function() {
								
								//editAccountSelectedUser((idCont.id).substring(4));
								editAccountSelectedUser(id);
								
							};
							buttonCont.appendChild(editAccButton);
							
							let deleteUserButton = document.createElement("button");
							deleteUserButton.innerHTML = "Delete User";
							deleteUserButton.onclick = function() {
								
								deleteSelectedUser(id);
								
							};
							buttonCont.appendChild(deleteUserButton);
							//*************************************************************
							
							col9.appendChild(buttonCont);
							//---------------------------------------------------------------------------
							
							row.appendChild(col9);

							table.appendChild(row);
						}
						
						users.appendChild(table);
					}
										
				
			})
			.catch((error) => {
				users.innerHTML="Error while retrieving users";
				console.log(error);
			});
	
}

/**
 * @param {Number} id
 */
function resetPasswordSelectedUser(id) {
	//localStorage.setItem("id_to_edit", id + "");
	location.href = staticUrl + "reset_user_password.html?id_to_edit=" + id;
}

/**
 * TODO
 * @param {Number} id
 */
function editAccountSelectedUser(id) {
	//localStorage.setItem("id_to_edit", id + "");
	location.href = staticUrl + "edit_user_account.html?id_to_edit=" + id;
}

/**
 * @param {Number} id
 */
function deleteSelectedUser(id) {
	let popup = document.createElement("div");
	popup.id = "popup-message";
	popup.style.textAlign = "center";
	popup.style.display = "flex";
	popup.style.flexDirection = "column";
	popup.style.width = "800px";
	popup.style.height = "350px";
	popup.style.backgroundColor = "rgb(120, 120, 120)";
	popup.style.zIndex = "1000";
	popup.style.top = "200px";
	popup.style.left = "300px";
	popup.style.position = "absolute";
	
	let text = document.createElement("p");
	text.style.justifyContent = "center";
	text.innerHTML = "Are you sure that you want to DELETE this User?";
	text.style.color = "white";
	text.style.paddingBottom = "100px";
	popup.appendChild(text);
	
	let cont2 = document.createElement("div");
	cont2.style.textAlign = "center";
	let btnCont = document.createElement("div");
	btnCont.style.display = "flex";
	btnCont.style.flexDirection = "row";
	let yesBtn = document.createElement("button");
	yesBtn.innerHTML = "YES";
	yesBtn.style.marginRight = "6px";
	yesBtn.onclick = function() {
		
		confirmedDeletion(id);
		
	};
	let noBtn = document.createElement("button");
	noBtn.innerHTML = "NO";
	noBtn.style.marginLeft = "6px";
	noBtn.onclick = abortedDeletion;
	btnCont.appendChild(yesBtn);
	btnCont.appendChild(noBtn);
	cont2.appendChild(btnCont);
	popup.appendChild(cont2);
		
	document.body.appendChild(popup);
}

function abortedDeletion() {
	let popup = document.getElementById("popup-message");
	popup.remove();
}

/**
 * @param {Number} id
 */
function confirmedDeletion(id) {
	
	//console.log("Targeted ID -> ", id);
	
	let body = {
		archived_timestamp : "timestamp",
		id : id,
	}
	
	doFetch(prefixUrl + 'api/user', 'PATCH', headers, JSON.stringify(body))
	.then(json => {console.log(json)})
	.catch(error => {
		console.error(error);
		message = document.getElementById("message");
		message.innerHTML = "Error while executing Request towards the Server";
		message.style.color = "red";
	});
}

function add_new_user(){
	location.href = staticUrl + "add_user.html";
}

function accept_houses(){
	location.href = staticUrl + "accept_houses.html";
}
	
function init() {
	load_users();
}