var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

//Progress colors (Ailadi scheme)
var colors=['#CC0000','#FF5F06','#F39224','#EDC82B','#E5E131','#E5E131','#B9DB50','#B9DB50','#8DD685','#30ad77'];

// colors.push('#CC0000');//Dark red
// colors.push('#FF5F06');//Rouge orange
// colors.push('#F39224');
// colors.push('#EDC82B');
// colors.push('#E5E131');//Yellow
// colors.push('#E5E131');//Yellow
// colors.push('#B9DB50');//Green (over 50%)
// colors.push('#B9DB50');//Green (over 50%)
// colors.push('#8DD685');
// colors.push('#30ad77');//Vert correct


var scoreDomain=[0,10,20,30,40,50,60,70,80,90,100];


var colorDomain=d3.scale.linear().domain(scoreDomain).range(colors);
var greyScale=d3.scale.linear().domain([0,100]).range(['#666','#eee']);//video completion

var pvis = d3.select("#progressOvDiv").append("svg").attr("width", 200).attr("height", 114);
var lgnd = d3.select("#scoreLegend").append("svg").attr("width", 200).attr("height", 30);


//also declared in student_calendar.js !
function daysBetween(a, b) {
    var one = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var two = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    var msecondsPerDay = 1000 * 60 * 60 * 24;
    var mBetween = two.getTime() - one.getTime();
    //var days = mBetween / msecondsPerDay;
    return Math.floor(mBetween/msecondsPerDay);
}




function colorLegend2(colors){

    var x=0,y=0,cellwidth=150/colors.length;
    
    //lgnd.append('text').attr('font-size','11px').attr("fill","#999").attr("transform", "translate("+x+","+(y+26)+")").text('BAD');
    //lgnd.append('text').attr('font-size','11px' ).attr("fill","#999").attr("transform","translate("+(x+158)+","+(y+26)+")").style("text-anchor","end").text('GOOD');
    
    lgnd.selectAll(".colors").data(colors).enter()
        .append("rect").attr("width", cellwidth).attr("height", 8)
        .attr("x", function(d,i){return x+i*(cellwidth+1);}).attr("y", y+8)
        .attr("fill", function(d,i){return d;})
        .on("mouseover",function(d,i){
            var htm=scoreDomain[i]+"%";
            if(i<scoreDomain.length-1){
                htm="Problem score from "+scoreDomain[i]+"% to "+scoreDomain[(i+1)]+"%";
            }else{
                htm="Problem score over "+scoreDomain[i]+"%";
            }
            ttover(htm);
        })
        .on("mousemove",function(d){ttmove()})
        .on("mouseout", function(d){ttout();});
}

//draw the color legend (new version)
colorLegend2(colors);


// An arc function with all values bound except the endAngle. So, to compute an
// SVG path string for a given angle, we pass an object with an endAngle
// property to the `arc` function, and it will return the corresponding string.
var arc1 = d3.svg.arc().innerRadius(46).outerRadius(54).startAngle(0);
var arc2 = d3.svg.arc().innerRadius(31).outerRadius(39).startAngle(0);

// add a first circle
pvis.append("circle").attr("cx",60).attr("cy",60).attr("r",50).attr("fill","white").attr("stroke","#ddd").attr("stroke-width",1);

// add a 2nd circle
pvis.append("circle").attr("cx",60).attr("cy",60).attr("r",35).attr("fill","white").attr("stroke","#ddd").attr("stroke-width",1);

// Video
pvis.append("text").attr("class","txt").attr("x",60).attr("y",75).text("Video").attr("fill","#999")
    .style("font-size", "10px").style("text-anchor", "middle");

// Problems
pvis.append("text").attr("class","txt").attr("x",125).attr("y",28).text("Problems").attr("fill", "#999")
    .style("font-size", "10px").style("text-anchor", "middle");


function computeStats(data){
    
    var mm=d3.extent(data,function(d){return d.date});
    var problem_done=0,problem_score=0,video_watched=0,minutes_on_site=0;
    
    $.each(data,function(i,o){
        //console.log(i,o);
        if(o.problem_done)problem_done+=o.problem_done;
        if(o.problem_score)problem_score+=o.problem_score;
        if(o.video_watched)video_watched+=o.video_watched;//in seconds
        if(o.minutes_on_site)minutes_on_site+=o.minutes_on_site;
    });
    

    // HTML //
    // HTML //
    // HTML //
    var problemprogress=(problem_done/108);
    var problemscore=0;
    if(problem_score>0&&problem_done>0)var problemscore=(problem_score/problem_done);
    var videoprogress=(video_watched/49452);

    // Score
    $('#scoreTitle').html("Score: <span style='color:"+colorDomain(problemscore*100)+"'>"+problem_score+"/"+problem_done+"</span>");
    $('#scoreTitle').attr("title",problem_score+'/'+problem_done+" problem(s) done");

    var htm="";

    if(problem_done>0){
        htm+=problem_score+"/"+problem_done+" correct <span class='pull-right' style='color:"+colorDomain(problemscore*100)+"'>"+Math.round(problemscore*100)+"%</span><br />";
    }else{
        htm+="<br />";
    }
    
    
    //htm+="Done: "+problem_score+"/"+problem_done+"<span class='text-muted pull-right'>"+Math.round(problemscore*100)+"%</span><br />";
    //htm+="Done: "+problem_score+"/"+problem_done+"<span class='text-muted pull-right'>66%</span>";
    
    if(problem_done==108){
        htm+="<i class='fa fa-exclamation-circle' style='color:"+colorDomain(problemscore*100)+"'></i> All problems done !";
    } else if(problem_done==0) {
        htm+="<i class='fa fa-warning' style='color:#c00'></i> No problem done";
    } else {
        htm+="<i class='fa fa-arrow-right'></i> <b>"+(108-problem_done) +"</b> problem(s) left";
    }

    htm+="<hr />";

    $('#scoreBody').html(htm);

    // Start date - https://github.com/mbostock/d3/wiki/Time-Formatting
    var htm=d3.time.format('%A %d %b %Y')(mm[0])+"<br />";
    htm+="<i class='fa fa-clock-o'></i> "+Math.round(minutes_on_site/60)+" hours working<br />";

    var daysago=daysBetween(new Date(mm[0]),new Date('2018-12-24'));//last connection
    
    htm+="<hr />";
    htm+="<i class='text-muted'>"+daysago+" days ago</i>";
    $('#start').html(htm);




    // 'Connected' (sessions)
    $('#connectedTitle').html("<i class='fa fa-calendar-o'></i> Sessions");
    

    var htm="";
    
    //Sessions
    htm+="<b>"+data.length+"</b> session(s)<br />";

    // Average session time
    var avg=Math.round(minutes_on_site/data.length);
    //htm+="Avg session : "+avg+" min<br />";
    htm+="<i class='fa fa-clock-o'></i> "+avg+" minutes avg.<br />";

    htm+="<hr />";

    var daysago=daysBetween(new Date(mm[1]),new Date('2018-12-24'));//last connection
    if(daysago>15){
        htm+="<i class='fa fa-warning' style='color:#c00'></i> <i class='text-muted'>Last seen "+daysago+" days ago</i><br />";
    }else{
        htm+="<i class='text-muted'>Last seen "+daysago+" day(s) ago</i><br />";
    }
    
       
    $('#connectedBody').html(htm);


    
    
        
    pvis.selectAll("path").remove();//Todo : update path instead

    // Arc problems
    var foreground1=pvis.append("path")
        .attr("class", 'arc1')
        .datum({endAngle:(problemprogress*tau)})
        .style("fill", colorDomain(problemscore*100))
        .style("stroke", colorDomain(problemscore*100))
        .style("stroke-width", 0)
        .attr("d", arc1)
        .attr("transform", "translate(60,60)")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var htm="<b>Course problems progression</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>Completion<td>"+problem_done+"/108<td>"+Math.round(problemprogress*100)+"%";
            var pct=Math.round(problemscore*100);
            var color=colorDomain(pct);
            htm+="<tr><td style='color:"+color+"'>Score<td style='color:"+color+"'>"+problem_score+"/"+problem_done+"<td><b style='color:"+color+"'>"+pct+"%</b>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();});
    
    //console.log('problemdone/problemcount',problemdone/problemcount);

    // Arc video
    var foreground2=pvis.append("path")
        .attr("class", 'arc2')
        .datum({endAngle:(videoprogress*tau)})
        .style("fill", "#000")
        .style("stroke", "#000")
        .style("stroke-width", 0)
        .attr("d", arc2)
        .attr("transform", "translate(60,60)")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var htm="<b>Course videos progression</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>"+Math.round(video_watched/60)+"/"+Math.round(49452/60)+" minutes";
            htm+="<td>"+Math.round(videoprogress*100)+"%</tr>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();});
    


    // Video progress %    
    var a = pvis.selectAll("text.pctvideo").data([Math.round(videoprogress*100)]);
        a.enter().append("text").attr("class","pctvideo")
        .attr("x",60).attr("y",65).text("0%")
        .style("font-size", "24px").style("text-anchor", "middle")
        
        a.transition().text(function(d){return d+"%";});

    // Problem progress %
    var b = pvis.selectAll("text.pctproblem").data([problemprogress]);
        b.enter().append("text").attr("class","pctproblem")
        .attr("x",125).attr("y",18).text("0%")   
        .style("font-size", "24px").style("text-anchor", "middle");
    
        b.transition()
            //.attr("fill",colorDomain(problemscore*100))
            .text(function(d){return Math.round(d*100)+"%";});

    //score (todo :  complete !)
    var l=lgnd.selectAll("g.score").data([problem_score]);
        
    var g=l.enter().append("g").attr("class","score")
        .attr('font-family', 'FontAwesome').attr('font-size', '18px')
        .append("text").text("\uf0dd").append("title").text('title');
    
    //Todo : add a second, vertical arrow
    //g.append("text").text("Test").attr("transform", "translate(5,5)");
    //.append("text").text("\uf0de");
    
    //update group position
    l.transition().attr("transform", function(d){
        return "translate("+(d/100*140)+",5)";
    });
}

