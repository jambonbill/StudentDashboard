<?php
// ctrl //
include "connect.php";
include "dashboard_functions.php";


switch ($_POST['do']) {
	
	case 'getVideos':
		
		$videos=videos();
		foreach($videos as $k=>$video){
			$videos[$k]['duration_seconds']*=1;
		}
		echo json_encode($videos);
		exit;
		break;

	default:
		print_r($_POST);
		die("error");
		break;
}

die("ctrl error");
