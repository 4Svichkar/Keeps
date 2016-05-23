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


function IsLoginCorrect() {
    var container = document.getElementById('authLoginError');
    var logVal = document.getElementById('authUsername').value;

    if(logVal.trim().length == 0) {
        container.innerHTML ='The field is empty';
        return false;
    }
    if(/\s/.test(logVal) === true) {
        container.innerHTML ='Login should not contain spaces';
        return false;
    }
    if(logVal.length < 6 || logVal.length > 15) {
        container.innerHTML ='Login must be between 6 and 15 characters';
        return false;
    }
    if(parseInt(logVal.substr(0, 1))) {
        container.innerHTML ='Login must begin with a letter';
        return false;
    }

    container.innerHTML = "";
    return true;
}


function IsPasswordCorrect() {
    var errorPass = document.getElementById('authPassError');
    var pass = document.getElementById('authPassword').value;
    
    if(pass.trim().length == 0) {
        errorPass.innerHTML = "The field is empty";
        return false;
    }
    if (pass.length < 8) {
        errorPass.innerHTML = "The password should be at least 8 characters";
        return false;        
    }

    errorPass.innerHTML = "";
    return true;
}


function LogIn() {
    if(!IsLoginCorrect() || !IsPasswordCorrect()) {
        return;
    }

    var btn = document.getElementById('logInBtn');
    btn.disabled = true;

    var errorPass = document.getElementById('authPassError');
    var req = getXmlHttp(); // создать объект для запроса к серверу
    if(req) {
        req.onreadystatechange = function() {
            if(req.readyState == 4) {  // если запрос закончил выполняться 
                if(req.status == 200) {
                    if(req.responseText != "ok") {
                        errorPass.innerHTML = req.responseText;
                        btn.disabled = false;
                    }
                    else {
                        location.replace("MainPage.html");
                    }
                }
                else alert(req.statusText);
            }
        }
        req.open("POST", 'UserPHP.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = "login=" + document.getElementById('authUsername').value + "&pass=" + document.getElementById('authPassword').value + "&purp=logIn";
        req.send(params); // отослать запрос
    }
    else {
        alert("Браузер не поддерживает AJAX");
    }
}


function SignUp() {
    if(!IsLoginCorrect() || !IsPasswordCorrect()) {
        return;
    }

    if(document.getElementById('authPassword').value != document.getElementById('regRepPassword').value) {
        document.getElementById('regPassRepError').innerHTML = "Passwords don't match";
        return;
    }
    else {
        document.getElementById('regPassRepError').innerHTML = "";
    }

    var btn = document.getElementById('signUpBtn');
    btn.disabled = true;

    var errorPass = document.getElementById('regPassRepError');
    var req = getXmlHttp(); // создать объект для запроса к серверу
    if(req) {
        req.onreadystatechange = function() {
            if(req.readyState == 4) {  // если запрос закончил выполняться 
                if(req.status == 200) {
                    if(req.responseText != "ok") {
                        errorPass.innerHTML = req.responseText;
                        btn.disabled = false;
                    }
                    else {
                        location.replace("MainPage.html");
                    }
                }
                else alert(req.statusText);
            }
        }
        req.open("POST", 'UserPHP.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var params = "login=" + document.getElementById('authUsername').value + "&pass=" + document.getElementById('authPassword').value + "&purp=registr";
        req.send(params); // отослать запрос
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
                    if(req.responseText != "error") {
                        location.replace("MainPage.html");
                    }
                }
                else alert(req.statusText);
            }   
        }

        req.open("POST", 'UserPHP.php', true)  // задать адрес подключения
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send("purp=isAuthorized"); // отослать запрос
    }
    else {
        alert("Браузер не поддерживает AJAX");
    }
}