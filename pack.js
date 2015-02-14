var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto
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
var arc1 = d3.svg.arc()
.innerRadius(46)
.outerRadius(54)
.startAngle(0);
var arc2 = d3.svg.arc()
.innerRadius(31)
.outerRadius(39)
.startAngle(0);
pvis.append("circle")
.attr("cx",60)
.attr("cy",60)
.attr("r",50)
.attr("fill","white")
.attr("stroke","#ddd")
.attr("stroke-width",1)
pvis.append("circle")
.attr("cx",60)
.attr("cy",60)
.attr("r",35)
.attr("fill","white")
.attr("stroke","#ddd")
.attr("stroke-width",1)
pvis.append("text").attr("class","txt")
.attr("x",60).attr("y",75).text("Video")
.attr("fill","#999")
.style("font-size", "10px").style("text-anchor", "middle");
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
if(o.problem_done)problem_done+=o.problem_done;
if(o.problem_score)problem_score+=o.problem_score;
if(o.video_watched)video_watched+=o.video_watched;//in seconds
if(o.minutes_on_site)minutes_on_site+=o.minutes_on_site;
});
var htm=d3.time.format('%A %d %b %Y')(mm[0])+"<br />";
htm+="<i class='fa fa-clock-o'></i> "+Math.round(minutes_on_site/60)+" hours working<br />";
var daysago=daysBetween(new Date(mm[0]),new Date('2018-12-24'));//last connection
htm+="<hr />";
htm+="<i class='text-muted'>"+daysago+" days ago</i>";
$('#start').html(htm);
$('#connectedTitle').html("<i class='fa fa-calendar-o'></i> Sessions");
var htm="";
htm+="<b>"+data.length+"</b> session(s)<br />";
var avg=Math.round(minutes_on_site/data.length);
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
var a = pvis.selectAll("text.pctvideo").data([Math.round(videoprogress*100)]);
a.enter().append("text").attr("class","pctvideo")
.attr("x",60).attr("y",65).text("0%")
.style("font-size", "24px").style("text-anchor", "middle")
a.transition().text(function(d){return d+"%";});
var b = pvis.selectAll("text.pctproblem").data([Math.round(problemprogress*100)]);
b.enter().append("text").attr("class","pctproblem")
.attr("x",125).attr("y",18).text("0%")
.style("font-size", "24px").style("text-anchor", "middle");
b.transition()
.attr("fill",colorDomain(problemscore*100))
.text(function(d){return d+"%";});
}
/*
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
var colors;//color domain
var colorDomain;
var width = 710,
height = 60,
cellSize = 12, // cell size
colwidth=(width)/8;//col width (weeks)
var vis = d3.select("#progressDiv").append("svg")
.attr("width", width)
.attr("height", height);
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
weeks.append("text")
.text( function(d,i){return d.toUpperCase();})
.attr("transform", "translate(4,10)");
weeks.append("line")
.attr("x1",0)
.attr("x2",0)
.attr("y1",0)
.attr("y2",50)
.attr('stroke', '#ddd')
.attr('stroke-width', 1)
.attr("class","crisp")
;
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
weeks.selectAll("rect").remove();
var pbs=weeks.append("rect")
.attr("class","problem")
.attr("x",0)
.attr("y",20)
.attr("width",0)
.attr("height",8)
.attr("fill",function(d){
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
d3.select(this).style('stroke-width', 2);
var htm="<b>"+d+" Videos<hr />";
$.each(data[d],function(lecture,o){
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
if(duration && watched){
return (watched/duration*colwidth);
}
return 0;
});
};
var constwidth = 730, constheight = 70;
var day = d3.time.format("%w"),
week = d3.time.format("%U"),
percent = d3.format(".1%"),
format = d3.time.format("%Y-%m-%d");
var cns = d3.select("#constantDiv")
.append("svg")
.attr("width", constwidth)
.attr("height", constheight);
var xScale = d3.time.scale().range([20, constwidth- 20]).domain([new Date("2018-09-14"),new Date("2018-12-24")]);//fixed scale
var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5).tickFormat(d3.time.format('%b')).tickSize(10).tickPadding(5);
cns.append('g')
.attr('class', 'axis')
.style('shape-rendering','crispEdges')
.attr('transform', 'translate(0, 30)')
.call(xAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "start");
cns.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
cns.append("text")
.attr("transform", "translate(10,60),rotate(-90)")
.style("text-anchor", "left")
.style("font-size", "10px")
.style("fill", "#999")
.text("DURATION");
function updateConstancy(data){
minuteDomain = d3.extent( data ,function(o){return o.minutes_on_site;});
if(data.length<2){
$('#moreConstant').html('<i class="fa fa-warning" style="color:#c00"></i> Only one session');
} else {
dd = d3.extent( data ,function(o){return o.date;});
var daysb=daysBetween(dd[0],dd[1]);
var xdays=Math.floor(daysb/data.length);
$('#moreConstant').html(data.length+' session(s) from '+minuteDomain[0]+' to '+minuteDomain[1]+' minutes');
}
var xScale = d3.time.scale().range([20, constwidth-30]);
xScale.domain([new Date("2018-09-14"),new Date("2018-12-24")]);
var rScale = d3.scale.linear().domain(minuteDomain).range([3, 10]);
var b = cns.selectAll("circle.t1").data(data);
b.enter().append("circle")
.attr("class", "t1" )
.attr("fill", function(d){return '#939da9';})
.style("opacity", 1)
.style("stroke","#000")
.style("stroke-width",0)
.attr("r" , 0 )
.on("mouseover",function(d){
d3.select(this).style('stroke-width', 3);
var htm="<b>"+d3.time.format('%A %d %b')(d.date)+" - "+d.minutes_on_site+" minutes</b><hr />";
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
}
var vpwidth = 730, vpheight = 135;
var day = d3.time.format("%w"),
week = d3.time.format("%U"),
percent = d3.format(".1%"),
format = d3.time.format("%Y-%m-%d");
var vps = d3.select("#vidnprobs")
.append("svg")
.attr("width", vpwidth)
.attr("height", vpheight);
vps.append("text")
.attr("transform", "translate(10,50),rotate(-90)")
.style("text-anchor", "left")
.style("font-size", "10px")
.style("fill", "#999")
.text("VIDEOS");
vps.append("text")
.attr("transform", "translate(10,130),rotate(-90)")
.style("text-anchor", "left")
.style("font-size", "10px")
.style("fill", "#999")
.text("PROBLEMS");
var xScale = d3.time.scale().range([20, vpwidth-20]).domain([new Date("2018-09-14"),new Date("2018-12-24")]);
var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4).tickFormat(d3.time.format('%b')).tickSize(60).tickPadding(5);
vps.append('g')
.attr('class', 'axis')
.attr('transform', 'translate(0, 60)')
.style('shape-rendering','crispEdges')
.call(xAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "start");
vps.selectAll('.axis line, .axis path').style({'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
function updateVidnprobs(data){
var xScale = d3.time.scale().range([20, vpwidth-20]).domain([new Date("2018-09-14"),new Date("2018-12-24")]);
var maxp=d3.max(data,function(o){return o.problem_done});
var maxv=d3.max(data,function(o){return o.video_watched});
var videoScale=d3.scale.linear().range([0,60]).domain([0,maxv]);
var problemScale=d3.scale.linear().range([0,60]).domain([0,maxp]);
var xAxis = d3.svg.axis()
.scale(xScale)
.orient('bottom')
.ticks(4)//x tick
.tickFormat(d3.time.format('%b'))//Sep
.tickSize(60)
.tickPadding(5);
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
if(d.video){
htm+="<table width='100%'>";
htm+="<thead>"
htm+="<th>"+d.video.length+" video(s)</th>";
htm+="<th style='text-align:center'>Duration</th>";
htm+="<th style='text-align:right'>Watched</th>";
for(var i=0;i<d.video.length;i++){
htm+="<tr>";
htm+="<td>"+d.video[i].section+" - "+d.video[i].video_id;
htm+="<td style='text-align:center'>"+Math.round(d.video[i].duration_seconds/60)+"min "+d.video[i].duration_seconds%60+"s";
var pct=Math.round(d.video[i].watched_seconds/d.video[i].duration_seconds*100);
htm+="<td style='text-align:right;color:"+greyScale(pct)+"'><b>"+pct+"%</b></td>";
}
htm+="</tbody>";
htm+="</table>";
}
ttover(htm);
})
.on("mousemove",function(){ttmove();})
.on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
;
b.transition().delay(function(d,i){return i*20})
.attr("x" , function(d){return xScale(d.date)-2.5;})
.attr("y" , function(d){
if(d.video){
return 60-videoScale(d.video_watched);
}
return 60;
})
.attr("height" , function(d){
if(d.video){
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
var width = 340,height = 260;//todo : reduce height
var cola = d3.select("#colA").append("svg").attr("width", width).attr("height", height);
var colb = d3.select("#colB").append("svg").attr("width", width).attr("height", height);
var colors=[];
colors.push('#FF5F06');//Rouge orange
colors.push('#F39224');
colors.push('#EDC82B');
colors.push('#E5E131');
colors.push('#B9DB50');
colors.push('#8DD685');
colors.push('#30ad77');//Vert correct
var colorDomain=d3.scale.linear().domain([0,50,60,70,80,90,100]).range(colors);
function updateClass1(data,criteria,student_id){
switch(criteria){
case 'a0':
var labelx="Problems answered";
var labely="Problems score";
$.each(data,function(k,o){o.vx=o.problem_done});
$.each(data,function(k,o){o.vy=o.problem_score});
break;
case 'a':
var labelx="Video watched (count)";
var labely="Problems answered";
$.each(data,function(k,o){o.vx=o.video_count});
$.each(data,function(k,o){o.vy=o.problem_done});
break;
case 'a2':
var labelx="Video watched (time)";
var labely="Problems answered";
$.each(data,function(k,o){o.vx=o.video_watched});
$.each(data,function(k,o){o.vy=o.problem_done});
break;
case 'a3':
var labelx="Video watched (time)";
var labely="Video watched (count)";
$.each(data,function(k,o){o.vx=o.video_watched});
$.each(data,function(k,o){o.vy=o.video_count});
break;
case 'b':
var labelx="Time spent (minutes)";
var labely="Problems score";
$.each(data,function(k,o){o.vx=o.time_spent});
$.each(data,function(k,o){o.vy=o.problem_score});
break;
case 'c':
var labelx="Time spent (minutes)";
var labely="Problems answered";
$.each(data,function(k,o){o.vx=o.time_spent});
$.each(data,function(k,o){o.vy=o.problem_done});
break;
case 'd':
var labelx="Avg Session length (minutes)";
var labely="Problems score";
$.each(data,function(k,o){o.vx=o.session_avg});
$.each(data,function(k,o){o.vy=o.problem_score});
break;
case 'e':
var labelx="Time spent (minutes)";
var labely="Number of sessions";
$.each(data,function(k,o){o.vx=o.time_spent});
$.each(data,function(k,o){o.vy=o.sessions});
break;
}
var xDomain=d3.extent(data,function(d){return d.vx;});
var yDomain=d3.extent(data,function(d){return d.vy;});
var xScale=d3.scale.linear().range([30, width-10]).domain(xDomain);
var yScale=d3.scale.linear().range([height-40, 10]).domain(yDomain);
var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
.ticks(5)//x tick
.tickSize(4)
.tickPadding(4);
var yAxis = d3.svg.axis().scale(yScale).orient('left')
.ticks(5)//x tick
.tickSize(5)
.tickPadding(5);
cola.selectAll('g,text').remove();//delete axis
cola.append('g').attr('class', 'axis')
.style('shape-rendering','crispEdges')
.attr('transform', 'translate(0, '+(height-40)+')')
.call(xAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "start");
cola.append('g').attr('class','axis')
.style('shape-rendering','crispEdges')
.attr('transform', 'translate(30, 0)')
.call(yAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "left");
cola.append('text')
.attr("transform","translate("+width+","+(height-10)+")")
.attr("fill", "#999")
.style("text-anchor", "end")
.style("font-size", "10px")
.text(labelx.toUpperCase());
cola.append('text')
.attr("fill", "#999")
.attr("transform","translate(42,0),rotate(-90)")
.style("text-anchor", "end")
.style("font-size", "10px")
.text(labely.toUpperCase());
cola.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
var ipos=0;//studend position
$.each(data,function(i,d){if(d.student_id==student_id)ipos=i;});
var vline= cola.selectAll("line.vline").data([data[ipos]]);
vline.enter().append("line")
.attr("class","vline")
.attr("stroke","#f98d70")
.style("stroke-dasharray", ("3, 3"))
.style("opacity",0.5)
.attr("stroke-width",1)
.style('shape-rendering','crispEdges');
vline.transition()
.attr("x1",function(d){return xScale(d.vx);})
.attr("x2",function(d){return xScale(d.vx);})
.attr("y1",0).attr("y2",height-40);
var vline= cola.selectAll("line.hline").data([data[ipos]]);
vline.enter().append("line")
.attr("class","hline")
.style("stroke-dasharray", ("3, 3"))
.attr("stroke","#f98d70")
.attr("stroke-width",1)
.style("opacity",0.5)
.style('shape-rendering','crispEdges');
vline.transition()
.attr("y1",function(d){return yScale(d.vy);})
.attr("y2",function(d){return yScale(d.vy);})
.attr("x1",30).attr("x2",width);
var m=cola.selectAll("circle.student").data(data);
m.enter().append("circle").attr("class","student")
.attr("cx",width/2)
.attr("cy",height/2)
.attr("r",4)
.attr("stroke","#000")
.attr("stroke-width",0)
.style("opacity", 0.5)
.attr("fill",function(d){
return '#999';
})
.on("mouseover",function(d,i){
d3.select(this).style('stroke-width', 2);
d3.select(this).style('opacity', 1);
var htm="<b>Student #"+d.student_id+"</b><hr />";
htm+="<table width=100%>";
htm+="<tr><td>Sessions<td style='text-align:right'>"+d.sessions;
htm+="<tr><td>Avg session time<td style='text-align:right'>"+Math.round(d.session_avg)+" minute";
if(d.time_spent>60){
var hours=Math.round(d.time_spent/60)+"h and "+d.time_spent%60+" minutes";
htm+="<tr><td>Time spent<td style='text-align:right'>"+hours;
}else{
htm+="<tr><td>Time spent<td style='text-align:right'>"+d.time_spent+" minutes";
}
htm+="<tr><td>Video count<td style='text-align:right'>"+d.video_count+"/141";
var minutes=Math.round(d.video_watched/60);
if(minutes>60){
var hours=Math.round(minutes/60)+"h "+minutes%60+" min";
htm+="<tr><td>Video watched<td style='text-align:right'>"+hours;
}else{
htm+="<tr><td>Video watched<td style='text-align:right'>"+minutes+" min";
}
htm+="<tr><td>Problems done<td style='text-align:right'>"+d.problem_done+"/108";
var score=Math.round(d.problem_score/d.problem_done*100);
htm+="<tr><td>Problems score<td style='text-align:right'><b style='color:"+colorDomain(score)+"'>"+d.problem_score+"/"+d.problem_done+" ("+score+"%)</b>";
htm+="</table>";
ttover(htm);
})
.on("mousemove",function(d,i){ttmove();})
.on("mouseout",function(d,i){
d3.select(this).style('stroke-width', 0);
d3.select(this).style('opacity', function(d){
if(d.student_id==student_id)return 1;
return 0.5;
});
ttout();})
;
m.transition().delay(10)
.attr("cx",function(d,i){return xScale(d.vx);})
.attr("cy",function(d,i){return yScale(d.vy);})
.attr("fill",function(d){
if(d.student_id==student_id)return '#c00';
return '#939da9';
})
.attr("r",function(d){if(d.student_id==student_id)return 5;else return 4;})
.style("opacity", function(d){if(d.student_id==student_id)return 1;else return 0.5;})
;
}
function updateClass2(data,criteria,student_id){
switch(criteria){
case 'video_watched'://no
var labely="Video watched";
$.each(data,function(i,d){d.val=d.video_watched});
break;
case 'problem_done':
var labely="Problems answered";
$.each(data,function(i,d){d.val=d.problem_done});
break;
case 'problem_score':
var labely="Problems score";
$.each(data,function(i,d){d.val=d.problem_score});
break;
case 'time_spent':
var labely="Time spent";
$.each(data,function(i,d){d.val=d.time_spent});
break;
case 'sessions':
var labely="Sessions";
$.each(data,function(i,d){d.val=d.sessions});
break;
case 'session_avg'://
var labely="Avg session length (min)";
$.each(data,function(i,d){d.val=d.session_avg});
break;
default:console.log('criteria error');return false;break;
}
data.sort(function(a,b){return a.val-b.val});
var domain=d3.extent(data,function(d){return d.val});
var xScale = d3.scale.linear().range([30, width-20]).domain([0,500]);
var xAxis = d3.svg.axis()
.scale(xScale)
.orient('bottom')
.ticks(5)//x tick
.tickSize(4)
.tickPadding(5);
colb.selectAll('g,text').remove();//quick and dirty :: todo update axis
colb.append('g')
.attr('class', 'axis')
.style('shape-rendering','crispEdges')
.attr('transform', 'translate(0,'+(height-40)+')')
.call(xAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "start");
colb.append('text')
.attr("fill", "#999")
.attr("transform","translate("+width+","+(height-10)+")")
.style("text-anchor", "end")
.style("font-size", "10px")
.text("STUDENTS");
colb.append('text')
.attr("fill", "#999")
.attr("transform","")
.attr("transform","translate(42,0),rotate(-90)")
.style("text-anchor", "end")
.style("font-size", "10px")
.text(labely.toUpperCase());
colb.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
var yScale = d3.scale.linear().range([height-40,10]).domain(domain);
var yAxis = d3.svg.axis().scale(yScale).orient('left')
.ticks(5)//x tick
.tickSize(2)
.tickPadding(2);
colb.append('g').attr('class','axis')
.style('shape-rendering','crispEdges')
.attr('transform', 'translate(30, 0)')
.call(yAxis)
.selectAll("text")
.style("font-size", "11px")
.style("text-anchor", "left");
colb.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
var ipos=0;//studend position
$.each(data,function(i,d){if(d.student_id==student_id)ipos=i;});
var vline= colb.selectAll("line.vline").data([ipos]);
vline.enter().append("line")
.attr("class","vline")
.attr("stroke","#f98d70")
.style("stroke-dasharray", ("3, 3"))
.style("opacity",0.5)
.attr("stroke-width",1)
.style('shape-rendering','crispEdges')
;
vline.transition()
.attr("x1",function(d){return xScale(d);})
.attr("x2",function(d){return xScale(d);})
.attr("y1",0).attr("y2",height-40);
var vline= colb.selectAll("line.hline").data([ipos]);
vline.enter().append("line")
.attr("class","hline")
.attr("stroke","#f98d70")
.style("stroke-dasharray", ("3, 3"))
.style("opacity",0.5)
.attr("stroke-width",1)
.style('shape-rendering','crispEdges');
vline.transition()
.attr("y1",function(d){return yScale(data[d].val);})
.attr("y2",function(d){return yScale(data[d].val);})
.attr("x1",30).attr("x2",width);
var us=colb.selectAll("circle.classroom").data(data)
us.enter()
.append("circle")
.attr("class","classroom")
.attr("r",0)
.style("opacity", function(d){
if(d.student_id==student_id)return 1;
return 0.5;
})
.attr("stroke","#000")
.attr("stroke-width",0)
.on("mouseover",function(d,i){
d3.select(this).style('stroke-width', 2);
d3.select(this).style('opacity', 1);
var htm="<b>Student #"+d.student_id+"</b><hr />";
htm+="<table width=100%>";
htm+="<tr><td>Sessions<td style='text-align:right'>"+d.sessions;
htm+="<tr><td>Avg session time<td style='text-align:right'>"+Math.round(d.session_avg)+" minutes";
var hours=Math.round(d.time_spent/60)+"h and "+d.time_spent%60+" minutes";
if(d.time_spent>60){
htm+="<tr><td>Time spent<td style='text-align:right'>"+hours;
}else{
htm+="<tr><td>Time spent<td style='text-align:right'>"+d.time_spent+" minutes";
}
htm+="<tr><td>Video count<td style='text-align:right'>"+d.video_count+"/141";
var minutes=Math.round(d.video_watched/60);
if(minutes>60){
var hours=Math.round(minutes/60)+"h "+minutes%60+" minutes";
htm+="<tr><td>Video watched<td style='text-align:right'>"+hours;
}else{
htm+="<tr><td>Video watched<td style='text-align:right'>"+minutes+" minutes";
}
htm+="<tr><td>Problems answered<td style='text-align:right'>"+d.problem_done+"/108";
if(d.problem_score>0&&d.problem_done>0){
var score=Math.round(d.problem_score/d.problem_done*100);
}else var score=0;
htm+="<tr><td>Problems score<td style='text-align:right'><b style='color:"+colorDomain(score)+"'>"+d.problem_score+"/"+d.problem_done+" ("+score+"%)</b>";
htm+="</table>";
ttover(htm);
})
.on("mousemove",function(d,i){ttmove();})
.on("mouseout",function(d,i){
d3.select(this).style('stroke-width', 0);
if(d.student_id==student_id)d3.select(this).style('opacity', 1);
else d3.select(this).style('opacity', 0.5);
ttout();
})
;
us.transition()
.attr("cx",function(d,i){return xScale(i);})
.attr("cy",function(d,i){return yScale(d.val);})
.attr("fill",function(d){
if(d.student_id==student_id)return "#c00";
return "#939da9"
})
.style("opacity", function(d){
if(d.student_id==student_id)return 1;
return 0.5;
})
.attr("r",function(d){
if(d.student_id==student_id)return 5;
return 4;
})
;
}
/*
var csv_class=[];
d3.csv("class.csv",function(error,d){
d.forEach(function(o){
o.student_id=+o.student_id;
o.problem_done=+o.problem_done;
o.problem_score=+o.problem_score;
o.sessions=+o.sessions;
o.session_avg=+o.session_avg;
o.time_spent=+o.time_spent;
o.video_count=+o.video_count;
o.video_watched=+o.video_watched;
});
csv_class=d;
console.log("csv_class",csv_class.length);
updateClass1(csv_class,$('#selector1').val(),119);
updateClass2(csv_class,$('#selector2').val(),119);
});
*/
$(function(){
$('#selector1').change(function(o){
if($('#selector1').val())updateClass1(csv_class,$('#selector1').val(),119);
});
$('#selector2').change(function(o){
if($('#selector2').val())updateClass2(csv_class,$('#selector2').val(),119);
});
});
var ttdiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 1e-6);
function ttover(html){
if(html)ttdiv.html(html);
ttdiv.transition().duration(100).style("opacity", 1);
}
function ttmove(){
ttdiv.style("left", ttleft ).style("top", tttop);
}
function ttleft(){
var max = $("body").width()-$("div.tooltip").width() - 20;
return  Math.min( max , d3.event.pageX + 10 ) + "px";
}
function tttop(){
var max = $("body").height()-$("div.tooltip").height() - 20;
return  Math.min( max , d3.event.pageY + 10 ) + "px";
}
function ttout(){
ttdiv.transition().duration(200).style("opacity", 1e-6);
}
var csv_minutes_per_day;//	student_id,date,minutes_on_site
var csv_problem_attempts;//	student_id,section,subsection,problem_id,date_attempted,max_points,score
var csv_problems;//		id,section,subsection,max_points
var csv_video_views;//	student_id,section,subsection,video_id,date_viewed,duration_seconds,watched_seconds
var csv_videos;//	id,section,subsection,duration_seconds
var csv_class;//	***
var group_100=[23,47,84,95,119,127,129,130,146,158,208,214,246,287,296,307,315,346,369,370,393,394,408,431,450,461,499];
var group_50=[92,159,113,363,152,342,449,423,161,460,283,162,178,120];
var group_0=[4,7,16,22,30];
$(function(){
$('#student_id').html("Loading csv data...");
d3.csv("minutes_per_day.csv", function(error,data) {
data.forEach(function(d){
d.student_id=+d.student_id;
d.date=new Date(d.date);
d.minutes_on_site=+d.minutes_on_site;
});
csv_minutes_per_day=data;
});
d3.csv("problem_attempts.csv", function(error,data) {
data.forEach(function(d){
d.student_id=+d.student_id;
d.date_attempted=new Date(d.date_attempted);
d.max_points=+d.max_points;
d.score=+d.score;
});
csv_problem_attempts=data;
});
d3.csv("problems.csv", function(error,o) {
o.forEach(function(r){
r.max_points=+r.max_points;
});
csv_problems=o;
});
d3.csv("video_views.csv", function(error,data) {
data.forEach(function(d){
d.student_id=+d.student_id;
d.date_viewed=new Date(d.date_viewed);
d.duration_seconds=+d.duration_seconds;
d.watched_seconds=+d.watched_seconds;
});
csv_video_views=data;
});
d3.csv("videos.csv", function(error,data) {
data.forEach(function(d){
d.duration_seconds=+d.duration_seconds;
});
csv_videos=data;
});
d3.csv("class.csv",function(error,d){
d.forEach(function(o){
o.student_id=+o.student_id;
o.problem_done=+o.problem_done;
o.problem_score=+o.problem_score;
o.sessions=+o.sessions;
o.session_avg=+o.session_avg;
o.time_spent=+o.time_spent;
o.video_count=+o.video_count;
o.video_watched=+o.video_watched;
});
csv_class=d;
});
csvloaded=function(){
var ld=true;
if(!csv_minutes_per_day)ld=false;
if(!csv_problem_attempts)ld=false;
if(!csv_problems)ld=false;
if(!csv_video_views)ld=false;
if(!csv_videos)ld=false;
if(ld){
console.log("csv_minutes_per_day",csv_minutes_per_day.length);
console.log("csv_problem_attempts",csv_problem_attempts.length);
console.log("csv_problems",csv_problems.length);
console.log("csv_video_views",csv_video_views.length);
console.log("csv_videos",csv_videos.length);
console.log("csv_class",csv_class.length);
return ld;
}else{
console.log('loading csv...');
t=setTimeout(csvloaded,50);
}
}
var t=setTimeout(csvloaded,50);//todo -> retry on fail
/*
$('#btnRandom').click(function(){
var student_id=Math.round(Math.random()*500);
var dat=getStudentData(student_id);
});
*/
});
function minutes_per_day(student_id){
return csv_minutes_per_day.filter(function(d){return d.student_id==student_id});
}
function problem_attempts(student_id){
return csv_problem_attempts.filter(function(d){return d.student_id==student_id});
}
function video_views(student_id){
return csv_video_views.filter(function(d){return d.student_id==student_id});
}
function getStudentData(student_id){
var min=minutes_per_day(student_id);
var prb=problem_attempts(student_id);
var prbMap={};
var vid=video_views(student_id);
var vidMap={};
for(var i=0;i<prb.length;i++){
if(!prbMap[prb[i].date_attempted])prbMap[prb[i].date_attempted]=[];
prbMap[prb[i].date_attempted].push(prb[i]);
}
for(var i=0;i<vid.length;i++){
if(!vidMap[vid[i].date_viewed])vidMap[vid[i].date_viewed]=[];
vidMap[vid[i].date_viewed].push(vid[i]);
}
var dat=[];// daily data
$.each(min,function(k,o){
var p=prbMap[o.date];
var v=vidMap[o.date];
if(p)o.problem=p;
if(v)o.video=v;
dat.push(o);
});
$.each(dat,function(k,o){
o.problem_done=0;
o.problem_score=0;
o.video_watched=0;
if(o.problem){
$.each(o.problem,function(i,v){
o.problem_done++;
o.problem_score+=v.score;
});
}
if(o.video){
$.each(o.video,function(i,v){
o.video_watched+=v.watched_seconds;
});
}
});
return dat;
}
function getWeeklyData(student_id){
var weeks=['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'];
var prb=problem_attempts(student_id);
var vid=video_views(student_id);
var scores={};
var dat={};
for(var i=0;i<weeks.length;i++)dat[weeks[i]]={};//init structure
$.each(csv_problems,function(i,o){
if(!dat[o.section][o.subsection])dat[o.section][o.subsection]={};
if(!dat[o.section][o.subsection]['problem'])dat[o.section][o.subsection]['problem']={};
dat[o.section][o.subsection]['problem'][o.id]={'id':o.id,'section':o.section,'subsection':o.subsection,'max_points':o.max_points};
});
$.each(csv_videos,function(i,o){
if(!dat[o.section][o.subsection]['video'])dat[o.section][o.subsection]['video']={};
dat[o.section][o.subsection]['video'][o.id]={'id':o.id,'section':o.section,'subsection':o.subsection,'duration_seconds':o.duration_seconds};
});
$.each(prb,function(i,o){
dat[o.section][o.subsection]['problem'][o.problem_id].date_attempted=o.date_attempted;
dat[o.section][o.subsection]['problem'][o.problem_id].score=o.score;
});
$.each(vid,function(i,o){
dat[o.section][o.subsection]['video'][o.video_id].date_viewed=o.date_viewed;
dat[o.section][o.subsection]['video'][o.video_id].watched_seconds=o.watched_seconds;
});
$.each(dat,function(week,obj){
$.each(obj,function(lecture,o){
var done=0;
var score=0;
dat[week][lecture].problem_count=Object.keys(o.problem).length;
for(var i=0;i<Object.keys(o.problem).length;i++){
var k=Object.keys(o.problem)[i];
if(o.problem[k].score)score+=o.problem[k].score;
if(o.problem[k].date_attempted)done++;
}
dat[week][lecture].problem_done=done;
dat[week][lecture].problem_score=score;
dat[week][lecture].problem_progress=Math.round(done/Object.keys(o.problem).length*100);
var duration=0;
var watched=0;
for(var i=0;i<Object.keys(o.video).length;i++){
var k=Object.keys(o.video)[i];
if(o.video[k].duration_seconds)duration+=o.video[k].duration_seconds;
if(o.video[k].watched_seconds)watched+=o.video[k].watched_seconds;
}
dat[week][lecture].video_duration=duration;
dat[week][lecture].watched_seconds=watched;
dat[week][lecture].watched_progress=Math.round(watched/duration*100);
});
});
return dat;
}
$(function(){
$('#btn0').click(function(){
updateStudent(group_0[Math.round(Math.random()*group_0.length-1)]);
});
$('#btn50').click(function(){
updateStudent(group_50[Math.round(Math.random()*group_50.length-1)]);
});
$('#btn100').click(function(){
updateStudent(group_100[Math.round(Math.random()*group_100.length-1)]);
});
$('#btnRand').click(function(){
updateStudent(Math.round(Math.random()*500))
});
setTimeout(function(){
updateStudent(group_50[Math.round(Math.random()*group_50.length-1)]);
},500);
});
function updateStudent(student_id){
if(!student_id)student_id=0;
$('#student_id').html('#'+student_id);
var dat=getStudentData(student_id);
computeStats(dat);//columns and arcs
updateConstancy(dat);
updateVidnprobs(dat);
updateClass1(csv_class,$('#selector1').val(),student_id);
updateClass2(csv_class,$('#selector2').val(),student_id);
var weeklydata=getWeeklyData(student_id);
updateProgressDetails(weeklydata);
}