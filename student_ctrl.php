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

	case 'getCalendar'://return calendar data
		//print_r($_POST);
		$student_id=$_POST['student_id']*1;
		$sql="SELECT date, minutes_on_site FROM minutes_per_day WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("error : $sql");
		$dat=[];
		while($r=$q->fetch(PDO::FETCH_ASSOC)){
			$dat[]=['date'=>$r["date"],'minutes'=>+$r["minutes_on_site"]];
		}
		echo json_encode($dat);
		exit;
		break;

	case 'getProblems':
		$data=problems();
		echo json_encode($data);
		exit;
		break;		

	case 'getProgressData':
		//print_r($_POST);
		$student_id=$_POST['student_id']*1;
		
		// all student problem attempts
		$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("Error:$sql");

		$problem_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			//print_r($r);
			$problem_attempts[$r['section']][$r['subsection']][]=$r;
		}

		// all student video attempts
		$sql="SELECT * FROM video_views WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("Error:$sql");

		$video_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			//print_r($r);
			$video_attempts[$r['section']][$r['subsection']][]=$r;
		}
		echo "var pas=".json_encode($problem_attempts).";";//problem attempts
		echo "var vas=".json_encode($video_attempts).";";//video attempts
		exit;
		break;

	default:
		print_r($_POST);
		die("error: unknow action");
		break;
}

die("ctrl error");
