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
$overall_progress=rand(0,100);//fake number
?>

<html>
<head>
<title>Student #<?php echo $student_id?></title>
</head>
<body>
<div class='container'>
<h1>Student #<?php echo $student_id?> <small><a href='index.php' class='pull-right'>dashboard</a></small></h1>
<hr />
<input type='hidden' id='student_id' value='<?php echo $student_id?>'>
<div id='chart_video'></div>
<div id='chart_problem'></div>
<div id='more'></div>

<h3><i class='fa fa-line-chart'></i> Overall course progression <small>problems done</small></h3>

<div class='pull-right'><?php echo $overall_progress?>%</div>
<div class="progress xs">
  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="<?php echo $overall_progress?>" aria-valuemin="0" aria-valuemax="100" style="width: <?php echo $overall_progress?>%;"></div>
</div>



<div class='pull-right'>08%</div>
<div class="progress xs">
  <div class="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: 8%;"></div>
</div>

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

include "student_alerts.php";

include "student_calendar.php";

//include "student_overview.php";
//include "student_weeks.php";

//include "student_problem_attempts.php";
//include "student_video_views.php";
?>