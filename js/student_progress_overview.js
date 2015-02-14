var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

//Progress colors (Ailadi scheme)
var colors=[];
colors.push('#FF5F06');//Rouge orange
colors.push('#F39224');
colors.push('#EDC82B');
colors.push('#E5E131');
colors.push('#B9DB50');
colors.push('#8DD685');
colors.push('#30ad77');//Vert correct

var colorDomain=d3.scale.linear().domain([0,40,50,60,80,90,100]).range(colors);
var greyScale=d3.scale.linear().domain([0,100]).range(['#666','#eee']);//video completion

var pvis = d3.select("#progressOvDiv").append("svg").attr("width", 200).attr("height", 114);
var lgnd = d3.select("#endBody").append("svg").attr("width", 200).attr("height", 100);


//also declared in student_calendar.js !
function daysBetween(a, b) {
    var one = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var two = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    var msecondsPerDay = 1000 * 60 * 60 * 24;
    var mBetween = two.getTime() - one.getTime();
    var days = mBetween / msecondsPerDay;
    return Math.floor(days);// Round down.
}


function colorLegend(colors){
    
    var x=0,y=130,cellwidth=16;

    pvis.append('text').attr('font-size', '11px' )
        .attr("fill", "#000")
        .attr("transform", "translate("+x+","+y+")")
        .text('Answer quality legend');

    pvis.append('text').attr('font-size', '11px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+x+","+(y+20)+")")
        .text('BAD');

    pvis.append('text').attr('font-size', '11px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+(x+90)+","+(y+20)+")")
        .text('GOOD');

    pvis.selectAll(".colors").data(colors)
        .enter()
        .append("rect")
        .attr("width", cellwidth)
        .attr("height", 6)
        .attr("x", function(d,i){return x+i*(cellwidth+1);})
        .attr("y", y+4)
        .attr("fill", function(d){return d;})
        .append("title").text(function(d){return d;});
}

//draw color legend
//colorLegend(colors);
//draw another version
colorLegend2(colors);

function colorLegend2(colors){

    var x=0,y=0,cellwidth=140/colors.length;
    /*
    lgnd.append('text').attr('font-size', '11px' )
        .attr("fill", "#000")
        .attr("transform", "translate("+x+","+y+")")
        .text('Problem answer legend');
    */
    lgnd.append('text').attr('font-size','11px').attr("fill","#999")
        .attr("transform", "translate("+x+","+(y+26)+")").text('BAD');

    lgnd.append('text').attr('font-size', '11px' ).attr("fill","#999")
        .attr("transform","translate("+(x+146)+","+(y+26)+")")
        .style("text-anchor","end").text('GOOD');

    lgnd.selectAll(".colors").data(colors).enter()
        .append("rect")
        .attr("width", cellwidth).attr("height", 8)
        .attr("x", function(d,i){return x+i*(cellwidth+1);})
        .attr("y", y+8)
        .attr("fill", function(d){return d;})
        .append("title").text(function(d){return d;});   
}


// An arc function with all values bound except the endAngle. So, to compute an
// SVG path string for a given angle, we pass an object with an endAngle
// property to the `arc` function, and it will return the corresponding string.
var arc1 = d3.svg.arc()
    .innerRadius(46)
    .outerRadius(54)
    .startAngle(0);

var arc2 = d3.svg.arc()
    .innerRadius(31)
    .outerRadius(39)
    .startAngle(0);

// add a first circle
pvis.append("circle")
    .attr("cx",60)
    .attr("cy",60)
    .attr("r",50)
    .attr("fill","white")
    .attr("stroke","#ddd")
    .attr("stroke-width",1)

// add a 2nd circle
pvis.append("circle")
    .attr("cx",60)
    .attr("cy",60)
    .attr("r",35)
    .attr("fill","white")
    .attr("stroke","#ddd")
    .attr("stroke-width",1)

// Video
pvis.append("text").attr("class","txt")
    .attr("x",60).attr("y",75).text("Video")
    .attr("fill","#999")
    .style("font-size", "10px").style("text-anchor", "middle");

// Problems
pvis.append("text").attr("class","txt")
    .attr("x",125).attr("y",28).text("Problems")
    .attr("fill", "#999")
    .style("font-size", "10px").style("text-anchor", "middle");


function computeStats(data){
    
    var mm=d3.extent(data,function(d){return d.date});
            
    var problem_done=0,
        problem_score=0,
        video_watched=0,
        minutes_on_site=0;
    
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





    
    var problemprogress=(problem_done/108);
    var problemscore=(problem_score/problem_done);
    var videoprogress=(video_watched/49452);

    
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
            var htm="<b>Course problems</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>Completion<td>"+problem_done+"/108<td>"+Math.round(problemprogress*100)+"%";
            var pct=Math.round(problemscore*100);
            var color=colorDomain(pct);
            htm+="<tr><td style='color:"+color+"'>Score<td style='color:"+color+"'>"+problem_score+"/"+problem_done+"<td><b style='color:"+color+"'>"+pct+"%</b>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;
    
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
            var htm="<b>Course videos</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>"+Math.round(video_watched/60)+"/"+Math.round(49452/60)+" minutes";
            htm+="<td>"+Math.round(videoprogress*100)+"%</tr>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;
    


    // Video progress %    
    var a = pvis.selectAll("text.pctvideo").data([Math.round(videoprogress*100)]);
        a.enter().append("text").attr("class","pctvideo")
        .attr("x",60).attr("y",65).text("0%")
        .style("font-size", "24px").style("text-anchor", "middle")
        
        a.transition().text(function(d){return d+"%";});

    // Problem progress %
    var b = pvis.selectAll("text.pctproblem").data([Math.round(problemprogress*100)]);
        b.enter().append("text").attr("class","pctproblem")
        .attr("x",125).attr("y",18).text("0%")   
        .style("font-size", "24px").style("text-anchor", "middle");
    
        b.transition()
            .attr("fill",colorDomain(problemscore*100))
            .text(function(d){return d+"%";});    
}





/*
// Arc problems
var foreground1=pvis.append("path")
    .attr("class", 'arc1')
    .datum({endAngle:(1*tau)})
    .style("fill", colorDomain(0))
    .style("stroke", colorDomain(0))
    .style("stroke-width", 0)
    .attr("d", arc1)
    .attr("transform", "translate(60,60)")
    .on("mouseover",function(d){
        d3.select(this).style('stroke-width', 2);
        var htm="<b>Course problems</b><hr />";
        htm+="<table width=100%>";
        htm+="<tr><td>Completion<td>"+problem_done+"/108<td>"+Math.round(problemprogress*100)+"%";
        var pct=Math.round(problemscore*100);
        var color=colorDomain(pct);
        htm+="<tr><td style='color:"+color+"'>Score<td style='color:"+color+"'>"+problem_score+"/"+problem_done+"<td><b style='color:"+color+"'>"+pct+"%</b>";
        htm+="</table>";
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
    ;

//console.log('problemdone/problemcount',problemdone/problemcount);

// Arc video
var foreground2=pvis.append("path")
    .attr("class", 'arc2')
    .datum({endAngle:(1*tau)})
    .style("fill", "#000")
    .style("stroke", "#000")
    .style("stroke-width", 0)
    .attr("d", arc2)
    .attr("transform", "translate(60,60)")
    .on("mouseover",function(d){
        d3.select(this).style('stroke-width', 2);
        var htm="<b>Course videos</b><hr />";
        htm+="<table width=100%>";
        htm+="<tr><td>"+Math.round(video_watched/60)+"/"+Math.round(49452/60)+" minutes";
        htm+="<td>"+Math.round(videoprogress*100)+"%</tr>";
        htm+="</table>";
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
    ;


// Creates a tween on the specified transition's "d" attribute, transitioning
// any selected arcs from their current angle to the specified new angle.
function arcTween(transition, newAngle) {
    transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function(t){
            d.endAngle = interpolate(t);
            return arc1(d);
        };
    });
}

*/

//foreground1.transition().duration(750).call(arcTween,Math.random()*tau);