// Video and problems view

var width = 700,
    height = 160;

//var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var vps = d3.select("#vidnprobs")
    .append("svg")
    //.attr("style", 'background-color:red')//test
    .attr("width", width)
    .attr("height", height);
    
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

/*
function loadVidnProbs(){
    //console.log('loadVidnProbs()');
    var p={
        'do':'getDailyData',
        'student_id':$('#student_id').val()
    }
    $('#moreVidndprobs').html("loading...");
    $('#moreVidndprobs').load("student_ctrl.php",p,function(x){
        try{
            dat=JSON.parse(x);
            dat.forEach(function(d) {
                d.date = d3.time.format("%Y-%m-%d").parse(d.date);
            });            
            // console.log("dat",dat);
            updateVidnprobs(dat);

            if(dat.length){
                $('#moreVidndprobs').html(dat.length+' record(s)');
            }            
        }
        catch(e){
            console.log(e);
        }
    });
}
*/


function updateVidnprobs(data){

    //console.log('updateVidnprobs()',data);    
    
    //compute o.problem_done and o.video_watched
    
    
    //compute xscale
    dateDomain=[new Date("2018-09-14"),new Date("2018-12-24")];//fixed scale
    var xScale = d3.time.scale().range([20, width-30]).domain(dateDomain);
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
    vps.selectAll('g').remove();
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
    
    var b = vps.selectAll("rect.video").data(data);
    b.enter().append("rect")// video
          .attr("class", "video" )
          .attr("fill", function(d){return '#000';})
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("width" , 5 )
          .attr("x" , function(d){return xScale(d.date);} )
          .attr("y" , 60)
          .attr("height" , 0)
          .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
                var htm="<b>"+d3.time.format('%A %d %b')(d.date) +" :: x minutes of video</b><hr />";
                //htm+= d.minutes_on_site+" minutes of video<br />";
                if(d.video){
                    htm+="<b>"+d.video.length+" video(s)</b>";
                    htm+="<table width='100%'>";
                    for(var i=0;i<d.video.length;i++){
                        htm+="<tr>";
                        htm+="<td>"+d.video[i].video_id;
                        //htm+="<td>"+d.video[i].watched_seconds;
                        //htm+="<td>"+d.video[i].duration_seconds;
                        htm+="<td>"+Math.round(d.video[i].watched_seconds/d.video[i].duration_seconds*100)+"%";
                    }
                    htm+="</table>";
                }
                
                //htm+= "on "+d.subsection.join(", ");
                ttover(htm);
            })
          .on("mousemove",function(){ttmove();})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
          ;
    
    b.transition().delay(function(d,i){return i*20})
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
        .attr("x" , function(d){return xScale(d.date);} )
        .attr("y" , 61)
        .attr("width",5)
        .attr("height",0)
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var pct=Math.round(d.problem_score/d.problem_done*100);
            var htm="<b>"+d3.time.format('%A %d %b')(d.date)+" :: "+d.problem.length+" problem(s) done</b><hr />";
            
            //htm+="<b>"+d.problem.length+" problem(s) done</b>";
            htm+="<table width=100%>";
            for(var i=0;i<d.problem.length;i++){
                htm+="<tr>";
                htm+="<td>"+d.problem[i].problem_id;
                htm+="<td>"+d.problem[i].score+"/1";
            }
            htm+="</table>";
            htm+="Score: "+d.problem_score+"/"+d.problem_done+" ("+pct+"%)<br />";
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
        .attr("height" , function(d){
            if(d.problem_done)return Math.max(0,problemScale(d.problem_done));
        })
    
    c.exit().remove();
    
}

//var formatDate=d3.time.format('%d %b');
/*
$(function(){
    loadVidnProbs();
});
*/