<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

$student_id=rand(0,499);
if (isset($_GET['id']) && $_GET['id']>0) {
	$student_id=$_GET['id'];
}

include "student_data.php";// compute student data
?>
<html>
<head>
<title>Student #<?php echo $student_id?></title>
</head>

<body>

<div class='container'>
<h1><i class='fa fa-user'></i> Student <a href='?id=<?php echo $student_id?>'>#<?php echo $student_id?></a> <small><a href='index.php' class='pull-right'>dashboard</a></small></h1>
<hr />
<input type='hidden' id='student_id' value='<?php echo $student_id?>'>
<?php
//include "student_alerts.php";
include "student_progress_overview.php";//

//include "student_progression_table.php";//html
include "student_progression.php";//d3js


include "student_calendar.php";//d3js
include "student_constant.php";//d3js

//include "student_overview.php";//data table

//include "student_weeks.php";

//include "student_problem_attempts.php";
//include "student_video_views.php";
