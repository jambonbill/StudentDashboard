<?php
// list videos
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";
?>
<html>
<head>
<title>Videos</title>
</head>
<body>
<div class='container'>
<h1><?php echo count(videos())?> videos <small>list of videos - <a href='index.php'>dashboard</a></small></h1>
<hr />

<div id='chart'></div>

<div id='more'></div>

<?php
//echo "videos.php";
$sql="SELECT * FROM videos WHERE 1;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";

$videos=[];// per week
while($r=$q->fetch()){
	$week=$r['section'];
	$videos["$week"][]=$r;
}


$VAC=video_access_count();
//print_r($VAC)

ksort($videos);

echo "<br />";
foreach ($videos as $week=>$video) {

	echo "<h1>$week <small>".count($video)." video(s)</small></h1>";

	echo "<table class='table table-condensed table-striped'>";
	
	echo "<thead>";
	echo "<th width=100>video id</th>";
	//echo "<th>section</th>";
	echo "<th>subsection</th>";
	echo "<th title='video duration'>duration_seconds</th>";
	echo "<th title='Video played by n students'>played</th>";
	echo "<th width=60>watched</th>";
	echo "</thead>";
	
	echo "<tbody>";
	$duration_total=0;
	$played_total=0;
	foreach($video as $r){
		//print_r($r);
		$duration_total+=$r['duration_seconds'];echo "<tr>";
		$played_total+=$VAC[$r['id']];

		echo "<tr>";
		echo "<td><a href=video.php?id=".$r['id'].">".$r['id']."</a>";
		//echo "<td>".$r['section'];
		echo "<td>".$r['subsection'];
		echo "<td>".$r['duration_seconds'];
		echo "<td>".$VAC[$r['id']];//played
		echo "<td style='text-align:right'>".round($VAC[$r['id']]/500*100)." %";

	}
	echo "</tbody>";
	echo "<tfoot>";
	echo "<tr>";
	echo "<td>";
	echo "<td>";
	echo "<td>$duration_total";//total duration
	echo "<td>$played_total";//player
	echo "<td style='text-align:right'>".round($played_total/$duration_total*100)."%";//watched
	echo "</tfoot>";
	echo "</table>";

	$grand_duration_total+=$duration_total;
}

echo "<li>grand_duration_total=$grand_duration_total";

?>
</body>
<script>
$(function(){
	console.log("ready");
	$('table').tablesorter();
})
</script>
<script src='js/videos.js'></script>