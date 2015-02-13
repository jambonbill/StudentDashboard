<?php
// problem

include "connect.php";
include "header.php";
include "dashboard_functions.php";

//echo "<pre>";
$problem_id=$_GET['id'];

echo "<title>Problem</title>";
echo "<div class=container>";
echo "<h1>Problem #$problem_id <small><a href='index.php'>dashboard</a></h1>";

echo "<hr />";

$r=problem($problem_id);

echo "<pre>";print_r($r);echo "</pre>";

echo "<br />";




$sql = "SELECT * FROM problem_attempts WHERE problem_id LIKE '$problem_id';";
$q=$db->query($sql) or die("Error $sql");
//echo "<pre>$sql</pre>";
$dat=[];
$totalscore=0;
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$dat[]=$r;
	$totalscore+=$r['score'];
}

echo "<li>".count($dat)." attempts";
echo "<li>participation : " . round(count($dat)/500*100)."%";
echo "<li>total score : $totalscore";
echo "<li>avg. score : ".round($totalscore/count($dat)*100)."%";

echo "<table class='table table-condensed table-striped'>";
echo "<thead>";
echo "<th>student_id</th>";
//echo "<th>section</th>";
//echo "<th>subsection</th>";
echo "<th>date_attempted</th>";
echo "<th>max_points</th>";
echo "<th>score</th>";
echo "</thead>";
//while($r=$q->fetch(PDO::FETCH_ASSOC)){
foreach($dat as $r){
	//print_r($r);
	echo "<tr>";
	echo "<td><a href=student.php?id=".$r['student_id'].">".$r['student_id']."</a>";
	//echo "<td>".$r['section'];
	//echo "<td>".$r['subsection'];
	echo "<td>".$r['date_attempted'];
	echo "<td>".$r['max_points'];
	echo "<td>".$r['score'];
}
echo "</table>";

//echo "<pre>";
//print_r($r);