<?php
// ctrl //
include "connect.php";
include "dashboard_functions.php";

if(!isset($_POST['do']))//debug
{
	$_POST['do']='getDailyData';
	$_POST['student_id']=460;
	echo "<pre>";
}

switch ($_POST['do']) {
	
	case 'getVideos'://list of videos
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

	case 'getCalendar'://return calendar data (heatmap etc)
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

	
	case 'getProblems'://list of problems
		$data=problems();
		echo json_encode($data);
		exit;
		break;		

	
	case 'getStudentOverview':
		$data=[];
		$data['progress_problem']=rand(1,100);
		$data['video_problem']=rand(1,100);
		$data['course_start']="2018-09-15";
		$data['sessions']=rand(1,60);
		echo json_encode($data);
		exit;
		break;		

	case 'getProgressData':
		//print_r($_POST);
		$student_id=$_POST['student_id']*1;
		
		// all student problem attempts
		$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id ORBER BY section,subsection;";
		$q=$db->query($sql) or die("Error:$sql");

		$problem_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			//print_r($r);
			$problem_attempts[$r['section']][$r['subsection']][]=$r;
		}

		// all student video attempts
		$sql="SELECT * FROM video_views WHERE student_id=$student_id ORDER BY section, subsection;";
		$q=$db->query($sql) or die("Error:$sql");

		$video_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			//print_r($r);
			$video_attempts[$r['section']][$r['subsection']][]=$r;
		}
		//echo "problem_attempts:";print_r($problem_attempts);
		//echo "video_attempts  :";print_r($video_attempts);exit;
		echo "var pas=".json_encode($problem_attempts).";";//problem attempts
		echo "var vas=".json_encode($video_attempts).";";//video attempts
		exit;
		break;


	case 'getWeeklyProgress'://return a simplified version of problem and video progress, per week
		
		$weekly=[];
		$student_id=$_POST['student_id']*1;
		
		//all problems count per week
		$problems=problemCount();
		//print_r($problems);
		foreach($problems as $section=>$r){
			foreach($r as $subsection=>$count){
				$weekly["$section"]["$subsection"]["problemcount"]=$count*1;	
			}
		}	

		// all student problem attempts
		$sql="SELECT section, subsection, COUNT(*) as done, SUM(score) as score FROM problem_attempts ";
		$sql.="WHERE student_id=$student_id GROUP BY subsection ORDER BY section;";
		$q=$db->query($sql) or die("Error:$sql");

		$problem_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			$weekly[$r['section']][$r['subsection']]["problemdone"]=$r['done']*1;
			$weekly[$r['section']][$r['subsection']]["problemscore"]=$r['score']*1;
		}
		
		//print_r($weekly);exit;

		// all student video attempts
		$sql="SELECT * FROM video_views WHERE student_id=$student_id ORDER BY section;";
		$q=$db->query($sql) or die("Error:$sql");
		$video_attempts=[];
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			if($r['duration_seconds']){
				$pct=round($r['watched_seconds']/$r['duration_seconds']*100);	
			}else{
				$pct=0;
			}
			
			$video_attempts[$r['section']][$r['subsection']][$r['video_id']]=$pct;
		}
		
		foreach($video_attempts as $week =>$r){
			foreach($r as $subsection=>$data){
				$weekly["$week"]["$subsection"]["videopct"]=round(array_sum($data)/count($data));
			}
		}
		ksort($weekly);
		//print_r($weekly);exit;
		echo json_encode($weekly);
		exit;
		break;

	case 'getDailyData':
		$student_id=$_POST['student_id']*1;		
		$daily=[];

		$sql="SELECT * FROM minutes_per_day WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("Error:$sql");
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			$date=$r['date'];
			@$daily[$date]["minutes_on_site"]=$r['minutes_on_site']*1;
		}
		
		$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("Error:$sql");
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			$date=$r['date_attempted'];
			@$daily[$date]["problem_done"]++;
			@$daily[$date]["problem_score"]+=$r['score'];
		}
		
		$sql="SELECT * FROM video_views WHERE student_id=$student_id;";
		$q=$db->query($sql) or die("Error:$sql");
		while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
			$date=$r['date_viewed'];
			@$daily[$date]["video"]+=$r['watched_seconds'];
		}
		
		$dat=[];
		foreach($daily as $date=>$r){
			$r['date']=$date;
			$dat[]=$r;
		}
		
		echo json_encode($dat);exit;
		break;

	default:
		print_r($_POST);
		die("error: unknow action");
		break;
}

die("ctrl error");
