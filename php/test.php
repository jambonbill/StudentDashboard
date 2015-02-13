<?php
//test zone
include "connect.php";
include "header.php";
include_once "dashboard_functions.php";
?>
<title>test</title>
<script>

var minutes_per_day=[];
var problem_attempts=[];
var problems=[];
var video_views=[];
var videos=[];

$(function(){
	console.log('test');
	
	d3.csv("csv/minutes_per_day.csv",function(d){
			return {
				student_id:+d.student_id,
				//date:d.date,
				date:new Date(d.date),
				minutes_on_site:+d.minutes_on_site
			};
		},function(error,rows){
			console.log("minutes_per_day",rows);
		});
    


	
	d3.csv("csv/problem_attempts.csv",function(d){return d;},function(error, rows){
		console.log("problem_attempts.csv",rows);
	});
	
	
	d3.csv("csv/problems.csv",function(d){return d;},function(errors,rows){
		console.log("problems.csv",rows);
    });
	
	d3.csv("csv/video_views.csv",function(d){return d;},function(errors,rows){
		console.log("video_views.csv",rows);
	});

	
	// videos.csv
	d3.csv("csv/videos.csv", function(d) {//id,section,subsection,duration_seconds
	  return {
	    id: d.id, // convert "Year" column to Date
	    section: d.section, // convert "Year" column to Date
	    subsection: d.subsection,
	    duration_seconds: +d.duration_seconds // convert "Length" column to number
	  };
	}, function(error, rows) {
	  console.log("videos",rows);
	});

	
});
</script>
