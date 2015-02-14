// Video watched and problems view
var vpwidth = 700, vpheight = 135;
var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var vps = d3.select("#vidnprobs")
    .append("svg")
    //.attr("style", 'background-color:red')//test
    .attr("width", vpwidth)
    .attr("height", vpheight);
    
//add legent
vps.append("text")
        .attr("transform", "translate(10,50),rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill", "#999")
        .text("VIDEO");

vps.append("text")
        .attr("transform", "translate(10,130),rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill", "#999")
        .text("PROBLEMS");

var xScale = d3.time.scale().range([20, vpwidth-30]).domain([new Date("2018-09-14"),new Date("2018-12-24")]);
var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4).tickFormat(d3.time.format('%b')).tickSize(60).tickPadding(5);
//Append axis
vps.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, 60)')
    .style('shape-rendering','crispEdges')
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "11px")
    .style("text-anchor", "start");
//override css
vps.selectAll('.axis line, .axis path').style({'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

function updateVidnprobs(data){   
    //compute xscale
    var xScale = d3.time.scale().range([20, vpwidth-30]).domain([new Date("2018-09-14"),new Date("2018-12-24")]);
    var maxp=d3.max(data,function(o){return o.problem_done});
    var maxv=d3.max(data,function(o){return o.video_watched});
    //console.log(maxp,maxv);
    var videoScale=d3.scale.linear().range([0,60]).domain([0,maxv]);
    var problemScale=d3.scale.linear().range([0,60]).domain([0,maxp]);

    //delete previous axis (a bit silly since it dont change)
    
    //define xAxis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(4)//x tick
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        .tickFormat(d3.time.format('%b'))//Sep
        .tickSize(60)
        .tickPadding(5);
        
    //append axis
    /*
    vps.selectAll('g').remove();
    vps.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, 60)')
        .style('shape-rendering','crispEdges')
        .call(xAxis)
        .selectAll("text")
            .style("font-size", "11px")
            .style("text-anchor", "start");
    */
    //override css
    vps.selectAll('.axis line, .axis path').style({'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
    
    var b = vps.selectAll("rect.video").data(data);
    b.enter().append("rect")// video
          .attr("class", "video" )
          .attr("fill", function(d){return '#000';})
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("width",5)
          .attr("x",0)
          .attr("y",60)
          .attr("height" , 0)
          .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
                var htm="<b>"+d3.time.format('%A %d %b')(d.date) +" :: Video watched</b><hr />";
                //htm+= d.minutes_on_site+" minutes of video<br />";
                if(d.video){
                    //console.log(d.video);
                    htm+="<table width='100%'>";
                    htm+="<thead>"
                    htm+="<th>"+d.video.length+" video(s)</th>";
                    htm+="<th style='text-align:center'>Duration</th>";
                    htm+="<th style='text-align:right'>Watched</th>";
                    for(var i=0;i<d.video.length;i++){
                        htm+="<tr>";
                        htm+="<td>"+d.video[i].section+" - "+d.video[i].video_id;
                        //htm+="<td>"+d.video[i].video_id;
                        htm+="<td style='text-align:center'>"+d.video[i].duration_seconds;
                        
                        var pct=Math.round(d.video[i].watched_seconds/d.video[i].duration_seconds*100);
                        htm+="<td style='text-align:right;color:"+greyScale(pct)+"'><b>"+pct+"%</b></td>";
                    }
                    htm+="</tbody>";
                    htm+="</table>";
                }
                
                //htm+= "on "+d.subsection.join(", ");
                ttover(htm);
            })
          .on("mousemove",function(){ttmove();})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
          ;
    
    b.transition().delay(function(d,i){return i*20})
        .attr("x" , function(d){return xScale(d.date)-2.5;})
        .attr("y" , function(d){
            if(d.video){
                //console.log(d.video);
                //for(var i=0;i<d.video.length;i++)
                //return 10;
                return 60-videoScale(d.video_watched);
            }
            return 60;
        })
        .attr("height" , function(d){
            if(d.video){
                //return 10;
                return videoScale(d.video_watched);
            }
            return 0;
        });
    
    b.exit().remove();
    
    var c = vps.selectAll("rect.problems").data(data);
    c.enter().append("rect")// problems
        .attr("class", "problems" )
        .style("stroke-width",0)
        .attr("x" , 0)
        .attr("y" , 61)
        .attr("width",5)
        .attr("height",0)
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var pct=Math.round(d.problem_score/d.problem_done*100);
            var htm="<b>"+d3.time.format('%A %d %b')(d.date)+" :: "+d.problem.length+" problem(s) done</b><hr />";
            
            //htm+="<b>"+d.problem.length+" problem(s) done</b>";
            htm+="<table width=100%>";
            htm+="<thead>";
            htm+="<th>Problem(s) answered</th>";
            htm+="<th style='text-align:right'>Score</th>";
            htm+="</thead>";
            htm+="<tbdody>";
            for(var i=0;i<d.problem.length;i++){
                htm+="<tr>";
                htm+="<td>"+d.problem[i].section+" - "+d.problem[i].problem_id;
                htm+="<td style='text-align:right'>"+d.problem[i].score+"/1";
            }
            htm+="<tr><td><td style='text-align:right;color:"+colorDomain(pct)+"'><b>"+d.problem_score+"/"+d.problem_done+" ("+pct+"%)</b></td></tr>";
            htm+="</tbody>";
            htm+="</table>";
            
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;
    
    c.transition().delay(function(d,i){return i*20})
        .attr("fill", function(d){
            var pct=Math.round(d.problem_score/d.problem_done*100);
            return colorDomain(pct);
        })
        .style("stroke",function(d){return colorDomain(Math.round(d.problem_score/d.problem_done*100))})
        .attr("x" , function(d){return xScale(d.date)-2.5;} )
        .attr("height" , function(d){
            if(d.problem_done)return Math.max(0,problemScale(d.problem_done));
        })
    
    c.exit().remove();
    
}