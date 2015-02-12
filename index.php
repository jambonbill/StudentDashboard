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

<a href=#reload id='btn100' class='btn btn-default'><i class='fa fa-star'></i> Group 100</a>
<a href=#reload id='btn50' class='btn btn-default'><i class='fa fa-star-half-o'></i> Group 50</a>
<a href=#reload id='btn0' class='btn btn-default'><i class='fa fa-star-o'></i> Group 0</a>
<a href=#reload id='btnReload' class='btn btn-default'>Random student</a>
<div id='loader'></div>

<script src='js/csvdata.js'></script>
<script>

$(function(){
	$('#btn0').click(function(){
		//updateStudent(Math.round(Math.random()*500));
		updateStudent(group_0[Math.round(Math.random()*group_0.length-1)]);
	});

	$('#btn50').click(function(){
		//updateStudent(Math.round(Math.random()*500));
		updateStudent(group_50[Math.round(Math.random()*group_50.length-1)]);
	});
	$('#btn100').click(function(){
		//updateStudent(Math.round(Math.random()*500));
		updateStudent(group_100[Math.round(Math.random()*group_100.length-1)]);
	});
	$('#btnReload').click(function(){
		updateStudent(Math.round(Math.random()*500))
	});
});

function updateStudent(student_id){
	$('#student_id').html('#'+student_id);
	var dat=getStudentData(student_id);
	computeStats(dat);//columns and arcs
	updateConstancy(dat);
	updateVidnprobs(dat);

	var weeklydata=getWeeklyData(student_id);
	updateProgressDetails(weeklydata)
}
</script>