var width = 700,
    height = 150;

var pvis = d3.select("#progressOvDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

pvis.append("text")
    .attr("x",160)
    .attr("y",30)
    .text("Started on 2018-09-05")
    .style("font-size", "32px");

pvis.append("text")
    .attr("x",160)
    .attr("y",60)
    .text("33 sessions")
    .style("font-size", "32px");

pvis.append("text")
    .attr("x",160)
    .attr("y",90)
    .text("45 days since begining")
    .style("font-size", "32px");

// An arc function with all values bound except the endAngle. So, to compute an
// SVG path string for a given angle, we pass an object with an endAngle
// property to the `arc` function, and it will return the corresponding string.
var arc1 = d3.svg.arc()
    .innerRadius(47)
    .outerRadius(53)
    .startAngle(0);

var arc2 = d3.svg.arc()
    .innerRadius(32)
    .outerRadius(38)
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

pvis.append("path")
  .datum({endAngle:3.14})
    .style("fill", "orange")
    .attr("d", arc1)
    .attr("transform", "translate(60,60)")
    ;

pvis.append("path")
  .datum({endAngle:5})
    .style("fill", "black")
    .attr("d", arc2)
    .attr("transform", "translate(60,60)")
    ;

pvis.append("text")
    .attr("x",43)
    .attr("y",65)
    .text("75%")
    .style("font-size", "20px");

pvis.append("text")
    .attr("x",90)
    .attr("y",15)
    .text("50%")    
    .style("font-size", "20px");

function getOvData(){
    
    console.log('getOvData()');
    
    var p={
        'do':'getProgress',
        'student_id':$('#student_id').val()
    }
    
    $('#progressOvDiv').load("student_ctrl.php",p,function(json){        
        try{  
            var data=$.parseJSON(json);
            //updateProgress(data);
            $('#progressOvDiv').html("ok");
        }
        catch(e){
            console.log(e);
        }
    });
}

/*
function updateProgress(data){
    console.log('updateProgress()',data);
    
    // Draw problems done
    var pbs=weeks.append("rect")
      .attr("x",0)
      .attr("y",20)
      .attr("width",0)
    .attr("height",2)
    .attr("fill","#0F0");

    pbs.transition(50).delay(function(d,i){return i*200})
    .attr("width",function(d){
        var pct=Math.round(data[d].problemdone/data[d].problemcount*colwidth);
        if(pct)return pct;
        return 0;
        //return Math.random()*colwidth;
    })

    // Draw video rectangles
    var vids=weeks.append("rect")
      .attr("x",0)
      .attr("y",28)
      .attr("width",0)
    .attr("height",2)
    .attr("fill","#000");

    vids.transition(50).delay(function(d,i){return i*200})
        .attr("width",function(d){
        var pct=Math.round(data[d].videopct/100*colwidth);
        if(pct)return pct;
        return 0;
    })
}
*/

$(function(){
    //getProgressData();
});