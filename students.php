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


function average_video_views(){
	
	global $db;

	$sql= "SELECT COUNT(*) FROM `video_views`;";
	$q=$db->query($sql) or die("error : $sql");
	$count_vvs=$q->fetch()[0];
	$avg_vvs=round($count_vvs/500);
	return $avg_vvs;
}


echo "<pre>";
echo "Average problem attempts : ".average_problem_attempts()."\n";
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
echo "<th width=100 title='Number of days'>days</th>";
echo "<th width=100 title='In minutes'>totaltime</th>";
echo "<th width=100 title='Average time per day'>avg</th>";
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
	echo "<td style='text-align:right'>".count($minutes["$i"]);
	echo "<td style='text-align:right'>".array_sum($minutes["$i"]);// total time
	echo "<td style='text-align:right'>".round(array_sum($minutes["$i"])/count($minutes["$i"]));// days avg
	//print_r($minutes[$i]);exit;
	
	if(!isset($pa["$i"]))$pa["$i"]=[];
	echo "<td style='text-align:right'>".count($pa["$i"]);// problem attemps
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