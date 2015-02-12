var width = 200,
    height = 150,
    tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

//Progress colors (Ailadi scheme)
var colors=[];
colors.push('#FF5F06');//Rouge orange
colors.push('#F39224');
colors.push('#EDC82B');
colors.push('#E5E131');
colors.push('#B9DB50');
colors.push('#8DD685');
colors.push('#30ad77');//Vert correct

var colorDomain=d3.scale.linear()
    .domain([0,50,60,70,80,90,100])
    .range(colors);

var greyScale=d3.scale.linear().domain([0,100]).range(['#666','#eee']);//video completion

var pvis = d3.select("#progressOvDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

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
    
    var x=0;
    var y=130;
    var cellwidth=16;

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#000")
        .attr("transform", "translate("+x+","+y+")")
        .text('Answer quality legend');

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+x+","+(y+20)+")")
        .text('Bad');

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+(x+78)+","+(y+20)+")")
        .text('Correct');

    pvis.selectAll(".colors")
        .data(colors)
        .enter()
        .append("rect")
        .attr("width", cellwidth)
        .attr("height", 6)
        .attr("x", function(d,i){return x+i*(cellwidth+1);})
        .attr("y", y+4)
        //.attr("style", "font-size:11px")
        .attr("fill", function(d){return d;})
        .append("title").text(function(d){return d;});
        ;
}

//draw color legend
colorLegend(colors);



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

    // Start date
    var htm=mm[0]+"<br>";
    var daysago=daysBetween(new Date(mm[0]),new Date('2018-12-24'));//last connection
    htm+="<i class='text-muted'>("+daysago+" days ago)</i>"
    $('#start').html(htm);


    // 'Connected' (sessions)
    $('#connectedTitle').html("<i class='fa fa-calendar-o'></i> "+data.length+" sessions");

    var htm="";
    //htm+=""
    var daysago=daysBetween(new Date(mm[1]),new Date('2018-12-24'));//last connection
    if(daysago>15){
        htm+="<i class='fa fa-warning' style='color:#c00'></i> Last seen "+daysago+" days ago</i><br />";
    }else{
        htm+="<i class='text-muted'></i> Last seen : "+daysago+" days ago</i><br />";
    }
    
       
    $('#connectedBody').html(htm);





    
    var problemprogress=(problem_done/108);
    var problemscore=(problem_score/problem_done);
    var videoprogress=(video_watched/49452);

    pvis.selectAll("path, text.pct").remove();

    // Arc problems
    pvis.append("path")
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
            htm+="<tr><td>Score<td>"+problem_score+"/"+problem_done+"<td><b style='color:"+colorDomain(pct)+"'>"+pct+"%</b>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;
    
    //console.log('problemdone/problemcount',problemdone/problemcount);

    // Arc video
    pvis.append("path")
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

    pvis.append("text").attr("class","pct")
        .attr("x",60).attr("y",65).text(Math.round(videoprogress*100)+"%")
        .style("font-size", "20px").style("text-anchor", "middle");

    pvis.append("text").attr("class","pct")
        .attr("x",60).attr("y",75).text("Video")
        .attr("fill","#333")
        .style("font-size", "10px").style("text-anchor", "middle");

    pvis.append("text").attr("class","pct")
        .attr("x",100).attr("y",15).text(Math.round(problemprogress*100)+"%")    
        .attr("fill",colorDomain(problemscore*100))
        .style("font-size", "20px");

    pvis.append("text").attr("class","pct")
        .attr("x",105).attr("y",25).text("Problems")
        .style("font-size", "10px");
    
}

