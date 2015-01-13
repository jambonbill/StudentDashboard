<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

//echo "<pre>";

echo "<title>Students</title>";

echo "<div class=container>";
echo "<h1>Students <small><a href=index.php>dashboard</a></h1>";
echo "<hr>";

function average_problem_attempts(){
	
	global $db;
	
	$sql= "SELECT COUNT(*) FROM `problem_attempts`;";
	$q=$db->query($sql) or die("error : $sql");
	$count_pas=$q->fetch()[0];
	$avg_pas=round($count_pas/500);
	return $avg_pas;
}


// return 20
function average_video_views()
{
	
	global $db;

	$sql= "SELECT COUNT(*) FROM `video_views`;";
	$q=$db->query($sql) or die("error : $sql");
	$count_vvs=$q->fetch()[0];
	$avg_vvs=round($count_vvs/500);
	return $avg_vvs;
}


// return 9
function average_days_working(){
	
	global $db;

	$sql="SELECT COUNT(*) as count FROM minutes_per_day;";
	$q=$db->query($sql) or die("error : $sql\n");
	$r=$q->fetch(PDO::FETCH_ASSOC);
	$minutes_per_day_count=$r['count'];

	return round($r['count']/500);
}

// return 353
function average_time_working()
{
	return 353;// minutes
}

function average_time_session(){
	return 40;// minutes
}

$avg_day_working=average_days_working();
$avg_time_working=average_time_working();
$avg_time_session=average_time_session();
$avg_problem_attempt=average_problem_attempts();

echo "<pre>";
echo "Average days working : $avg_day_working day(s)\n";
echo "Average time working : $avg_time_working minutes\n";
echo "Average time /session : $avg_time_session minutes\n";
echo "Average problem attempts : $avg_problem_attempt\n";
echo "Average video view : ".average_video_views()."\n";
echo "</pre>";



//
$sql="SELECT * FROM minutes_per_day WHERE 1;";
$q=$db->query($sql) or die("error : $sql\n");
	
$minutes=[];
while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
	$minutes[$r['student_id']][$r['date']]=$r['minutes_on_site'];
}

// print_r($minutes);

// problem attempts
$problems=problems();
$sql="SELECT * FROM problem_attempts WHERE 1;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";
$pa=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$pa[$r['student_id']][]=$r;
}


// videos
$videos=videos();

$vv=video_views();


//echo "<pre>".print_r($students, true)."</pre>";


echo "<table class='table table-condensed table-striped'>";

echo "<thead>";
echo "<th width=100>student id</th>";
echo "<th style='text-align:center' title='Number of days working'>Days</th>";
echo "<th style='text-align:center' title='Total time spent in minutes'>Total time</th>";
echo "<th style='text-align:center' title='Average time per day'>Avg. per day</th>";
echo "<th style='text-align:right'>prob. attemps (".count($problems).")</th>";
echo "<th style='text-align:right'>%</th>";
echo "<th style='text-align:right'>video views (".count($videos).")</th>";
echo "<th style='text-align:right'>%</th>";
echo "</thead>";

echo "<tbody>";
for ($i=0; $i <500; $i++) {
	//print_r($r);exit;
	echo "<tr>";
	echo "<td><a href=student.php?id=$i>#".$i."</a>";
	
	$number_days=count($minutes["$i"]);
	
	$label_type='label-default';
	if ($number_days>$avg_day_working)$label_type='label-success';
	if ($number_days<$avg_day_working)$label_type='label-danger';

	echo "<td style='text-align:center'><span class='label $label_type'>".$number_days;
	
	$work_time=array_sum($minutes["$i"]);
	$label_type='label-default';
	if ($work_time>$avg_time_working)$label_type='label-success';
	if ($work_time<$avg_time_working)$label_type='label-danger';
	//$avg_time_working
	echo "<td style='text-align:center'><span class='label $label_type'>".$work_time;// total time
	
	$avg_student_session_length=round(array_sum($minutes["$i"])/count($minutes["$i"]));

	$label_type='label-default';
	if($avg_student_session_length>$avg_time_session)$label_type='label-success';
	if($avg_student_session_length<$avg_time_session)$label_type='label-danger';
	echo "<td style='text-align:center'><span class='label $label_type'>".$avg_student_session_length;// days avg
	//print_r($minutes[$i]);exit;
	
	if(!isset($pa["$i"]))$pa["$i"]=[];
	
	
	$problem_attempts=count($pa["$i"]);
	$label_type='label-default';
	if ($problem_attempts>$avg_problem_attempt)$label_type='label-success';
	if ($problem_attempts<$avg_problem_attempt)$label_type='label-danger';

	echo "<td style='text-align:right'><span class='label $label_type'>".$problem_attempts;// problem attemps
	echo "<td style='text-align:right'>".round(count($pa["$i"])/count($problems)*100) . " %";// %
	
	if (!isset($vv["$i"]))$vv["$i"]=[];
	echo "<td style='text-align:right'>".count($vv["$i"]);//video views
	echo "<td style='text-align:right'>".round(count($vv["$i"])/count($videos)*100) . " %";// %
	
	//echo "<td>".$r['max_points'];
}
echo "</tbody>";
echo "</table>";
?>
<script>
$('table').tablesorter();
</script>