<html>
<head>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="bootstrap/css/bootstrap.css">
<!-- Font awesome cdn -->
<!-- <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"> -->
<!-- Font awesome local -->
<link href="./font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
<!-- Tooltip -->
<link rel="stylesheet" href="css/tooltip.css">
<!-- JQuery -->
<script src="js/jquery-1.11.2.min.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="bootstrap/js/bootstrap.min.js"></script>
<!-- D3JS -->
<script src="js/d3.min.js"></script>
<style>
@media (min-width: 970px){
  .container{width: 750px;}
}
</style>
<title>Student dashboard</title>
</head>

<body>
<div class='container'>
<h1>
	<i class='fa fa-tachometer'></i> Student dashboard
	<small id='student_id'>#</small>
	<div class='btn-group pull-right'>
	<a href=# class='btn btn-primary' id='btn100' title='Show student with 100% progress'><i class='fa fa-star'></i></a>
	<a href=# class='btn btn-primary' id='btn50' title='Show student with good progress'><i class='fa fa-star-half-o'></i></a>
	<a href=# class='btn btn-primary' id='btn0' title='Show student with little progress'><i class='fa fa-star-o'></i></a>
	<a href=# class='btn btn-primary' id='btnRand' title='Pick a random student'><i class='fa fa-question'></i></a>
	</div>
</h1>
<hr />

<div class='row'>
	<div class='col-xs-3'>
		<h3>Progress</h3>
		<div id='progressOvDiv'></div>
	</div>

	<div class='col-xs-3'>
		<h3><i class='fa fa-calendar'></i> Start</h3>
		<div id='start'></div>
	</div>

	<div class='col-xs-3'>
		<h3 id='connectedTitle'><i class='fa fa-calendar-o'></i> Loading...</h3>
		<div id='connectedBody'></div>
	</div>
	
	<div class='col-xs-3'>
		<h3 id='endTitle'>Legend</h3>
		<div id='endBody'></div>
	</div>
</div>

<hr />

<!-- student_progress_detail.php -->
<h3>Progression detail per week <small id='progressMore'></small></h3>
<div id='progressDiv'></div>

<!-- student_constancy.php -->
<h3>Constancy <small id='moreConstant'></small></h3>
<div id='constantDiv'></div>

<!-- student_video_and_problems.php -->
<h3>Videos watched and problems answered<small id='moreVidndprobs'></small></h3>
<div id='vidnprobs'></div>

<!-- Compare to class -->
<div class='row'>
	<div class='col-xs-6'>
		<h3>Class comparison</h3>
		<div id='colA'></div>
		<select id='selector1' class='form-control'>
			<option value='a0'>Problems answered / Problems score</option>
			<option value='a'>Problems answered / Video count</option>
			<option value='a2'>Problems answered / Videos watched (time)</option>
			<option value='a3'>Videos watched / Video count</option>
			<option value='b'>Time spent / Problems score</option>
			<option value='c'>Time spent / Problems answered</option>
			<option value='d'>Session length avg / Problems score</option>
			<option value='e'>Time spent / Number of sessions</option>
		</select>
	</div>
	<div class='col-xs-6'>
	<h3>Ranking</h3>
	<div id='colB'></div>
		<select id='selector2' class='form-control'>
			<option value='problem_score'>Problems score</option>			
			<option value='problem_done'>Problems answered</option>
			<option value='video_watched'>Video watched</option>
			<option value='time_spent'>Total time spent on site</option>
			<option value='sessions'>Number of sessions</option>
			<option value='session_avg'>Session average</option>
		</select>
	</div>
</div>

<hr />
<!--
<script src='js/student_progress_overview.js'></script>
<script src='js/student_progress_detail.js'></script>
<script src='js/student_constancy.js'></script>
<script src='js/student_vidnprobs.js'></script>
<script src='js/student_class.js'></script>
<script src='js/tooltip.js'></script>
<script src='js/csvdata.js'></script>
<script src='js/init.js'></script>
-->
<script><?php include "javascript.php";?></script>