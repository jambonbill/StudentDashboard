<?php
// list students
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";

$student_id=rand(0,499);
if (isset($_GET['id']) && $_GET['id']>0) {
	$student_id=$_GET['id'];
}

//include "student_data.php";// compute student data
?>
<html>
<head>
<title>Student #<?php echo $student_id?></title>
</head>

<body>

<div class='container'>

<h1>

	<i class='fa fa-user'></i> Student <a href='?id=<?php echo $student_id?>'>#<?php echo $student_id?></a> &nbsp;
	
	<small>
		<a href='dashboard.php' class='pull-right'>dashboard</a>
	</small>

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


<a href=#reload id='btnReload' class='btn btn-default'>Reload</a>
<div id='loader'></div>
<script>
$(function(){
	$('#btnReload').click(function(){
		var student_id=Math.round(Math.random()*500);
		//console.log(student_id);
		$('#loader').html("loading...");
		$('#loader').load('student_ctrl.php',{'do':'getDailyData','student_id':student_id},function(json){
			try{
				dat=JSON.parse(json);
				//convert dates
				dat.forEach(function(d){
                	d.date = d3.time.format("%Y-%m-%d").parse(d.date);
            	}); 
				$('#loader').html(dat.length + " records");

				updateConstancy(dat);
				updateVidnprobs(dat);

			}
			catch(e){
				console.log(e);
				$('#loader').html(json);
			}
		});

		//updateProgress(progressdata)


	});
});
</script>