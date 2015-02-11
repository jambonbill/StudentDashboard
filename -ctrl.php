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

	case 'heatmap'://heatmap minutes per day (vue calendar)
		$sql="SELECT date, SUM(minutes_on_site) AS minutes FROM minutes_per_day WHERE 1 GROUP BY date;";
		$q=$db->query($sql) or die( "Error:$sql");
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			$dat[]=['date'=>$r['date'],'minutes'=>+$r['minutes']];
		}
		echo json_encode($dat);
		exit;
		break;

	default:
		print_r($_POST);
		die("error");
		break;
}

die("ctrl error");
