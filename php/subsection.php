<?php
// Course subsection
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

//echo "<pre>";
$subsection_id=$_GET['id'];

echo "<title>SubSection</title>";

echo "<div class=container>";
echo "<h1>Course subsection <small>#$subsection_id <a href=index.php>dashboard</a></small></h1>";
echo "<hr>";

//echo "<pre>";


// videos
// videos
// videos

$sql="SELECT * FROM videos WHERE subsection LIKE '$subsection_id';";
$q=$db->query($sql) or die("error:$sql");
$vids=0;

echo "<table class='table table-condensed table-striped'>";

echo "<thead>";
echo "<th width=100>video id</th>";
echo "<th width=200>duration_second</th>";
echo "<th>accessed</th>";
echo "</thead>";
echo "<tbody>";
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	echo "<tr>";
	echo "<td><a href=video.php?id=".$r['id'].">".$r['id']."</a>";
	echo "<td>".$r['duration_seconds'];
	echo "<td>".'0';
	$vids++;
}
echo "</tbody>";
echo "</table>";
echo "<i>$vids videos</i>";

echo "<hr />";

// problems
// problems
// problems

$PAC=problem_attempt_count();

$sql="SELECT * FROM problems WHERE subsection LIKE '$subsection_id';";
$q=$db->query($sql) or die("error:$sql");

//echo "<b>Problems</b>";
echo "<table class='table table-condensed table-striped'>";
echo "<thead>";
echo "<th width=100>problem id</th>";
echo "<th width=200>problem_attempt_count</th>";
echo "<th>success</th>";
echo "</thead>";

$probs=0;
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	//print_r($r);
	echo "<tr>";
	echo "<td><a href=problem.php?id=".$r['id'].">".$r['id']."</a>";
	echo "<td>".$PAC[$r['id']];//$r['id'];
	echo "<td>".'0';//$r['id'];
	$probs++;
}
echo "</table>";
echo "<i>$probs problems</i>";

?>
<script>
$(function(){
	console.log("ready");
})
</script>