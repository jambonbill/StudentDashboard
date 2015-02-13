<?php
// Class csv generator
include "connect.php";
/*
Class data structure :
---------------------------
[student_id].video_watched
[student_id].problem_done
[student_id].problem_score
[student_id].time_spent
[student_id].sessions
[student_id].session_average
*/
echo "<pre>";
$DAT=[];
$sql="SELECT student_id, COUNT(*) as sessions, SUM(minutes_on_site) as time_spent FROM minutes_per_day GROUP by student_id;";
$q=$db->query($sql) or die("<li>Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	//print_r($r);
	$DAT[$r['student_id']]['student_id']=$r['student_id'];
	$DAT[$r['student_id']]['time_spent']=$r['time_spent'];
	$DAT[$r['student_id']]['sessions']=$r['sessions'];
	$DAT[$r['student_id']]['session_avg']=round($r['time_spent']/$r['sessions'],2);
}



//ok
$sql="SELECT student_id, COUNT(*) as video_count, SUM(watched_seconds) as video_watched FROM video_views GROUP BY student_id;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	//print_r($r);
	$DAT[$r['student_id']]['video_count']=$r['video_count'];
	$DAT[$r['student_id']]['video_watched']=$r['video_watched'];
}



$sql="SELECT student_id, COUNT(*) as problem_done, SUM(score) as problem_score FROM problem_attempts GROUP BY student_id;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	//print_r($r);
	$DAT[$r['student_id']]['problem_done']=$r['problem_done'];
	$DAT[$r['student_id']]['problem_score']=$r['problem_score'];
}

//print_r($DAT);
echo "student_id,sessions,session_avg,time_spent,video_count,video_watched,problem_done,problem_score\n";
foreach($DAT as $student_id=>$data){
	if(!isset($data['problem_done']))$data['problem_done']=0;
	if(!isset($data['problem_score']))$data['problem_score']=0;
	echo "$student_id,";
	echo $data['sessions'].",";
	echo $data['session_avg'].",";
	echo $data['time_spent'].",";
	echo @$data['video_count'].",";
	echo @$data['video_watched'].",";
	echo @$data['problem_done'].",";
	echo @$data['problem_score'];
	echo "\n";
}