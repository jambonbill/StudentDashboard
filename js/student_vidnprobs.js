// Video and problems view

var width = 700,
    height = 180;

//var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var vps = d3.select("#vidnprobs")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    
//add legent
vps.append("text")
        .attr("transform", "translate(10,70),rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill", "#999")
        .text("VIDEO");

vps.append("text")
        .attr("transform", "translate(10,150),rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill", "#999")
        .text("PROBLEMS");

function loadVidnProbs(){
    //console.log('loadVidnProbs()');
    var p={
        'do':'getDailyData',
        'student_id':$('#student_id').val()
    }
    $('#moreVidndprobs').html("loading...");
    $('#moreVidndprobs').load("student_ctrl.php",p,function(x){
        try{
            dat=JSON.parse(x);
            dat.forEach(function(d) {
                d.date = d3.time.format("%Y-%m-%d").parse(d.date);
            });            
            // console.log("dat",dat);
            updateVidnprobs(dat);

            if(dat.length){
                $('#moreVidndprobs').html(dat.length+' record(s)');
            }            
        }
        catch(e){
            console.log(e);
        }
    });
}



function updateVidnprobs(data){

    //console.log('updateVidnprobs()',data);    
    //var dateDomain = d3.extent( dat ,function(o){return o.date;});        
    //dateDomain[0]=new Date("2018-09-14");//start of the course
    dateDomain=[new Date("2018-09-14"),new Date("2018-12-24")];//fixed scale

    //compute xscale
    var xScale = d3.time.scale().range([20, width-30]).domain(dateDomain);
    var maxp=d3.max(dat,function(o){return o.problem_done});
    var maxv=d3.max(dat,function(o){return o.video});
    //console.log(maxp,maxv); 
    
    var videoScale=d3.scale.linear().range([0,80]).domain([0,maxv]);
    var problemScale=d3.scale.linear().range([0,80]).domain([0,maxp]);


    
    //define xAxis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        //.ticks(d3.time.days, 1)
        //.ticks(d3.time.days, 7)//tick every x
        .ticks(4)//x tick
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        //.tickFormat(d3.time.format('%a %d'))
        //.tickFormat(d3.time.format('%b'))//27Sep
        .tickFormat(d3.time.format('%b'))//Sep
        .tickSize(40)
        .tickPadding(5);
        
    
    //var xAxis = d3.svg.axis().scale(xScale);
    
    //append axis
    vps.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, 80)')
        .style('shape-rendering','crispEdges')
        .call(xAxis)

        .selectAll("text")
            .style("font-size", "11px")
            .style("text-anchor", "start");
    
    //override css
    vps.selectAll('.axis line, .axis path').style({'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});
    


    var b = vps.selectAll("bars.video").data(data);
    //var format=d3.time.format('%d %b');
    b.enter().append("rect")// video
          .attr("class", "video" )
          .attr("fill", function(d){return '#000';})
          .style("stroke","#000")
          .style("stroke-width",0)
          .attr("width" , 5 )
          .attr("x" , function(d){return xScale(d.date);} )
          .attr("y" , 80)
          .attr("height" , 0)
          .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
                ttover("<b>"+d3.time.format('%A %d %b')(d.date) +"</b><hr />"+ d.minutes_on_site+" minutes of video");
            })
          .on("mousemove",function(){ttmove();})
          .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
          /*
          .append("title").text(function(d){
            if(d.video){
                var minutes=Math.round(d.video/60);
                return d.date+" - " + minutes+ " minutes of video";    
            }
            return '';
          })
          */
          ;
    
    b.transition().delay(function(d,i){return i*20})
        .attr("y" , function(d){
            if(d.video)return 80-videoScale(d.video);
            return 80;
        })
        .attr("height" , function(d){
            if(d.video)return videoScale(d.video);
            return 0;
        });
    

    var b = vps.selectAll("bars.problems").data(data);
    b.enter().append("rect")// problems
        .attr("class", "video" )
        .attr("fill", function(d){
            var pct=Math.round(d.problem_score/d.problem_done*100);
            return colorDomain(pct);
            //return '#337ab7';
        })
        .style("stroke",function(d){return colorDomain(Math.round(d.problem_score/d.problem_done*100))})
        .style("stroke-width",0)
        .attr("x" , function(d){return xScale(d.date);} )
        .attr("y" , 81)
        .attr("width",5)
        .attr("height",0)
        .on("mouseover",function(d){
            d3.select(this).style('stroke-width', 2);
            var htm="<b>"+d3.time.format('%A %d %b')(d.date)+"</b><hr />";
            var pct=Math.round(d.problem_score/d.problem_done*100);
            htm+=d.problem_done+" problem done<br />";
            htm+="Score: "+d.problem_score+"/"+d.problem_done+" ("+pct+"%)<br />";
            ttover(htm);
        })
        .on("mousemove",function(){ttmove();})
        .on("mouseout",function(){d3.select(this).style('stroke-width', 0);ttout();})
        /*
        .append("title").text(function(d){
            if(d.problem)return formatDate(d.date)+" - "+d.problem+" problem(s) done";
            return '';
        })
        */
        ;
    
    b.transition().delay(function(d,i){return i*20})
        .attr("height" , function(d){
            if(d.problem_done)return Math.max(0,problemScale(d.problem_done));
        })
    
}

//var formatDate=d3.time.format('%d %b');

$(function(){
    loadVidnProbs();
});