var width = 700,
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
colors.push('#00B22D');//Vert

var colorDomain=d3.scale.linear()
    .domain([0,50,60,70,80,90,100])
    .range(colors);

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
    
    var x=220;
    var y=50;

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#000")
        .attr("transform", "translate("+x+","+y+")")
        .text('Answer quality legend');

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+x+","+(y+24)+")")
        .text('Bad');

    pvis.append('text')
        .attr('font-size', '12px' )
        .attr("fill", "#999")
        .attr("transform", "translate("+(x+180)+","+(y+24)+")")
        .text('All correct');

    pvis.selectAll(".colors")
        .data(colors)
        .enter()
        .append("rect")
        .attr("width", 32)
        .attr("height", 8)
        .attr("x", function(d,i){return x+i*34;})
        .attr("y", y+4)
        //.attr("style", "font-size:11px")
        .attr("fill", function(d){return d;})
        .append("title").text(function(d){return d;});
        ;
}

//draw color legend
colorLegend(colors);

/*
pvis.append('text')
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '128px' )
    .attr("fill", "#000")
    .attr("transform", "translate(480,120)")
    .text(function(d) { return '\uf133' }); //fa-calendar-o

pvis.append('text')
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '64px' )
    .attr("fill", "#E11A2B")
    .attr("transform", "translate(500,120)")
    .text(function(d) { return '\uf16a' }); //fa-youtube-play
*/

/*
pvis.append("text")
    .attr("x",160)
    .attr("y",30)
    .text("student start on 2018-09-05")
    .style("font-size", "18px");

pvis.append("text")
    .attr("x",160)
    .attr("y",50)
    .text("33 sessions")
    .style("font-size", "18px");


var dsince=daysBetween(new Date('2018-09-05'), new Date('2018-12-24'));
pvis.append("text")
    .attr("x",160)
    .attr("y",70)
    .text(" days since begining (today 2018-12-24)")
    .style("font-size", "18px");

pvis.append("text")
    .attr("x",160)
    .attr("y",90)
    .text("Last session : xxxx-xx-xx (x days ago)")
    .style("font-size", "18px");
*/

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
/*
pvis.append("path")
  .datum({endAngle:3.14})
    .style("fill", "#d11626")//youtube red
    .attr("d", arc1)
    .attr("transform", "translate(60,60)")
    ;

pvis.append("path")
  .datum({endAngle:5})
    .style("fill", "black")
    .attr("d", arc2)
    .attr("transform", "translate(60,60)")
    ;

pvis.append("text").attr("x",43).attr("y",65).text("75%")
    .style("font-size", "20px");
pvis.append("text").attr("x",40).attr("y",75).text("problems")
    .attr("fill","#999")
    .style("font-size", "10px");

pvis.append("text").attr("x",90).attr("y",15).text("50%")    
    .attr("fill","#c00")
    .style("font-size", "20px");
pvis.append("text").attr("x",105).attr("y",25).text("Video")
    .style("font-size", "10px");
*/
function getOvData(){    
    //console.log('getOvData()');
    var p={
        'do':'getDailyData',
        'student_id':$('#student_id').val()
    }
    
    $('#progressOvMore').load("student_ctrl.php",p,function(json){        
        try{  
            var data=$.parseJSON(json);
            computeStats(data);
            $('#progressOvMore').html("ok");
        }
        catch(e){
            console.log(e);
        }
    });
}


function computeStats(data){
    
    // compute stats
    // to compute total percentages,
    // we need to know the number of problems (141 problems)
    // and the total video time (49452 seconds)
    
    //console.log('computeStats(data)',data);
    //console.log(data.length+" session(s)");
    var mm=d3.extent(data,function(d){return d.date});
    console.log("From "+mm[0] + " to "+mm[1]);
        
    var problem_done=0,
        problem_score=0,
        video_watched=0;
    
    $.each(data,function(i,o){
        //console.log(i,o);
        if(o.problem_done)problem_done+=o.problem_done;
        if(o.problem_score)problem_score+=o.problem_score;
        if(o.video)video_watched+=o.video;//in seconds
    });
    
    //console.log("problem_done", problem_done,"/108 problems");
    //console.log("problem_score",problem_score,"/"+problem_done);
    //console.log("video_watched",video_watched,"/49452 seconds");

    var problemprogress=(problem_done/108);
    var problemscore=(problem_score/problem_done);
    var videoprogress=(video_watched/49452);

    // Arc problems
    pvis.append("path")
    .datum({endAngle:(problemprogress*tau)})
    .style("fill", colorDomain(problemscore*100))
    .style("stroke", colorDomain(problemscore*100))
    .style("stroke-width", 0)
    .attr("d", arc1)
    .attr("transform", "translate(60,60)")
    .on("mouseover",function(d){
        d3.select(this).style('stroke-width', 2);
        var htm="<b>Problems</b><hr />";
        htm+="<table width=100%>";
        htm+="<tr><td>Done<td>"+problem_done+"/108<td>"+Math.round(problemprogress*100)+"%";
        htm+="<tr><td>Correct<td>"+problem_score+"/"+problem_done+"<td>"+Math.round(problemscore*100)+"%";
        htm+="</table>";
        ttover(htm);
    })
    .on("mousemove",function(){ttmove();})
    .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
    ;
    
    //console.log('problemdone/problemcount',problemdone/problemcount);

    // Arc video
    pvis.append("path")
        .datum({endAngle:(videoprogress*tau)})
        .style("fill", "#000")
        .style("stroke", "#000")
        .style("stroke-width", 0)
        .attr("d", arc2)
        .attr("transform", "translate(60,60)")
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var htm="<b>Video</b><hr />";
            htm+="<table width=100%>";
            htm+="<tr><td>"+Math.round(video_watched/60)+"/"+Math.round(49452/60)+" minutes";
            htm+="<td>"+Math.round(videoprogress*100)+"%</tr>";
            htm+="</table>";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        ;

    pvis.append("text").attr("x",60).attr("y",65).text(Math.round(videoprogress*100)+"%")
        .style("font-size", "20px").style("text-anchor", "middle");
        //
    pvis.append("text").attr("x",60).attr("y",75).text("Video")
        .attr("fill","#333")
        .style("font-size", "10px").style("text-anchor", "middle");

    pvis.append("text").attr("x",100).attr("y",15).text(Math.round(problemprogress*100)+"%")    
        .attr("fill",colorDomain(problemscore*100))
        .style("font-size", "20px");
    pvis.append("text").attr("x",105).attr("y",25).text("Problems")
        .style("font-size", "10px");
    
}


$(function(){
    getOvData();
});