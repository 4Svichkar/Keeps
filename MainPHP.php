<?php
$con = new MongoClient();
$collection = $con -> keeps -> noteColl;
$con -> close();

if($_POST['purp'] == "newNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$note = array('id' => $_COOKIE['id'], 'title' => $title, 'description' => $description);
	$collection -> insert($note);
}

if($_POST['purp'] == "deleteNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$params = array('justOne' => true);
	$note = array('title' => $title, 'description' => $description);
	$collection -> remove($note, $params);
}

if($_POST['purp'] == "editNote") {
	$titleOld = $_POST['titleOld'];
	$descriptionOld = $_POST['descriptionOld'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$collection -> update(array('title' => $titleOld, 'description' => $descriptionOld), array('$set' => array('title' => $title, 'description' => $description)), array('upsert' => false));
}

if($_POST['purp'] == "showNotes") {
	$noteArray = "[";
	$notes = $collection -> find(array('id' => $_COOKIE['id']));
	while($note = $notes -> getNext()) {
		$noteArray .= json_encode($note);
    	if($notes -> hasNext()) {
    		$noteArray .= ",";
    	}
	}
	$noteArray .= "]";
	echo $noteArray;
}
?>