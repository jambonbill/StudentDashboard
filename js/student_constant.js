// Constant view


//also declared in student_calendar.js !
function daysBetween(a, b) {
    var one = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var two = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    var msecondsPerDay = 1000 * 60 * 60 * 24;
    var mBetween = two.getTime() - one.getTime();
    var days = mBetween / msecondsPerDay;
    return Math.floor(days);// Round down.
}


var width = 700,
    height = 60;

var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");


var cns = d3.select("#constantDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    




//var data;
//var colors;//color domain
//var colorDomain;

function loadConstant(){
    //console.log('loadConstant()');
    var p={
        'do':'getCalendar',
        'student_id':$('#student_id').val()
    }
    $('#moreConstant').html("loading...");
    $('#moreConstant').load("student_ctrl.php",p,function(x){
        try{
            dat=JSON.parse(x);
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            dat.forEach(function(d) {
                d.date = parseDate(d.date);
            });
            //console.log("dat",dat);
            updateConstant(dat);
            dd = d3.extent( dat ,function(o){return o.date;});
            var daysb=daysBetween(dd[0],dd[1]);
            //console.log('daysBetween(dd[0],dd[1])',daysb);
            var xdays=Math.floor(daysb/dat.length);
            if(dat.length<2){
                $('#moreConstant').html('Not enough data to compute constancy');
            } else {
                $('#moreConstant').html(dat.length+' session(s) over '+(daysb+1)+' day(s), or approx every '+xdays+' days');
            }
        }
        catch(e){
            console.log(e);
        }
    });
}



function updateConstant(data){

    //console.log('updateConstant()',data);
    
    dateDomain = d3.extent( dat ,function(o){return o.date;});
    minuteDomain = d3.extent( dat ,function(o){return o.minutes;});
    //console.log('dateDomain',dateDomain);
    //console.log('minuteDomain',minuteDomain);
    
    //
    //d3.selectAll(".axis, .line, g").remove();

    //compute xscale
    var xScale = d3.time.scale().range([10, width-10]);
    //Start domain on st spetember for better readability
    dateDomain[0]=new Date("2018-09-15");
    //dateDomain[1]=new Date(dateDomain[1].setDate(dateDomain[1].getDate()+1));
    //console.log(dateDomain[0]);
    xScale.domain(dateDomain);
    
    var rScale = d3.scale.linear().domain(minuteDomain).range([3, 10]);
    
    //define xAxis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        //.ticks(d3.time.days, 1)
        //.ticks(d3.time.days, 7)//tick every x
        .ticks(5)//x tick
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        //.tickFormat(d3.time.format('%a %d'))
        .tickFormat(d3.time.format('%d%b'))//27Sep
        .tickSize(10)
        .tickPadding(5);
        ;
    
    //var xAxis = d3.svg.axis().scale(xScale);
    
    //append axis
    cns.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, 20)')
        .call(xAxis)
        .selectAll("text")
            //.attr("y", 0)
            //.attr("x", 9)
            //.attr("dy", ".35em")
            .style("font-size", "11px")
            .style("text-anchor", "start");
            
    //override css
    cns.selectAll('.axis line, .axis path').style({ 'stroke': '#999', 'fill': 'none', 'stroke-width': '1px'});


    var b = cns.selectAll("circle.t1").data(data);
    var format=d3.time.format('%d %b');
    b.enter().append("circle")
          .attr("class", "t1" )
          .attr("fill", function(d){return '#337ab7';})
          .style("opacity", 1)
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("r" , 0 )
          .on("mouseover",function(){d3.select(this).style('stroke-width', 3);})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);})
          .append("title").text(function(d){ 
                //return d.date+"::"+d.minutes + " minutes";//
                return format(d.date)+" - "+d.minutes + " minutes";
            })
          //.on()
          ;
      
    b.transition(50)
        .delay(function(d,i){return i*20})
        
        .attr("cx", function(d,i){return xScale(d.date);})
        .attr("cy", function(d,i){return 20;})
        //.attr("r" , function(d){return minuteScale(d.minutes);} )
        .attr("r" , function(d){
            return rScale(d.minutes);
        })
        ;
      
    b.exit().remove(); 


    //updateConstantLegend();
    //console.log('constant done');
}


function updateConstantLegend(){
    console.log('updateConstantLegend()');
    cns.append("text")
        .attr("transform", "translate(20,20)")
        .style("text-anchor", "left")
        .text("updateConstantLegend");
}


$(function(){
    loadConstant();
});