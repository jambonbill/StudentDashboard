<?php
// list students
include "connect.php";
include "header.php";
?>
<html>
<head>
<title>Student dashboard</title>
</head>

<body>

<div class='container'>

<h1>
	<i class='fa fa-user'></i> Student
	<small id='student_id'>#</small>
</h1>

<hr />

<input type='hidden' id='student_id' value='<?php echo $student_id?>'>
<?php
//include "student_alerts.php";

include "student_columns.php";

include "student_progress_overview.php";//d3

//include "student_progression_table.php";//html
include "student_progress_detail.php";//d3js


//include "student_calendar.php";//d3js heatmap
include "student_constancy.php";//d3js

include "student_video_and_problems.php";//ailadi style

//include "student_overview.php";//data table

//include "student_weeks.php";

//include "student_problem_attempts.php";
//include "student_video_views.php";//table
?>
<script src='js/tooltip.js'></script>

<hr />
<a href=#reload id='btnReload' class='btn btn-default'>Reload</a>
<div id='loader'></div>

<script src='js/csvdata.js'></script>
<script>

$(function(){
	$('#btnReload').click(function(){
		updateStudent(Math.round(Math.random()*500))
	});
});

function updateStudent(student_id){
	var dat=getStudentData(student_id);
	computeStats(dat);//columns and arcs
	updateConstancy(dat);
	updateVidnprobs(dat);

	var weeklydata=getWeeklyData(student_id);
	updateProgressDetails(weeklydata)
}
</script>