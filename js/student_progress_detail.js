
var colors;//color domain
var colorDomain;

var width = 700,
    height = 50,
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
        return "translate(" + (i*((width)/8)) + ",0)";
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



function updateProgressDetails(data){
      console.log('updateProgressDetails()',data);
    
    // Draw problems done
    var pbs=weeks.append("rect")
        .attr("x",0)
        .attr("y",20)
        .attr("width",0)
        .attr("height",8)
        .attr("fill",function(d){
            /*
            var score=0;
            var done=0;
            $.each(data[d],function(lecture,o){
                if(o.problemscore)score+=o.problemscore;
                if(o.problemdone)done+=o.problemdone;
            });
            var pct=Math.round(score/done*100);
            //console.log(pct+"%");
            */
            return colorDomain(100);
        })//vert
        //.attr("stroke","#B9DB50")
        .attr("stroke-width","0")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            
            var htm="<b>"+d +" - x problems</b><hr />";
            
            htm+="<table width=100%>";
            htm+="<tr><td>";
            htm+="<td>Done";
            htm+="<td>Score";
            htm+="</tr>";

            $.each(data[d],function(lecture,o){
                
                //console.log(o.problem,Object.keys(o.problem));
                
                //compute score
                var score=0;
                for(var i=0;i<Object.keys(o.problem).length;i++){
                    var k=Object.keys(o.problem)[i];
                    //console.log(o.problem[k]);
                    score+=o.problem[k].score;
                }

                htm+="<tr><td>"+lecture;
                htm+="<td>"+score+"/"+Object.keys(o.problem).length;
                //htm+="<td>"+o.problemdone+"/"+o.problemcount+" done";
                htm+="<td>";
                if(score && Object.keys(o.problem).length){
                    htm+=Math.round(score/Object.keys(o.problem).length*100)+"%";
                }
                htm+="</tr>";
                //if(o.problemdone)problemdone+=o.problemdone;
                //if(o.problemcount)problemcount+=o.problemcount;
            });
            htm+="</table>";
            
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;

    pbs.transition().delay(function(d,i){return i*200})
    .attr("width",function(d){
        //console.log(d,data[d]);
        var problemdone=0;
        var problemcount=0;
        $.each(data[d],function(lecture,o){
            //if(o.problemdone)problemdone+=o.problemdone;
            //if(o.problemcount)problemcount+=o.problemcount;
        });
        //var pct=Math.round(problemdone/problemcount*colwidth);
        //if(pct)return pct;
        return 33;
    })

    // Draw video rectangles
    var vids=weeks.append("rect")
      .attr("x",0)
      .attr("y",30)
      .attr("width",0)
    .attr("height",8)
    .attr("fill","#000")
    .attr("stroke","#000")
    .attr("stroke-width","0")
    .on("mouseover",function(d){
        d3.select(this).style('stroke-width', 2);
        var htm="<b>"+d+" :: x videos<hr />";
        htm+="<table width=100%>";
        $.each(data[d],function(lecture,o){
            htm+="<tr><td>"+lecture+"<td>"+o.videopct+"%";
        });
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
    ;

    vids.transition().delay(function(d,i){return i*200})
        .attr("width",function(d){
        var video=0;
        $.each(data[d],function(lecture,o){
            //console.log(lecture,data[d].length);
            if(o.videopct)video+=o.videopct;
        });
        var pct=Math.round(video/2/100*colwidth);
        //var pct=Math.random()*colwidth;
        if(pct)return pct;
        return 33;
    })
}



//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    //getProgressData();
});