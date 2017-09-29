<?php

	require_once '../include/config.php';

	/* PDO + prepared statements */
	try
	{
		$conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = $conn->prepare("SELECT DISTINCT B.username FROM tt_sensors_data_size A, users B WHERE B.unique_id = A.users_fk");
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
