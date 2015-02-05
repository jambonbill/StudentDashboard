<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

if (isset($_GET['id']) && $_GET['id']>0) {
	$student_id=$_GET['id'];
} else {
	$student_id=rand(0,500);
}

include "student_data.php";// compute student data

?>

<html>
<head>
<title>Student #<?php echo $student_id?></title>
</head>

<body>

<div class='container'>
<h1>Student <a href='?id=<?php echo $student_id?>'>#<?php echo $student_id?></a> <small><a href='index.php' class='pull-right'>dashboard</a></small></h1>
<hr />
<input type='hidden' id='student_id' value='<?php echo $student_id?>'>
<!--
<div id='chart_video'>chart_video</div>
<div id='chart_problem'>chart_problem</div>
<div id='more'>more</div>

<h3><i class='fa fa-line-chart'></i> Overall course progression <small>problems done</small></h3>

<div class='pull-right'><?php echo $problem_student_pct?>%</div>
<div class="progress xs">
  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="<?php echo $problem_student_pct?>" aria-valuemin="0" aria-valuemax="100" style="width: <?php echo $problem_student_pct?>%;"></div>
</div>



<div class='pull-right'><?php echo $problem_class_pct?>%</div>
<div class="progress xs">
  <div class="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="<?php echo $problem_class_pct?>" aria-valuemin="0" aria-valuemax="100" style="width: <?php echo $problem_class_pct?>%;"></div>
</div>
-->

<!--
<h3><i class='fa fa-line-chart'></i> Double progression</h3>
<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 10%;">Student</div>
  <div class="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">Class</div>
</div>
<div class="progress xs">
  <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"><i class='fa fa-user'></i> 25%</div>
  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 25%;">25%</div>
  <div class="progress-bar" role="progressbar" style="width: 5%;"><i class='fa fa-user'></i>&nbsp;</div>
</div>
-->

<?php

//include "student_alerts.php";
include "student_progression_table.php";

include "student_progression.php";//d3js

include "student_calendar.php";//d3js
include "student_constant.php";//d3js

//include "student_overview.php";

//include "student_weeks.php";

//include "student_problem_attempts.php";
//include "student_video_views.php";
