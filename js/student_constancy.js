// Constant view

// Average session length : 40 minutes
// SELECT AVG(minutes_on_site) FROM `minutes_per_day` WHERE 1

var width = 700,
    height = 60;

var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");


var cns = d3.select("#constantDiv")
    .append("svg")
    //.attr("style", "background-color:red")
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




function updateConstancy(data){
    
    minuteDomain = d3.extent( data ,function(o){return o.minutes_on_site;});

    if(data.length<2){
        $('#moreConstant').html('Not enough data to compute constancy');
    } else {
        dd = d3.extent( data ,function(o){return o.date;});
        var daysb=daysBetween(dd[0],dd[1]);
        var xdays=Math.floor(daysb/data.length);
        $('#moreConstant').html(data.length+' session(s) from '+minuteDomain[0]+' to '+minuteDomain[1]+' minutes');
    }

    // compute xscale //
    var xScale = d3.time.scale().range([20, width-30]);
    dateDomain=[new Date("2018-09-14"),new Date("2018-12-24")];//fixed scale
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
    
    
    //cns.selectAll('g').remove();
    if(cns.selectAll('g')[0].length<1){//append axis only once
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
    }
    
    

    var b = cns.selectAll("circle.t1").data(data);
    b.enter().append("circle")
          .attr("class", "t1" )
          //.attr("fill", function(d){return '#ffcc00';})
          .attr("fill", function(d){return '#939da9';})
          .style("opacity", 1)
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("r" , 0 )
          .on("mouseover",function(d){
            //console.log(d);
            d3.select(this).style('stroke-width', 3);
            var htm="<b>"+d3.time.format('%A %d %b')(d.date)+" - "+d.minutes_on_site+" minutes</b><hr />";
            
            
            //Problems
            if(d.problem){
                
                htm+="<table width='100%'>";
                htm+="<thead>";
                htm+="<th>"+d.problem.length+" problem(s)</th>";
                htm+="<th style='text-align:right'>Score</th>";
                htm+="</thead>";
                htm+="<tbody>";
                for(var i=0;i<d.problem.length;i++){
                    htm+="<tr>";
                    htm+="<td>"+d.problem[i].problem_id;
                    htm+="<td style='text-align:right'>"+d.problem[i].score+"/"+d.problem[i].max_points;
                }
                htm+="</tbody>";
                htm+="</table>";
            }
            //Videos
            if(d.video){
                
                htm+="<table width='100%'>";
                htm+="<thead>";
                htm+="<th>"+d.video.length+" video(s)</th>";
                htm+="<th style='text-align:right'>Watched</th>";
                htm+="</thead>";
                htm+="<tbody>";
                for(var i=0;i<d.video.length;i++){
                    htm+="<tr>";
                    htm+="<td>"+d.video[i].section+" - "+d.video[i].video_id;
                    //htm+="<td>"+d.video[i].watched_seconds+"/"+d.video[i].duration_seconds;
                    var pct=Math.round(d.video[i].watched_seconds/d.video[i].duration_seconds*100);
                    htm+="<td style='text-align:right;color:"+greyScale(pct)+"'>"+pct+"%";
                }
                htm+="</tbody>";
                htm+="</table>";   
            }
            ttover(htm);
            })
          .on("mousemove",function(){d3.select(this).style('stroke-width', 3);ttmove();})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
          ;
      
    b.transition(50)
        .delay(function(d,i){return i*20})
        .attr("cx", function(d,i){return xScale(d.date);})
        .attr("cy", function(d,i){return 30;})
        .attr("r" , function(d){return rScale(d.minutes_on_site);});
      
    b.exit().remove(); 


    //updateConstantLegend(data);
    //console.log('constant done');
    

    //Draw legend 
    //Draw legend 
    //Draw legend 
    
    var minutes=0;
    for(var i=0;i<data.length;i++){
        minutes+=data[i].minutes_on_site;
    }
    var avg=minutes/data.length;
    //console.log(avg+" minutes per session (avg)");
    /*
    cns.append("text")
        .attr("transform", "translate(40,70)")
        .attr("fill", "#999")
        .style("font-size", "10px")
        .style("text-anchor", "left")
        .text("Student avg. : "+Math.round(avg)+"min");

    cns.append("text")
        .attr("transform", "translate(140,70)")
        .attr("fill", "#999")
        .style("font-size", "10px")
        .style("text-anchor", "left")
        .text(" - Class avg. : 40min");
    */
    /*
    cns.append("circle")
          .attr("class", "t1" )
          .attr("fill",'#ffcc00')
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("cx" , 80 )
          .attr("cy" , 90 )
          .attr("r" , rScale(avg) )

    cns.append("circle")
          .attr("class", "t1" )
          .attr("fill",'#ffcc00')
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("cx" , 100 )
          .attr("cy" , 90 )
          .attr("r" , rScale(40) )
          */
}


/*
function updateConstancyLegend(data){
    minuteDomain = d3.extent( data ,function(o){return o.minutes_on_site;});
    console.log('updateConstancyLegend()',minuteDomain);
    cns.selectAll("text").remove();
    cns.append("text")
        .attr("class", "legend")
        .attr("transform", "translate(20,20)")
        .attr("fill", "#999")
        .style("font-size", "10px")
        .style("text-anchor", "left")
        .text("From "+minuteDomain[0]+" to "+minuteDomain[1]+" minutes");
}   
*/
