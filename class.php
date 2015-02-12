<?php
// Class representation
include "connect.php";
include "header.php";
?>
<html>
<head>
<title>Class</title>
</head>
<body>
<div class='container'>
<h1>
	<i class='fa fa-user'></i> Class view <small>(how do i compare to class)</small>
</h1>
<hr />

<div id='classDiv'></div>

<script>
var width = 700,height = 430;//
var cls = d3.select("#classDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

function udpateClass(data){	
	//console.log('udpateClass()');
	var xScale = d3.scale.linear().range([20, width-30]).domain([0,108]);
	var yScale = d3.scale.linear().range([100, 0]).domain([0,141]);
	var domain=d3.extent(data,function(d){return d.video_watched;});
    console.log('video_watched domain',domain);
    var videoWatchedScale=d3.scale.linear().range([200, 20]).domain(domain);
    var problemDoneScale=d3.scale.linear().range([20, width-30]).domain([0,108]);

	//define xAxis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5)//x tick
        //.tickFormat(d3.time.format('%b'))//27Sep
        .tickSize(4)
        .tickPadding(4);

	//define yAxis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)//x tick
        .tickSize(5)
        .tickPadding(5);

    cls.append('g')
        .attr('class', 'axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(0, 200)')
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "11px")
        .style("text-anchor", "start");

    cls.append('g')
        .attr('class', 'axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(30, 20)')
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "11px")
        .style("text-anchor", "left");
	
		//override css
        cls.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

	var m=cls.selectAll("rect.avg").data(data);
	m.enter()
		.append("circle")
		.attr("cx",function(d,i){
			//console.log('d.problem_done',d.problem_done);
			return problemDoneScale(d.problem_done);
		})
		.attr("cy",function(d,i){
			//return i;
			return videoWatchedScale(d.video_watched);
		})
		.attr("r",5)
		.style("opacity", 0.5)
		.attr("fill","#999");    
}


var xScale = d3.scale.linear().range([30, width-30]).domain([0,500]);
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5)//x tick
    .tickSize(4)
    .tickPadding(5);

cls.append('g')
    .attr('class', 'axis')
    .style('shape-rendering','crispEdges')
    .attr('transform', 'translate(0, 400)')
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "11px")
    .style("text-anchor", "start");
	//override css
    cls.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});



function updateSelector(data,criteria){

	//console.log('criteria',criteria);

	

	var xScale = d3.scale.linear().range([20, width-30]).domain([0,500]);
	
	switch(criteria){
		
		case 'video_watched'://no
			data.sort(function(a,b){return b.video_watched-a.video_watched});
			var domain=d3.extent(data,function(d){return d.video_watched});
			break;
		
		case 'problem_done'://no
			data.sort(function(a,b){return b.problem_done-a.problem_done});
			var domain=d3.extent(data,function(d){return d.problem_done});
			break;

		case 'problem_score'://no
			data.sort(function(a,b){return b.problem_score-a.problem_score});
			var domain=d3.extent(data,function(d){return d.problem_score});
			break;

		case 'time_spent'://no
			data.sort(function(a,b){return b.time_spent-a.time_spent});
			var domain=d3.extent(data,function(d){return d.time_spent});
			break;
		
		case 'sessions'://no
			data.sort(function(a,b){return b.sessions-a.sessions});
			var domain=d3.extent(data,function(d){return d.sessions});
			break;

		case 'session_avg'://
			data.sort(function(a,b){return b.session_avg-a.session_avg});
			var domain=d3.extent(data,function(d){return d.session_avg});
			break;
		
		default:
			console.log('criteria error');
			return false;
			break;
	}
	
	//console.log('domain '+criteria,domain);
	
	var yScale = d3.scale.linear().range([300,400]).domain(domain);
	
	var yAxis = d3.svg.axis().scale(yScale).orient('left')
	    //.ticks(5)//x tick
	    .tickSize(2)
	    .tickPadding(5);

	cls.selectAll("g.yaxis").remove();
	cls.append('g')
	    .attr('class', 'yaxis')
	    .style('shape-rendering','crispEdges')
	    .style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'})
	    .attr('transform', 'translate(30,0)')
	    .call(yAxis)
	    .selectAll("text")
	    .style("font-size", "11px")
	    .style("text-anchor", "start");
		
	//override css
    //cls.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

	var us=cls.selectAll("circle.classroom").data(data)
	us.enter()
		.append("circle")
		.attr("class","classroom")
		.attr("r",0)
		.attr("fill","#fff");

	us.transition().delay(function(d,i){return i;})
		.attr("cx",function(d,i){return xScale(i);})
		.attr("cy",function(d,i){
			switch(criteria){
				case 'video_watched':return yScale(d.video_watched);break;
				case 'problem_done':return yScale(d.problem_done);break;
				case 'problem_score':return yScale(d.problem_score);break;
				case 'time_spent':return yScale(d.time_spent);break;
				case 'sessions':return yScale(d.sessions);break;
				case 'session_avg':return yScale(d.session_avg);break;
				//case 'time_spent':return yScale(d.time_spent);break;
				default: 
					console.log('CY CRITERIA ERROR');
					return yScale(0);
			}
		})
		.attr("r",4)
		.attr("fill","#c00");
}


var csv_class=[];
d3.csv("class.csv",function(error,d){
	d.forEach(function(o){
		o.student_id=+o.student_id;
		o.problem_done=+o.problem_done;
		o.problem_score=+o.problem_score;
		o.sessions=+o.sessions;
		o.session_avg=+o.session_avg;
		o.time_spent=+o.time_spent;
		o.video_count=+o.video_count;
		o.video_watched=+o.video_watched;
	});
	csv_class=d;
	console.log("csv_class",csv_class.length);
	udpateClass(csv_class);
});

$(function(){
	$('#selector').change(function(o){
		if($('#selector').val())updateSelector(csv_class,$('#selector').val());
	});
});

</script>
<select id='selector' class='form-control'>
<option value=''>Select paramater to compare with the class</option>
<option value='video_watched'>Video watched</option>
<option value='problem_done'>Problem done (course completion)</option>
<option value='problem_score'>Problem score (for problem done !)</option>
<option value='time_spent'>Total time spent on site</option>
<option value='sessions'>Number of sessions</option>
<option value='session_avg'>Session average</option>
</select>
