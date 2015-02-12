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
	<i class='fa fa-user'></i> Class
</h1>

<hr />

<?php
// CLASS DATA //
$minutes_per_day=[];
$problem_attempts=[];
$video_views=[];

$sql="SELECT * FROM minutes_per_day WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$r['minutes_on_site']*=1;
	$minutes_per_day[$r['student_id']][]=$r;
}

$sql="SELECT * FROM problem_attempts WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$problem_attempts[$r['student_id']][]=$r;
}

$sql="SELECT * FROM video_views WHERE 1;";
$q=$db->query($sql) or die("Error : $sql");
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$r['student_id']*=1;
	$video_views[$r['student_id']][]=$r;
}
?>

<div id='classDiv'></div>

<script>
<?php
echo "var mpd=".json_encode($minutes_per_day).";\n";
echo "var pa=".json_encode($problem_attempts).";\n";;
echo "var vv=".json_encode($video_views).";\n";;
?>
var width = 800,
    height = 600;//

var cls = d3.select("#classDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

//define xAxis
var xScale = d3.scale.linear().range([20, width-30]);
/*
var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5)//x tick
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        .tickFormat(d3.time.format('%b'))//27Sep
        .tickSize(10)
        .tickPadding(5);
*/

cls.append("text").text("text");
cls.append("rect")
	.attr("x",10)
	.attr("y",10)
	.attr("width",100)
	.attr("height",100)
	.attr("fill","red");

var m=cls.selectAll("rect.avg").data(mpd);
	m.enter()
		.append("rect")
		.attr("x",function(d,i){return i*3;})
		.attr("y",function(d,i){return 33})
		.attr("width",2)
		.attr("height",100)
		.attr("fill","#999");


/*
function udpateClass(){

	var xScale = d3.time.scale().range([20, width-30]);

    // Start domain on 14 september for better readability
    dateDomain=[new Date("2018-09-14"),new Date("2018-12-24")];//fixed scale
    xScale.domain(dateDomain);
    
    var rScale = d3.scale.linear().domain(minuteDomain).range([3, 10]);
    
    
}
*/




</script>
