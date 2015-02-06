
var colors;//color domain
var colorDomain;

var width = 700,
    height = 60,
    cellSize = 12, // cell size
    colwidth=(width)/8;//col width

var vis = d3.select("#progressDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

// rect 1
vis.append("rect")
    .attr("fill","#eee")
    .attr("y", 20)
    .attr("width",700)
    .attr("height",2)
    //.append("text").text("Test on the rect");
    ;

// rect 2
vis.append("rect")
    .attr("fill","#eee")
    .attr("y", 28)
    .attr("width",700)
    .attr("height",2)
    //.append("text").text("Test on the rect");
    ;

/*
// title
vis.append("text")
    .attr("transform", "translate(2,50)")
    .style("text-anchor", "left")
    .text("Prbs.");//
*/
// Legend
vis.append("text")
    .attr("transform", "translate(450,50)")
    .style("text-anchor", "left")
    .attr("style", "font-size:12px")
    .text("Legend : problems done video blabla");//



// draw week groups
var weeks=vis.selectAll(".weeks")
    .data(['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'])
  .enter()
    .append("g")
    .attr("class", "weeks")
    .attr("style", "font-size:12px")
    .attr("transform", function(d,i){
        return "translate(" + (i*((width)/8)) + ",0)";
    })
    ;
    
// Draw title
weeks.append("text")
  .text( function(d,i){return d;})
    .attr("transform", "translate(4,10)");
//Draw vertical separators
weeks.append("line")
    .attr("x1",0)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",35)
    .attr('stroke', '#999')
    .attr('stroke-width', 1)
    .attr("class","crisp")
    ;


// Draw video rectangles
function getProgressData(){
    
    //console.log('getProgressData()');
    
    var p={
        'do':'getWeeklyProgress',
        'student_id':$('#student_id').val()
    }
    
    //$.getJSON( "ajax/test.json", function( data ) {});
    $('#progressMore').load("student_ctrl.php",p,function(json){        
        try{  
            var data=$.parseJSON(json);
            updateProgress(data);
            $('#progressMore').html("ok");
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



//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    getProgressData();
});