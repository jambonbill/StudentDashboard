<?php
// heatmap
include "connect.php";
include "header.php";
include "dashboard_functions.php";
?>
<html>
<head>
<!-- Optional theme -->
<link rel="stylesheet" href="css/calendar.css">
<title>Student activity heatmap</title>
</head>
<body>



<div class='container'>
<h1>Student activity heatmap <small>minutes per days <a href='index.php' class='pull-right'>dashboard</a></small></h1>
<hr />
<div id='calendarDiv'></div>
<div id='more'></div>

<script>
var minutes_per_day=[];
var width = 800,
    height = 136,
    cellSize = 12; // cell size
var color;
var month=[];
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10]= "Nov";
month[11]= "Dec";

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var svg = d3.select("#calendarDiv").selectAll("svg")
    .data(d3.range(2018, 2019))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 63) / 2) + "," + (height - cellSize * 7 - 1) + ")");

// year
svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });


var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { 
      return d;// date
    });


// draw month outlines
svg.selectAll(".month")
    .data(function(d) { 
      //console.log("svg.selectAll(.month)", d);
      return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); 
    })
  .enter()
    .append("text")
    .attr("transform", function(d,i){
        
        return "translate(" + week(d) * cellSize + ",-2)";
    })
    .text(function(d,i){
      //console.log("text",d,i);
      //var t1 = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return month[d.getMonth()];
    });
    

function updateCalendar(){
    //console.log('updateCalendar()');
    rect.filter(function(d) {//go through every rect
        return d in data;//and filters only the one with a matching date in "data"
    })
    .style("fill", function(d, i) { return color(data[d]); })
    .select("title")
    .text(function(d) { 
		return d + " - " + data[d]+" minutes";
    });

}


$(function(){
	//console.log('heatmap');
	/*
	d3.csv("csv/minutes_per_day.csv",function(d){
		return {
			student_id:+d.student_id,
			//date:new Date(d.date),
			date:d.date,
			minutes_on_site:+d.minutes_on_site
		};
	},function(error,rows){
		console.log("minutes_per_day",rows.length + " records",rows[0]);
		var minutesDomain = d3.extent( rows ,function(o){return o.minutes_on_site;});
		console.log(minutesDomain);
		// compute calendar json ...
		data = d3.nest()
            .key(function(d) { return d.date; })
            .rollup(function(d) {
            	//console.log("rollup",d);
                //return {d[0].minutes_on_site,d[0].minutes_on_site};
                //return d3.mean(d, function(g) { return +g.minutes_on_site; });
                return d3.sum(d, function(g) { return +g.minutes_on_site; });
            })
            .map(rows);// we convert data to make it fast to digest (key:value)
		console.log("nest",data);
	});
	*/

	$('#more').load("ctrl.php",{'do':'heatmap'},function(x){
		try{
			var dat=JSON.parse(x);	
			var domain=d3.extent(dat,function(d){return d.minutes;});
			color=d3.scale.linear().domain(domain).range(["#E6E685","#1E6823"]);//github colors
			//console.log("ctrl.php",domain);
			$('#more').html("ok");
			data=d3.nest()
				.key(function(d){return d.date;})
				.rollup(function(d){
					return d[0].minutes;
				})
				.map(dat);
			//console.log("data final",data);
			updateCalendar();
		}
		catch(e){
			console.log(e);
		}
	});

});
</script>