// d3js videos //
var data=[];
var width = 800,
    height = 120;

var color = d3.scale.category20c();
//var color = d3.scale.ordinal().range(mnc); 

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

function getData()
{
	console.log('getData()');
	var p = { 'do':'getVideos' };

	$("#more").load("ctrl.php",p,function(x){
		try{
			data=eval(x);
			updateBars();
			$("#more").html(data.length + " videos");
		}
		catch(e){
			console.log( "getData() error" , e.message );
		}
	});
}



function updateBars()
{
	var barw=width/data.length;
	console.log('updateBars()', data);
	
	var domain = d3.extent( data ,function(o){return o.duration_seconds});
	console.log('domain duration_seconds',domain);
	
	var yScale = d3.scale.linear().domain(domain).range([ 100 , 200 ] );
	var xScale = d3.scale.linear().domain([0,data.length]).range([ 0 , 800 ] );
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
	vis.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0,100)")
	    .call(xAxis);
	
	//style
	vis.selectAll('.axis line, .axis path').style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});


	// Bars //
	var b = vis.selectAll("rect.t1").data( data );
      b.enter().append("rect")
      .attr("fill", '#eee')
      .attr("class", "t1" )
      .attr("x", function(d,i){ return i*barw; })
      .attr("y" , 100 )
      .attr("width" , barw )
      .attr("height" , 1 )

      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);
    
	 

    // update
	b.transition(500)
  		//.attr("fill", function(d,i){return color(i);})
	  	.attr("x", function(d,i){ return i*barw; })
  		.attr("y", function(d,i){ return 100-d.watched;})
  		.attr("width" , width/data.length )
  		.attr("height" , function(d){ return d.watched;} );
  
	b.exit().remove(); 



	//Labels//
	/*
	var l = vis.selectAll("text.label").data( data );
  		l.enter().append("text")
  		.attr("text-anchor", "end")
  		.text(function(d){ return  d.name; })
  		.attr("class","label");

  	l.transition(500)
  		.attr("x", 190 )
  		.attr("y", function(d,i){return 40+i*20;});
	*/

}



/**
 * Tooltip
 */
var ttdiv = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 1e-6);

function mouseover(){
    ttdiv.transition().duration(100).style("opacity", 1);
    //console.log( $("div.tooltip").width() );
}

function mousemove(d,i){
    var html = "";
    html+="<b>" + d.section + "::" + d.subsection + "</b><br />\n";
    html+="<b>video " + d.id + "</b><br />\n";
    html+="<hr style='margin-top:4px;margin-bottom:4px' />";
    html+="<b>watched : " + d.watched + "</b><br />\n";
    html+="<b>duration : " + d.duration_seconds + " seconds</b><br />\n";
    ttdiv.html( html )
	.style("left", ttleft )
	.style("top", ( d3.event.pageY + 10 ) + "px");
}

function ttleft(){
	var max = $("body").width()-$("div.tooltip").width() - 20;
    return  Math.min( max , d3.event.pageX + 10 ) + "px";
}

function mouseout(){
    ttdiv.transition().duration(200).style("opacity", 1e-6);
}




$(function(){
	console.log("videos.js");
	getData();
})
