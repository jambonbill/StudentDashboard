<?php
// csvdata
//include "connect.php";
include "header.php";
//include_once "dashboard_functions.php";
//include "student_data.php";// compute student data
?>
<html>
<head>
<title>CSV Data</title>
</head>

<body>

<div class='container'>

<h1>
	CSV Data
	<small>
		<a href='dashboard.php' class='pull-right'>dashboard</a>
	</small>
</h1>

<hr />

<pre>
function minutes_per_day(student_id)
function problem_attempts(student_id)
function video_views(student_id)
</pre>

<a href='#btn' class='btn btn-default' id='btnRandom'>Random student</a>
<a href='#btn' class='btn btn-default' id='btn100'>Student 100%</a>
<a href='#btn' class='btn btn-default' idk='btn50'>Student > 50%</a>
<a href='#btn' class='btn btn-default' onclick='getStudentData(158)'>Student 158</a>

<script src='js/csvdata.js'></script>