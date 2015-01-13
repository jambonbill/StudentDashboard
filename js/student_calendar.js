
var width = 800,
    height = 136,
    cellSize = 12; // cell size

var month=[];
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10]= "Nov";
month[11]= "Dec";

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

/*
var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
*/
//var color=d3.scale.category20c();

var svg = d3.select("#calendarDiv").selectAll("svg")
    .data(d3.range(2018, 2019))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

// year
svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return "Year "+d; });


var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return "title="+d; });


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
    
    
loadCsv();
var data;
function loadCsv(){
    
    console.log('loadCsv()');
    
    d3.csv("dji.csv", function(error, csv) {
  
        data = d3.nest()
            .key(function(d) { return d.Date; })
            .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
            .map(csv);

        console.log('loadcsv()',data);
        updateCalendar();
        //return data;
    });
}

function updateCalendar(){
    console.log('updateCalendar()');

    rect
        .filter(function(d) {
            console.log("d.length",d.length);
            return d in data;
        })
    
    //.fill()
      //.attr("class", function(d) {
        //console.log(d,"day " + color(data[d]));
        //return "day " + color(data[d]);
      //})
        .style("fill", function(d, i) { return color(i); })
        .select("title")
        .text(function(d) { return d + " :: minutes "; });
    //});
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
