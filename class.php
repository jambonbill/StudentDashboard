<?php
// Class representation
include "connect.php";
include "header.php";
?>
<html>
<head>
<title>Class</title>
</head>

<body>

<div class='container'>

<h1>
	<i class='fa fa-user'></i> Class
</h1>

<hr />
<?php
// CLASS DATA //
$minutes_per_day=[];
$problem_attempts=[];
$video_views=[];

$sql="SELECT * FROM minutes_per_day WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$r['minutes_on_site']*=1;
	$minutes_per_day[$r['student_id']][]=$r;
}

$sql="SELECT * FROM problem_attempts WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$problem_attempts[$r['student_id']][]=$r;
}

$sql="SELECT * FROM video_views WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$video_views[$r['student_id']][]=$r;
}
?>
<script>
<?php
echo "var mpd=".json_encode($minutes_per_day).";\n";
echo "var pa=".json_encode($problem_attempts).";\n";;
echo "var vv=".json_encode($video_views).";\n";;
?>
</script>
