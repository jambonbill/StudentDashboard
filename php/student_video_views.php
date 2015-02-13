<?php

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