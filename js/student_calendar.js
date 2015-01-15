// http://bl.ocks.org/mbostock/4063318

var width = 800,
    height = 120,
    cellSize = 12; // cell size

var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

/*
var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
*/
var color=d3.scale.category20c();

var svg = d3.select("#calendarDiv").selectAll("svg")
    //.data(d3.range(2018, 2019))
    .data([2018])
  .enter().append("svg")
    //.attr("fill", "#c00")
    .attr("width", width)
    .attr("height", height)
    //.attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 63) / 2) + "," + (height - cellSize * 7 - 20) + ")");

// year
svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });//annee


var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

// title must be set, so we can update it later
rect.append("title")
    .text(function(d){ 
      return '';//
      //return d;// date
    });


// draw month outlines
svg.selectAll(".month")
    .data(function(d) { 
      //console.log("svg.selectAll(.month)", d);
      return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); 
    })
  .enter()
    .append("text")
    .attr("transform", function(d,i){
        
        return "translate(" + week(d) * cellSize + ",-2)";
    })
    .text(function(d,i){
      //console.log("text",d,i);
      //var t1 = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return month[d.getMonth()];
    });
    
    

function updateLegend(){

    svg.append("text")
        .attr("transform", "translate(20," + (cellSize * 8 + 2) + ")")
        .style("text-anchor", "middle")
        .text("Less");
    
    svg.append("text")
        .attr("transform", "translate(120," + (cellSize * 8 + 2) + ")")
        .style("text-anchor", "middle")
        .text("More");

    var rec = svg.selectAll(".legend")
        .data([1,25,50,75,100])
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d,i) { return 40 + i * cellSize; })
        .attr("y", function(d) { return (cellSize*7+4); })
        .attr("fill", function(d) { return color(d); })
        //.svg.append("rect").
}

var data;
var colors;//color domain

//loadCsv();
function loadCsv(){
    
    console.log('loadCsv()');
    d3.csv("dji.csv", function(d){
        return {
            //Date: new Date(d.Date),
            Date: d.Date,
            Minutes: +d.Minutes
        };
    },
    function(error,rows){
        //console.log(rows);
        // get min max for color scale
        var colorDomain = d3.extent( rows ,function(o){return o.Minutes;});
        colors=d3.scale.linear().domain([0,100]).range(["#E6E685","#1E6823"]);//github colors
        //console.log("colorDomain", colorDomain);
        data = d3.nest()
            .key(function(d) { return d.Date; })
            .rollup(function(d) { 
                return d[0].Minutes;
            })
            .map(rows);// we convert data to make it fast to digest (key:value)

        updateCalendar();
    });
}

function loadCtrl(){
    console.log('loadCtrl()');
    var p={
        'do':'getCalendar',
        'student_id':$('#student_id').val()
    }
    $('#more').load("student_ctrl.php",p,function(x){
        try{
            dat=JSON.parse(x);
            console.log("data",dat);
            var colorDomain = d3.extent( dat ,function(o){return o.minutes;});
            //colors=d3.scale.linear().domain(colorDomain).range(["#E6E685","#1E6823"]);//github colors (green)
            //colors=d3.scale.linear().domain(colorDomain).range(["#ffc9c9","#cc0000"]);//red colors
            colors=d3.scale.linear().domain(colorDomain).range(["#d6f2fc","#337ab7"]);//blue colors
            
            data = d3.nest()
              .key(function(d) { return d.date; })
              .rollup(function(d) { 
                return d[0].minutes;
              })
              .map(dat);

            updateCalendar();
            $('#more').html('');
        }
        catch(e){
            console.log(e);
        }
    });
}


function updateCalendar(){

    console.log('updateCalendar()');

    rect.filter(function(d) {//go through every rect
        return d in data;//and filters only the one with a matching date in "data"
    })
    
    .style("fill", function(d, i) { return colors(data[d]); })
    .select("title")
    .text(function(d) { 
      //console.log('d',d,data[d]);
      var date=new Date(d);
      return weekday[date.getDay()] +" "+ date.getDate() + " " + month[date.getMonth()] + " :: " + data[d]+" minutes online";
    });
    updateLegend();
}




function monthPosition(t0){
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = +day(t0), w0 = +week(t0),
        d1 = +day(t1), w1 = +week(t1);
}

function monthPath(t0) {
  console.log("monthPath("+t0+")");
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  var path= "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
      
      return path;
}

//d3.select(self.frameElement).style("height", "2910px");
$(function(){
    loadCtrl();
});