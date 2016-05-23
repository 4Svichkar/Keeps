<?php
$con = new MongoClient();
$collection = $con -> keeps -> users;
$con -> close();

if($_POST['purp'] == "logIn") {
	$login = $_POST['login'];
	$pass = sha1($_POST['pass']);
	$user = $collection -> findOne(array('login' => $login));
	if($user['password'] === $pass) {
		$hash = sha1(generateCode());
		setcookie('id', $user["_id"], time()+15000);
		setcookie('hash', $hash, time()+15000);
		$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
		echo "ok";
	}
	else {
		echo "Login or password is wrong";
	}
}

if($_POST['purp'] == "registr") {
	$login = $_POST['login'];
	$pass = sha1($_POST['pass']);
	$userCheck = $collection -> findOne(array('login' => $login));
	if(!is_null($userCheck)) {
		echo "Profile exists. Choose another";
		exit();
	}
	$person = array("login" => $login, "password" => $pass);
	$collection -> insert($person);
	$user = $collection -> findOne(array("login" => $login));
	$hash = sha1(generateCode());
	setcookie('id', $user["_id"], time()+15000);
	setcookie('hash', $hash, time()+15000);
	$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
	echo "ok";
}

if($_POST['purp'] == "isAuthorized") {
	if(isset($_COOKIE['id']) && isset($_COOKIE['hash'])) {
		$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
		if($user['hash'] !== $_COOKIE['hash']) {
			echo "error";
		}
	}
	else {
		echo "error";
	}
}

if($_POST['purp'] == "logout") {
	setcookie('id', "", time()-5000);
	setcookie('hash', "", time()-5000);
}

function generateCode($length = 15) {
	$chars = "ZXCVBNMASDFGHJKLQWERTYUIOP1234567890xcvbnmasdfghjklqwertyuiop";
	$code = "";
	while (strlen($code) < $length) {
		$char = $chars[mt_rand(0, strlen($chars)-1)];
		$code .= $char;
	}
	return $code;
}
?>