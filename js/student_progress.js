var data;
var colors;//color domain
var colorDomain;

var width = 700,
    height = 210,
    cellSize = 12; // cell size


var vis = d3.select("#progressDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

// rect 1
vis.append("rect")
    .attr("fill","#ddd")
    .attr("width",700)
    .attr("height",100)
    //.append("text").text("Test on the rect");
    ;
    

// rect 2
vis.append("rect")
    .attr("fill","#eee")
    .attr("y", 100)
    .attr("width", 700)
    .attr("height", 100);//

// title
vis.append("text")
    .attr("transform", "translate(2,10)")
    .style("text-anchor", "left")
    .text("Problems");//

// title
vis.append("text")
    .attr("transform", "translate(2,110)")
    .style("text-anchor", "left")
    .text("Videos");//

// draw weeks
vis.selectAll(".weeks")
    .data([1,2,3,4,5,6,7,8])
  .enter()
    .append("text")
    .attr("class", "weeks")
    .attr("transform", function(d,i){
        return "translate(" + i*(width/8) + ",210)";
    })
    .text(function(d,i){
      return "Week " + d;
    });
    

   

function getProgressData(){
    
    console.log('getProgressData()');
    
    var p={
        'do':'getProgressData',
        'student_id':$('#student_id').val()
    }
    
    $('#progressMore').load("student_ctrl.php",p,function(x){
        
        try{  
            console.log('at least try');
            eval(x);
            //dat=JSON.parse(x);
            updateProgress();
            $('#progressMore').html("ok");
        }
        catch(e){
            console.log(e);
        }
    });
}


function updateProgress(){
    console.log('updateProgress()');
    //updateLegend();
}



//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    getProgressData();
});