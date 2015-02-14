
var colors;//color domain
var colorDomain;

var width = 710,
    height = 60,
    cellSize = 12, // cell size
    colwidth=(width)/8;//col width (weeks)

var vis = d3.select("#progressDiv").append("svg")
    .attr("width", width)
    .attr("height", height);


// draw week groups
var weeks=vis.selectAll(".weeks")
    .data(['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'])
  .enter()
    .append("g")
    .attr("class", "weeks")
    .attr("style", "font-size:11px")
    .attr("fill", "#999")
    .attr("transform", function(d,i){
        return "translate(" + (i*((width)/8)) + ",10)";
    })
    ;

// Draw title
weeks.append("text")
  .text( function(d,i){return d.toUpperCase();})
    .attr("transform", "translate(4,10)");


// Draw vertical separators
weeks.append("line")
    .attr("x1",0)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",50)
    .attr('stroke', '#ddd')
    .attr('stroke-width', 1)
    .attr("class","crisp")
    ;
// Draw last separator
vis.append("line")
    .attr("x1",width-1)
    .attr("x2",width-1)
    .attr("y1",10)
    .attr("y2",60)
    .attr('stroke', '#ddd')
    .attr('stroke-width', 1)
    .attr("class","crisp")
    ;


function updateProgressDetails(data){
    //console.log('updateProgressDetails()',data);
    weeks.selectAll("rect").remove();

    // Draw problems done
    var pbs=weeks.append("rect")
        .attr("class","problem")
        .attr("x",0)
        .attr("y",20)
        .attr("width",0)
        .attr("height",8)
        .attr("fill",function(d){
            //console.log(data[d]);
            var score=0;
            var done=0;
            $.each(data[d],function(lecture,o){
                if(o.problem_score)score+=o.problem_score;
                if(o.problem_done)done+=o.problem_done;
            });
            return colorDomain(score/done*100);
        })//vert
        .attr("stroke","#000")
        .attr("stroke-width","0")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 1);
            
            var htm="<b>"+d +" Problems</b><hr />";
            
            htm+="<table width=100%>";
            htm+="<thead><th></th>";
            htm+="<th style='text-align:center'>Answered</th>";
            htm+="<th style='text-align:right'>Success</th>";
            htm+="</thead>";
            htm+="<tbody>";
            $.each(data[d],function(lecture,o){                
                //console.log(o.problem,Object.keys(o.problem));
                htm+="<tr><td>"+lecture;
                htm+="<td style='text-align:center'>"+o.problem_done+"/"+o.problem_count;
                var pct=Math.round(o.problem_score/o.problem_count*100);
                htm+="<td style='text-align:right;color:"+colorDomain(pct)+"'><b>"+pct+"%</b></td>";
                htm+="</tr>";
            });
            htm+="</tbody>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;

    pbs.transition().delay(function(d,i){return i*100})
    .attr("width",function(d){
        //console.log(d,data[d]);
        var problem_done=0;
        var problem_count=0;
        $.each(data[d],function(lecture,o){
            if(o.problem_done)problem_done+=o.problem_done;
            if(o.problem_count)problem_count+=o.problem_count;
        });
        var pct=Math.round(problem_done/problem_count*colwidth);
        if(pct)return pct;
        return 0;
    });

    //pbs.exit().remove();

    // Draw video rectangles
    var vids=weeks.append("rect")
      .attr("class","video")
      .attr("x",0)
      .attr("y",30)
      .attr("width",0)
    .attr("height",8)
    .attr("fill","#000")
    .attr("stroke","#000")
    .attr("stroke-width","0")
    .on("mouseover",function(d){
        //console.log(data[d]);
        d3.select(this).style('stroke-width', 2);
        var htm="<b>"+d+" Videos<hr />";
        $.each(data[d],function(lecture,o){
            //console.log(o.video);
            htm+="<table width='100%'>";
            htm+="<thead>";
            htm+="<th>"+lecture+"</th>";
            htm+="<th style='text-align:center'>Duration</th>";
            htm+="<th style='text-align:right'>Watched</th></thead>";
            htm+="<tbody>";
            for(var i=0;i<Object.keys(o.video).length;i++){
                var k=Object.keys(o.video)[i];
                htm+="<tr><td>"+k;
                
                htm+="<td style='text-align:center'>"+Math.round(o.video[k].duration_seconds/60)+"m "+o.video[k].duration_seconds%60+"s";
                
                if(o.video[k].watched_seconds){
                    var pct=Math.round(o.video[k].watched_seconds/o.video[k].duration_seconds*100);
                } else {
                    var pct=0;
                }
                htm+="<td style='text-align:right;color:"+greyScale(pct)+"'><b>"+pct+"%</b></td>";

            }

            htm+="</tbody>";
            htm+="</table>";
        });
        
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
    ;

    vids.transition().delay(function(d,i){return i*100})
        .attr("width",function(d){
        var duration=0;
        var watched=0;
        $.each(data[d],function(lecture,o){
            duration+=o.video_duration;
            if(o.watched_seconds)watched +=o.watched_seconds;
        });
        //console.log("watched:"+watched,"duration:"+duration);
        if(duration && watched){
            return (watched/duration*colwidth);
        }
        
        //var pct=Math.round(video/2*colwidth);
        //var pct=Math.random()*colwidth;
        //if(pct)return pct;
        return 0;
    });
};