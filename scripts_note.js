function getXmlHttp() {
    var xmlhttp;

    try {
        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
    } catch(e) {
        try {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
return xmlhttp; 
}


function AddNote() {
	var error = document.getElementById('noteError');

	if(document.getElementById('noteTitle').value.trim().length == 0 || document.getElementById('noteDescription').value.trim().length == 0) {
		error.innerHTML = "The fields are empty";
		return;
	}
	else {
		error.innerHTML = "";
	}

	var req = getXmlHttp();
	if(req) {
	req.onreadystatechange = function() {
		if(req.readyState == 4) {
			if(req.status == 200) {
				var title = document.getElementById('noteTitle').value;
				var descr = document.getElementById('noteDescription').value;
				Draw(title, descr);
				$('#form').modal("hide");
				document.getElementById('noteTitle').value = "";
				document.getElementById('noteDescription').value= "";
			}
			else alert(req.statusText);
		}
	}
	req.open("POST", 'MainPHP.php', true)  // задать адрес подключения
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var params = "title=" + document.getElementById('noteTitle').value + "&description=" + document.getElementById('noteDescription').value + "&purp=newNote";
	req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


var titleOld = "";
var descrOld = "";
var noteOld;

function Draw (title, descr) {
	var note = document.createElement('div');
	var deleteNote = document.createElement('div');
	var noteTitle = document.createElement('p');
	var noteDescription = document.createElement('textarea');

	note.setAttribute('id', 'newNote');
	note.setAttribute('class', 'panel');
	deleteNote.setAttribute('title', 'Delete note');
	deleteNote.setAttribute('id', 'deleteNewNote');
	noteTitle.setAttribute('id', 'newNoteTitle');
	noteTitle.setAttribute('class', 'panel-heading text-center');
	noteDescription.setAttribute('id', 'newNoteDescription');
	noteDescription.setAttribute('class', 'panel-body');
	noteDescription.setAttribute('readonly', 'true');
	noteDescription.setAttribute('maxlength', '1000');
	noteDescription.setAttribute('title', 'Edit note');

	noteTitle.innerHTML = title;
	noteDescription.innerHTML = descr;

	note.appendChild(noteTitle);
	note.appendChild(deleteNote);
	note.appendChild(noteDescription);

	deleteNote.onclick = function() {
		var req = getXmlHttp();
		var that = this;
		if(req) {
			req.open("POST", 'MainPHP.php', true)  // задать адрес подключения
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params = "title=" + this.parentElement.children[0].innerHTML + "&description=" + this.parentElement.children[2].value + "&purp=deleteNote";
			req.send(params); // отослать запрос
			that.parentElement.parentElement.removeChild(that.parentElement);
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}

	noteDescription.ondblclick = function() {
		$('#formEdit').modal("show");
		titleOld = this.previousSibling.previousSibling.innerHTML;
		descrOld = this.innerHTML;
		document.getElementById('noteEditTitle').value = titleOld;
		document.getElementById('noteEditDescription').value = descrOld;
		noteOld = this.parentElement;
	}

	document.getElementById('AllNotes').appendChild(note);
}


function EditNote() {
	var error = document.getElementById('noteEditError');
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(document.getElementById('noteEditTitle').value.trim().length == 0 || document.getElementById('noteEditDescription').value.trim().length == 0) {
		error.innerHTML = "The fields are empty";
		return;
	}
	else {
		error.innerHTML = "";
	}

	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				if(req.status == 200) {
					noteOld.children[0].innerHTML = document.getElementById('noteEditTitle').value;
					noteOld.children[2].innerHTML = document.getElementById('noteEditDescription').value;
					$('#formEdit').modal("hide");
				}
				else alert(req.statusText);
			}
		}
		req.open("POST", 'MainPHP.php', true)
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var params = "title=" + document.getElementById('noteEditTitle').value + "&titleOld=" + titleOld + "&description=" + document.getElementById('noteEditDescription').value + "&descriptionOld=" + descrOld + "&purp=editNote";
		req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function ShowNotes() {
	IsAuthorized();

	var req = getXmlHttp();

	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					var noteJSON = req.responseText;
					var noteColl = JSON.parse(noteJSON);
					for(var i = 0; i < noteColl.length; i++) {
						Draw(noteColl[i].title, noteColl[i].description);
					}
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'MainPHP.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("purp=showNotes"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function IsAuthorized() {
	var req = getXmlHttp();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					if(req.responseText == "error") {
						location.replace("index.html");
					}
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'UserPHP.php', true);  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("purp=isAuthorized"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}

	setTimeout("IsAuthorized()", 1000);
}


function Logout() {
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(req) {	
		req.open("POST", 'UserPHP.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("purp=logout"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}