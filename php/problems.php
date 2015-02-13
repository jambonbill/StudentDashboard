<?php
// list problems
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";
?>
<html>

<head>
<title>Problems</title>
</head>

<body>
<div class='container'>
<h1>Problems <small><a href='index.php'>dashboard</a></h1>
<hr />

<div id='chart'></div>

<div id='more'></div>

<?php
// list of problems
$sql="SELECT * FROM problems WHERE 1;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";

$problems=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$week=$r['section'];
	$problems["$week"][]=$r;
}
ksort($problems);

$PAC=problem_attempt_count();
$PSC=problem_success_count();


foreach ($problems as $week=>$data) {

	echo "<h1>$week <small>".count($data)." problems</small></h1>";
	echo "<table class='table table-condensed table-striped'>";
	echo "<thead>";
	echo "<th width=100>id</th>";
	//echo "<th>section</th>";
	echo "<th width=200>subsection</th>";
	echo "<th>max_points</th>";
	echo "<th>watched</th>";
	echo "<th>success %</th>";

	echo "</thead>";
	foreach($data as $r){
		//print_r($r);
		echo "<tr>";
		echo "<td><a href=problem.php?id=".$r['id'].">".$r['id']."</a>";
		//echo "<td>".$r['section'];
		echo "<td>".$r['subsection'];
		echo "<td>".$r['max_points'];
		echo "<td>".$PAC[$r['id']];//problem attempt count
		//echo "<td>".$PSC[$r['id']];//success %
		echo "<td>".round($PSC[$r['id']]/$PAC[$r['id']]*100)." %";//success %
	}
	echo "</table>";

}

?>
<script src='js/problems.js'></script>
