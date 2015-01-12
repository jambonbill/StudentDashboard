<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

if (isset($_GET['id'])) {
	$student_id=$_GET['id'];
} else {
	$student_id=rand(0,500);
}
?>

<html>
<head>
<title>Student</title>
</head>
<body>
<div class='container'>
<h1>Student #<?php echo $student_id?> <small><a href=index.php>dashboard</a></small></h1>
<hr />

<div id='chart_video'></div>
<div id='chart_problem'></div>
<div id='more'></div>


<?php

$sql="SELECT COUNT(*) as count FROM minutes_per_day;";
$q=$db->query($sql) or die("error : $sql\n");
$r=$q->fetch(PDO::FETCH_ASSOC);
$minutes_per_day_count=$r['count'];

//print_r(minutes_per_day($student_id));exit;

$totaltime=array_sum(minutes_per_day()[$student_id]);


echo "<table class='table table-striped table-condensed'>";
echo "<thead>";
echo "<th></th>";
echo "<th>Class (avg)</th>";
echo "<th>Student</th>";
echo "</thead>";

echo "<tbody>";

// days working
$day_class = round($minutes_per_day_count/500);
$day_student=count(minutes_per_day()["$student_id"]);
$label_type='label-default';
if($day_student>$day_class)$label_type='label-success';
if($day_student<$day_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Days working";
echo "<td><span class='label label-default'>$day_class days</span>";
echo "<td><span class='label $label_type'>$day_student days</span>";

// Total work time (minutes working)

$total_class=round(array_sum(student_total_work_time())/500);
$total_student=$totaltime;
$label_type='label-default';
if($total_student>$total_class)$label_type='label-success';
if($total_student<$total_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Total work time";
echo "<td><span class='label label-default'>".$total_class." minutes</span>";// class
echo "<td><span class='label $label_type'>$totaltime minutes</span>";// student

// Average work time per day (in minutes)

$avg_class=minutes_average();
$avg_student=round($totaltime/count(minutes_per_day()[$student_id]));
$label_type='label-default';
if($avg_student>$avg_class)$label_type='label-success';
else $label_type='label-danger';

echo "<tr>";
echo "<td>Avg work time per day";
echo "<td><span class='label label-default'>" . $avg_class . " minutes</span>";// Class
echo "<td><span class='label $label_type'>" . $avg_student . " minutes</span>";// Student


// Problem attemps
$problem_class=(array_sum(problem_attempts())/500);
$problem_student=@(problem_attempts()["$student_id"]*1);
$label_type='label-default';
if($problem_student>$problem_class)$label_type='label-success';
if($problem_student<$problem_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem attempts";
echo "<td><span class='label label-default'>" . $problem_class . "</span>";// Class
echo "<td><span class='label $label_type'>" . $problem_student . "</span>";// Student



// Problems score
$score_class=problem_score_average();
$score_student=student_score_average()[$student_id];

$label_type='label-default';
if($score_student>$score_class)$label_type='label-success';
if($score_student<$score_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem score";
echo "<td><span class='label label-default'>" . $score_class . " %</span>";// Class
echo "<td><span class='label $label_type'>" . $score_student . " %</span>";// Student





$video_class=round(array_sum(video_access_count())/500);
$video_student=@count(video_views()["$student_id"])*1;
$label_type='label-default';
if($video_student>$video_class)$label_type='label-success';
if($video_student<$video_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Video watched";
echo "<td><span class='label label-default'>".$video_class."</span>";// Class
echo "<td><span class='label $label_type'>".$video_student."</span>";// Student


echo "</tbody>";
echo "</table>";


//print_r(problem_attempts());


exit;
// Problem attempts and main student progression

echo "<h2>Problem attempts</h2>";

$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";
$pas=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$pas[$r['section']][]=$r;
}

foreach($pas as $section=>$dat){
	if (count($dat)) {

		echo "<table class='table table-condensed table-striped'>";
		echo "<thead>";
		//echo "<th>$section</th>";
		echo "<th>subsection</th>";
		echo "<th>problem_id</th>";
		echo "<th>date_attempted</th>";
		echo "<th>max_points</th>";
		echo "<th>score</th>";
		echo "</thead>";
		$score=0;
		foreach($dat as $r){
			//print_r($r);
			echo "<tr>";
			//echo "<td>".$r['section'];
			echo "<td>$section :: ".$r['subsection'];
			echo "<td><a href=../problem.php?".$r['problem_id'].">".$r['problem_id']."</a>";
			echo "<td>".$r['date_attempted'];
			echo "<td>".$r['max_points'];
			echo "<td>".$r['score'];
			$score+=$r['score'];
		}
		
		echo "<tfoot>";
		echo "<tr>";
		echo "<td>";
		echo "<td>";
		echo "<td style='text-align:right'><b>Total :</b>";
		echo "<td>".count($dat);
		echo "<td>".$score;
		echo "</tfoot>";

		echo "</table>";
	}else{
		echo "<h4>No problem attemps for $section</h4>";
	}
}

echo "<h2>Video views</h2>";
echo "<hr />";

$sql="SELECT * FROM video_views WHERE student_id=$student_id;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";

$dat=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$dat[$r['section']][]=$r;
}

foreach($dat as $section=>$dat){

	//echo "<b>Video :: $section</b>";
	echo "<table class='table table-condensed table-striped'>";
	echo "<thead>";
	//echo "<th>section</td>";
	echo "<th>subsection</td>";
	echo "<th>video_id</td>";
	echo "<th>date_viewed</td>";
	echo "<th>watched</td>";
	echo "<th>watched %</td>";
	echo "</thead>";
	echo "<tbody>";
	foreach ($dat as $r) {
		//print_r($r);
		echo "<tr>";
		//echo "<td>".$r['section'];
		echo "<td>$section :: ".$r['subsection'];
		echo "<td><a href=video.php?id=".$r['video_id'].">".$r['video_id']."</a>";
		echo "<td>".$r['date_viewed'];
		echo "<td>".$r['watched_seconds'].' / '.$r['duration_seconds'];
		echo "<td>".round($r['watched_seconds']/$r['duration_seconds']*100) . " %";
	}
	echo "</tbody>";
	echo "</table>";
}
?>
<script src='js/student.js'></script>