<?php
// Course section
include "connect.php";
include "header.php";

//echo "<pre>";
$section_id=$_GET['id'];

echo "<title>Section</title>";

echo "<div class=container>";
echo "<h1>Course section #$section_id<small><a href=index.php>dashboard</a></small></h1>";
echo "<hr>";

$sql="SELECT * FROM videos WHERE section LIKE '$section_id';";
$q=$db->query($sql) or die("error:$sql");

?>
<script>
$(function(){
	console.log("ready");
})
</script>