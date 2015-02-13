
/* d3js template */
var data=[];
var width = 800,
    height = 600;

var color = d3.scale.category20c();
//var color = d3.scale.ordinal().range(mnc); 


var vis = d3.select("#chart1").append("svg")
    .attr("width", width)
    .attr("height", height);



function getData()
{
	console.log('getData()');
	
	var p = { action:'getData' };

	$("#more").load("ctrl.php",p,function(x){
		try{
			eval(x);
			updateGrid();
		}
		catch(e){
			console.log( "getData() error" , e.message );
		}
	});
}


function updateGrid()
{
	
	console.log('updateGrid');

	var domain = d3.extent( data ,function(o){return o.vsls;});
	var vslScale = d3.scale.linear().domain(domain).range([ 5 , 30 ] );

	//Bubbles//
	var b = vis.selectAll("circle.t1").data( data );
      b.enter().append("circle")
      .attr("class", "t1" )
      .attr("r" , 0 )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);
      

	b.transition(500)
  	.attr("fill", function(d){return color(d.flag);})
  	.attr("cx", function(d,i){return i%10 * width/10 + 45;})
  	.attr("cy", function(d,i){return Math.floor(i/10) * height/10 + 45;})
  	.attr("r" , function(d){return vslScale(d.vsls);} );
  
	b.exit().remove(); 

	//Labels//
	var l = vis.selectAll("text.label").data( data );
  		l.enter().append("text")
  		//.attr("opacity",0)
  		.attr("y",0)
  		.attr("text-anchor", "middle")
  		.text(function(d){ return  d.name; })
  		.attr("class","label");

  	l.transition(500)
  		.attr("x", function(d,i){return i%10 * width/10 + 45;})
  		.attr("y", function(d,i){return Math.floor(i/10) * height/10 + 82;});

}



function updateBars()
{

	console.log('updateView()');
	var domain = d3.extent( data ,function(o){return o.vsls});
	console.log('domain',domain);
	var vslScale = d3.scale.linear().domain(domain).range([ 200 , 900 ] );
	var xAxis = d3.svg.axis().scale(vslScale).orient("top");
  
	vis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,20)")
    .call(xAxis);
    //style
	vis.selectAll('.axis line, .axis path').style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});



	//Bubbles//
	var b = vis.selectAll("circle.t1").data( data );
      b.enter().append("circle")
      .attr("class", "t1" )
      .attr("r" , 0 )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);
      

	b.transition(500)
  	.attr("fill", function(d){return color(3);})
  	.attr("cx", function(d,i){ return vslScale(d.vsls); })
  	.attr("cy", function(d,i){ return 37+i*20;})
  	.attr("r" , 8 );
  
	b.exit().remove(); 



	//Labels//
	var l = vis.selectAll("text.label").data( data );
  		l.enter().append("text")
  		.attr("text-anchor", "end")
  		.text(function(d){ return  d.name; })
  		.attr("class","label");

  	l.transition(500)
  		.attr("x", 190 )
  		.attr("y", function(d,i){return 40+i*20;});


}








/**
 * Tooltip
 */
var ttdiv = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 1e-6);

function mouseover(){
    ttdiv.transition().duration(200).style("opacity", 1);
    //console.log( $("div.tooltip").width() );
}

function mousemove(d,i){
    var html = "";
    html+="<b>" + d.name + "</b><br />\n";
    html+="<hr style='margin-top:4px;margin-bottom:4px' />";
    html+= d.vsls + " vessels<br />\n";
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


/**
 * Go baby go
 */
$(function(){
	console.log("index.js ready");
	getData();
});

