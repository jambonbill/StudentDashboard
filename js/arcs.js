


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