
var colors;//color domain
var colorDomain;

var width = 700,
    height = 100,
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

var layer1=vis.append("g");//background
var layer2=vis.append("g");//foreground
var layer3=vis.append("g");//top layer

// draw week groups
var weeks=layer3.selectAll(".weeks")
    .data(['WEEK 1','WEEK 2','WEEK 3','WEEK 4','WEEK 5','WEEK 6','WEEK 7','WEEK 8'])
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
  .text( function(d,i){return d;})
    .attr("transform", "translate(4,10)");

// Draw icons
// http://fortawesome.github.io/Font-Awesome/cheatsheet/
weeks.append('text')
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '16px' )
    .attr("fill", "#fff")
    .attr("transform", "translate(4,34)")
    .text(function(d) { return '\uf16a' }); //youtube icon

weeks.append('text')
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '16px' )
    .attr("fill", "#fff")
    .attr("transform", "translate(4,52)")
    .text(function(d) { return '\uf16a' }); //youtube icon


// Draw vertical separators
/*
weeks.append("line")
    .attr("x1",0)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",60)
    .attr('stroke', '#ddd')
    .attr('stroke-width', 1)
    .attr("class","crisp")
    ;
*/

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
        .attr("height",16)
        .attr("fill","#d11626");

    pbs.transition(50).delay(function(d,i){return i*200})
    .attr("width",function(d){
        console.log(d,data[d]);
        $.each(data,function(d,i){

        })
        //var pct=Math.round(data[d].problemdone/data[d].problemcount*colwidth);
        var pct=Math.random()*100;
        if(pct)return pct;
        return 0;
        //return Math.random()*colwidth;
    })

    // Draw video rectangles
    var vids=weeks.append("rect")
      .attr("x",0)
      .attr("y",38)
      .attr("width",0)
    .attr("height",16)
    .attr("fill","#000");

    vids.transition(50).delay(function(d,i){return i*200})
        .attr("width",function(d){
        //var pct=Math.round(data[d].videopct/100*colwidth);
        var pct=Math.random()*100;
        if(pct)return pct;
        return 0;
    })
}



//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    getProgressData();
});