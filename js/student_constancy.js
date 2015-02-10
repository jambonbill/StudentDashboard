// Constant view

var width = 700,
    height = 100;

var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");


var cns = d3.select("#constantDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
/*
cns.append("text")
        .attr("transform", "translate(10,60),rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill", "#999")
        .text("MINUTES");
*/


function loadConstant(){
    //console.log('loadConstant()');
    var p={
        'do':'getDailyData',
        'student_id':$('#student_id').val()
    }
    $('#moreConstant').html("loading...");
    $('#moreConstant').load("student_ctrl.php",p,function(x){
        try{
            dat=JSON.parse(x);
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            dat.forEach(function(d) {
                d.date = parseDate(d.date);
            });
            //console.log("dat",dat);
            updateConstancy(dat);

            dd = d3.extent( dat ,function(o){return o.date;});
            var daysb=daysBetween(dd[0],dd[1]);
            //console.log('daysBetween(dd[0],dd[1])',daysb);
            if(dat.length<2){
                $('#moreConstant').html('Not enough data to compute constancy');
            } else {
                var xdays=Math.floor(daysb/dat.length);
                //$('#moreConstant').html(dat.length+' session(s) over '+(daysb+1)+' day(s), or approx every '+xdays+' days');
                minuteDomain = d3.extent( dat ,function(o){return o.minutes_on_site;});
                $('#moreConstant').html(dat.length+' session(s) from '+minuteDomain[0]+' to '+minuteDomain[1]+' minutes');
            }
        }
        catch(e){
            console.log(e);
        }
    });
}



function updateConstancy(data){
    //console.log('updateConstant()',data);
    minuteDomain = d3.extent( data ,function(o){return o.minutes_on_site;});
    
    //compute xscale
    var xScale = d3.time.scale().range([20, width-30]);
    // Start domain on 14 september for better readability
    //dateDomain[0]=new Date("2018-09-14");//start of the course
    dateDomain=[new Date("2018-09-14"),new Date("2018-12-24")];//fixed scale
    //dateDomain[1]=new Date(dateDomain[1].setDate(dateDomain[1].getDate()+1));
    //console.log(dateDomain[0]);
    xScale.domain(dateDomain);
    
    var rScale = d3.scale.linear().domain(minuteDomain).range([3, 10]);
    
    //define xAxis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5)//x tick
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        .tickFormat(d3.time.format('%b'))//27Sep
        .tickSize(10)
        .tickPadding(5);

    //var xAxis = d3.svg.axis().scale(xScale);
    
    //append axis
    cns.append('g')
        .attr('class', 'axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(0, 30)')
        .call(xAxis)
        .selectAll("text")
            .style("font-size", "11px")
            .style("text-anchor", "start");
            
    //override css
    cns.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

    var b = cns.selectAll("circle.t1").data(data);
    b.enter().append("circle")
          .attr("class", "t1" )
          .attr("fill", function(d){return '#ffcc00';})
          .style("opacity", 1)
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("r" , 0 )
          .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 3);
            var htm="<b>"+d3.time.format('%A %d %b')(d.date)+"</b><hr />";
            htm+=d.minutes_on_site+" minutes on site";
            ttover(htm);
            })
          .on("mousemove",function(){d3.select(this).style('stroke-width', 3);ttmove();})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
          /*
          .append("title").text(function(d){ 
                return d3.time.format('%d %b')(d.date)+" - "+d.minutes + " minutes";
            })
          */
          ;
      
    b.transition(50)
        .delay(function(d,i){return i*20})
        .attr("cx", function(d,i){return xScale(d.date);})
        .attr("cy", function(d,i){return 30;})
        .attr("r" , function(d){return rScale(d.minutes_on_site);});
      
    b.exit().remove(); 


    //updateConstantLegend(data);
    //console.log('constant done');
}


function updateConstantLegend(data){
    minuteDomain = d3.extent( data ,function(o){return o.minutes_on_site;});
    //console.log('updateConstantLegend()',minuteDomain);
    cns.append("text")
        .attr("transform", "translate(20,20)")
        .attr("fill", "#999")
        .style("font-size", "10px")
        .style("text-anchor", "left")
        .text("From "+minuteDomain[0]+" to "+minuteDomain[1]+" minutes");
}   


$(function(){
    loadConstant();
});