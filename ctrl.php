<?php
// ctrl //
include "connect.php";
include "dashboard_functions.php";


switch ($_POST['do']) {
	
	case 'getVideos':
		
		$videos=videos();
		$VAC=video_access_count();
		foreach($videos as $k=>$video){
			//$videos[$k]['watched']=rand(10,95);//percentage watched (by class)
			$videos[$k]['watched']=round($VAC[$video['id']]/500*100);//percentage watched (by class)
			$videos[$k]['duration_seconds']*=1;
		}
		echo json_encode($videos);
		exit;
		break;

	case 'getProblems':
		$data=problems();
		echo json_encode($data);
		exit;
		break;		

	default:
		print_r($_POST);
		die("error");
		break;
}

die("ctrl error");
