
var colors;//color domain
var colorDomain;

var width = 700,
    height = 50,
    cellSize = 12, // cell size
    colwidth=(width)/8;//col width (weeks)

var vis = d3.select("#progressDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

// rect 1
/*
vis.append("rect")
    .attr("fill","#eee")
    .attr("y", 20)
    .attr("width",700)
    .attr("height",16)
    //.append("text").text("Test on the rect");
    ;

// rect 2
vis.append("rect")
    .attr("fill","#f6f6f6")
    .attr("y", 38)
    .attr("width",700)
    .attr("height",16)
    //.append("text").text("Test on the rect");
    ;
*/

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

// Draw invisible recangles for mouseover (foireux)
/*
weeks.append("rect")
    .attr("x",0).attr("y",0)
    .attr("width",width/8)
    .attr("height",100)
    .attr("fill",'#fff')
    .on("mouseover",function(d){
        var htm="";//
        $.each(progressdata[d],function(lecture,o){
            htm+="<b>"+lecture+"</b><hr style='margin-top:4px;margin-bottom:4px;' />";
            htm+=o.problemdone+"/"+o.problemcount+" problems done<br />";
            htm+=o.videopct+"% video watched<br />";
            //htm+="<br />";
        });        
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){ttout();})
    ;
*/  

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




// Draw video rectangles
var progressdata;//global for tooltips
function getProgressData(){
    //console.log('getProgressData()');
    var p={
        'do':'getWeeklyProgress',
        'student_id':$('#student_id').val()
    }
    
    $('#progressMore').load("student_ctrl.php",p,function(json){        
        try{  
            var data=$.parseJSON(json);
            progressdata=data;
            updateProgress(data);
            
            //compute stats
            var problemcount=0,
                problemdone=0,
                problemscore=0,
                videopct=0;
            $.each(data,function(week,objs){
                $.each(objs,function(subsection,o){
                    //console.log(week,subsection,o);
                    if(o.problemcount)problemcount+=o.problemcount;
                    if(o.problemdone)problemdone+=o.problemcount; else o.problemdone=0;
                    if(o.problemscore)problemscore+=o.problemscore; else o.problemscore=0;
                    if(o.videopct)videopct+=o.videopct; else o.videopct=0;
                })
            });
            var problemprogress=Math.round(problemdone/problemcount*100);
            var videoprogress=Math.round(videopct/16);
            //console.log();
            $('#progressMore').html(problemprogress+"% problems done, "+videoprogress+"% video watched ");
        }
        catch(e){
            console.log(e);
        }
    });
}


function updateProgress(data){
    //  console.log('updateProgress()',data);
    
    // Draw problems done
    var pbs=weeks.append("rect")
        .attr("x",0)
        .attr("y",20)
        .attr("width",0)
        .attr("height",8)
        .attr("fill",function(d){
            var score=0;
            var done=0;
            $.each(data[d],function(lecture,o){
                if(o.problemscore)score+=o.problemscore;
                if(o.problemdone)done+=o.problemdone;
            });
            var pct=Math.round(score/done*100);
            //console.log(pct+"%");
            return colorDomain(pct);
            //return "#B9DB50";
        })//vert
        //.attr("stroke","#B9DB50")
        .attr("stroke-width","0")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            
            var htm="<b>"+d +" problems</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>";
            htm+="<td>Done";
            htm+="<td>Score";
            htm+="</tr>";

            $.each(data[d],function(lecture,o){
                
                htm+="<tr><td>"+lecture;
                htm+="<td>"+o.problemdone+"/"+o.problemcount;
                //htm+="<td>"+o.problemdone+"/"+o.problemcount+" done";
                htm+="<td>";
                if(o.problemscore && o.problemdone){
                    htm+=Math.round(o.problemscore/o.problemdone*100)+"%";
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
            if(o.problemdone)problemdone+=o.problemdone;
            if(o.problemcount)problemcount+=o.problemcount;
        });
        var pct=Math.round(problemdone/problemcount*colwidth);
        if(pct)return pct;
        return 0;
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
        var htm="<b>"+d+" video watched<hr />";
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
        return 0;
    })
}



//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    getProgressData();
});