<?php
// one videos
include "connect.php";
include "dashboard_functions.php";
include "header.php";

//echo "<pre>";
$video_id=$_GET['id'];

echo "<title>Video</title>";
echo "<div class=container>";
echo "<h1>Video #$video_id <small><a href=index.php>dashboard</a></small></h1>";
echo "<hr />";

$video=video($video_id);
echo "<h3>" . $video['section'] . ' - ' . $video['subsection'] . "</h3>";

$sql="SELECT * FROM video_views WHERE video_id LIKE '$video_id';";
$q=$db->query($sql) or die("error : $sql\n");
$dat=[];

$watched_time=0;
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$dat[]=$r;
	$watched_time+=$r['watched_seconds'];
}

$avg_watch_time=round($watched_time/count($dat));

echo "<pre>";
//print_r($video);
echo "Video played ".count($dat)." times\n";
$avg_pct=round($avg_watch_time/$video['duration_seconds']*100);
echo "Average watching time : $avg_watch_time seconds ($avg_pct %)\n";
echo "</pre>";



echo "<table class='table table-condensed table-striped'>";
echo "<thead>";
echo "<th width=100>student_id</th>";
//echo "<th>section</th>";
//echo "<th>subsection</th>";
echo "<th>date_viewed</th>";
//echo "<th>duration_seconds</th>";
echo "<th>watched_seconds</th>";
echo "<th>watched</th>";
echo "</thead>";
foreach($dat as $r){
	//print_r($r);
	echo "<tr>";
	echo "<td><a href=student.php?id=".$r['student_id'].">".$r['student_id']."</a>";
	echo "<td>".$r['date_viewed'];
	echo "<td>".$r['watched_seconds'];
	$pct=round(($r['watched_seconds']/$r['duration_seconds'])*100);
	echo "<td style='text-align:right'>".$pct." %";
}
echo "</table>";
?>
<script>
$(function(){
	$('table').tablesorter();
});
</script>