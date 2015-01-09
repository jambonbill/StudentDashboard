<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";


if (isset($_GET['id'])) {
	$student_id=$_GET['id'];
}else{
	$student_id=rand(0,500);
}

echo "<title>Student</title>";

echo "<div class=container>";
echo "<h1>Student #$student_id <small><a href=index.php>dashboard</a></small></h1>";
echo "<hr />";

//echo "<pre>";
//echo "student_id=$student_id\n";

$sql="SELECT * FROM minutes_per_day WHERE student_id=$student_id;";
$q=$db->query($sql) or die("error : $sql\n");
$dat=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$dat[]=$r;
}

$totaltime=0;
foreach($dat as $r) {
	$totaltime+=$r['minutes_on_site'];	
}


echo "<li>".count($dat)." day(s) working, ".$totaltime." minutes of work in total";
echo " - <i class='text-muted'>Student average : " . round($totaltime/count($dat))." minutes per day</i>";

// Class
// echo "<li><i class='text-muted'>Class average : " . '0' ." minutes per day</i>";




echo "<li>Video watched : ";
echo "<li>Total progress : ";

//echo "<li>Total work time : ".student_total_work_time()["$student_id"];
echo "<li>Total score : ".student_total_scores()["$student_id"];


echo "<pre>";
echo "<li>Class Avg. time spent : ".round(count(minutes_per_day())/500)." day(s) with ".minutes_average()." minutes per day";
echo "<li>Class Avg. problems done : ".round(array_sum(problem_attempt_count())/500);
echo "<li>Class Avg. videos viewed : ".round(array_sum(video_access_count())/500);
echo "</pre>";



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
<script>
//$('table').tablesorter();
</script>