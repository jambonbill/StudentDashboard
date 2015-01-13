<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

if (isset($_GET['id'])) {
	$student_id=$_GET['id'];
} else {
	$student_id=rand(0,500);
}
?>

<html>
<head>
<title>Student</title>
</head>
<body>
<div class='container'>
<h1>Student #<?php echo $student_id?> <small><a href=index.php>dashboard</a></small></h1>
<hr />

<div id='chart_video'></div>
<div id='chart_problem'></div>
<div id='more'></div>

<?php
include "student_overview.php";

include "student_calendar.php";

//include "student_problem_attempts.php";
//include "student_video_views.php";
?>

<script src='js/student.js'></script>