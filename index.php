<?php
// list problems
include "connect.php";
include "header.php";
include "dashboard_functions.php";
?>
<html>
<head>
<script src='js/d3.min.js'></script>
<script src='js/index.js'></script>
<title>Dashboard challenge</title>
</head>
<body>

<div id='chart1'></div>

<div class='container'>
<?php
echo "<h1>Course ";
echo "<small>";
echo "<a href='students.php'>500 students</a> - ";
echo "<a href='videos.php'>".count(videos())." videos - ";
echo "<a href='problems.php'>".count(problems())." problems</a> - ";
echo "<a href='heatmap.php'>heatmap</a>";
echo "</small>";
echo "</h1>";
echo "<hr />";

// Course
// Weeks

$students=500;
$videos=videos();
$problems=problems();


$sql="SELECT * FROM videos WHERE 1;";
$q=$db->query($sql) or die("error");
$videos=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$videos[$r['section']][$r['subsection']][]=$r;
}

$sql="SELECT * FROM problems WHERE 1;";
$q=$db->query($sql) or die("error");
$problems=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$problems[$r['section']][$r['subsection']][]=$r;
}



echo "<pre>";
echo "<li>Avg. time spent : ".round(count(minutes_per_day())/500)." day with ".minutes_average()." minutes per day";
echo "<li>Avg. problems done : ".round(array_sum(problem_attempt_count())/500);
echo "<li>Avg. videos viewed : ".round(array_sum(video_access_count())/500);
echo "</pre>";

echo "<h1>Course structure</h1>";

$sql="SELECT DISTINCT section, subsection FROM videos WHERE 1;";
$q=$db->query($sql) or die("error: $sql");
$sections=[];
while ($r=$q->fetch()) {
	$sections[$r['section']][]=$r['subsection'];
}
ksort($sections);

//echo "<pre>";print_r($videos);echo "</pre>";

foreach($sections as $section=>$subs){
	ksort($subs);
	
	echo "<table class='table table-condensed table-striped'>";
	echo "<thead>";
	echo "<th><a href='section.php?id=$section'>Section :: $section</a></th>";
	echo "<th>Videos</th>";
	echo "<th>Problems</th>";
	echo "</thead>";
	
	echo "<tbody>";
	foreach($subs as $sub){
		echo "<tr>";
		echo "<td><a href='subsection.php?id=$sub'>$sub</a>";
		echo "<td>".count($videos["$section"]["$sub"]);
		echo "<td>".count($problems["$section"]["$sub"]);
	}
	echo "</tbody>";
	echo "</table>";
}
/*
echo "<pre>";
print_r($dat);
*/