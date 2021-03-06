<?php

	require_once '../include/config.php';
	$input = json_decode(file_get_contents("php://input"));

	try
	{
		$m = new MongoClient(DB_MONGO_ADDRESS);
		$db = $m->typingTutor->multilux_Accel_test;

		// cast v int vrne napacne rezultate, ker so 13 mestne stevilke prevelike za php, zato uporaba floatval!
		$x = $db->find(array('exerciseIdentifier' => array('$regex' => $input->username . '.*'), "casovniZig" => array('$gt' => floatval($input->startTime), '$lt' => floatval($input->endTime))));

		// nekaksen vgrajeni foreach, brez zajebavanja
		echo json_encode(iterator_to_array($x));
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}

?>
