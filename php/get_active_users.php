<?php

	require_once '../include/config.php';

	/* PDO + prepared statements */
	try
	{
		$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = $conn->prepare("SELECT B.username, C.name_sensors, A.input_bytes_sensors_data_size FROM tt_sensors_data_size A, users B, tt_sensors C WHERE A.date_sensors_data_size > (now() - interval 10 hour) AND B.unique_id = A.users_fk AND A.tt_sensors_fk = C.id_sensors");
		$sql->execute();

		// set the resulting array to associative
		$results = $sql->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($results);
	}
	catch(PDOException $e)
	{
		echo $sql . "<br />" . $e->getMessage();
	}

	$conn = null;

?>
