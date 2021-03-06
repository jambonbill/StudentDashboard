
var width = 340,height = 260;//todo : reduce height
//var width = 340,height = 340;//todo : reduce height

var cola = d3.select("#colA").append("svg").attr("width", width).attr("height", height);
var colb = d3.select("#colB").append("svg").attr("width", width).attr("height", height);

//Progress colors (Ailadi scheme) (already defined in overview)
//var colors=['#FF5F06','#F39224','#EDC82B','#E5E131','#B9DB50','#8DD685','#30ad77'];//Vert correct
//var colorDomain=d3.scale.linear().domain([0,50,60,70,80,90,100]).range(colors);

// Column A
function updateClass1(data,criteria,student_id){
	//console.log('udpateClass()',criteria);
	switch(criteria){
		
		case 'a0':
			var labelx="Problems answered";
			var labely="Problems score";
			$.each(data,function(k,o){o.vx=o.problem_done});
			$.each(data,function(k,o){o.vy=o.problem_score});
			break;

		case 'a':
			var labelx="Video watched (count)";
			var labely="Problems answered";
			$.each(data,function(k,o){o.vx=o.video_count});
			$.each(data,function(k,o){o.vy=o.problem_done});
			break;
		
		case 'a2':
			var labelx="Video watched (time)";
			var labely="Problems answered";
			$.each(data,function(k,o){o.vx=o.video_watched});
			$.each(data,function(k,o){o.vy=o.problem_done});
			break;

		case 'a3':
			var labelx="Video watched (time)";
			var labely="Video watched (count)";
			$.each(data,function(k,o){o.vx=o.video_watched});
			$.each(data,function(k,o){o.vy=o.video_count});
			break;

		case 'b':
			var labelx="Time spent (minutes)";
			var labely="Problems score";
			$.each(data,function(k,o){o.vx=o.time_spent});
			$.each(data,function(k,o){o.vy=o.problem_score});
			break;
		
		case 'c':
			var labelx="Time spent (minutes)";
			var labely="Problems answered";
			$.each(data,function(k,o){o.vx=o.time_spent});
			$.each(data,function(k,o){o.vy=o.problem_done});
			break;
		

		case 'd':
			var labelx="Avg Session length (minutes)";
			var labely="Problems score";
			$.each(data,function(k,o){o.vx=o.session_avg});
			$.each(data,function(k,o){o.vy=o.problem_score});
			break;

		case 'e':
			var labelx="Time spent (minutes)";
			var labely="Number of sessions";
			$.each(data,function(k,o){o.vx=o.time_spent});
			$.each(data,function(k,o){o.vy=o.sessions});
			break;
	}

	var xDomain=d3.extent(data,function(d){return d.vx;});
	var yDomain=d3.extent(data,function(d){return d.vy;});
	//var xScale=d3.scale.linear().range([30, width-10]).domain(xDomain);
	var xScale=d3.scale.linear().range([40, width-10]).domain(xDomain);
	var yScale=d3.scale.linear().range([height-40, 10]).domain(yDomain);	
	
	//define xAxis
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
        .ticks(5)//x tick
        .tickSize(4)
        .tickPadding(4);

	//define yAxis
    var yAxis = d3.svg.axis().scale(yScale).orient('left')
        .ticks(5)//x tick
        .tickSize(3)
        .tickPadding(2);

    cola.selectAll('g,text').remove();//delete axis
    cola.append('g').attr('class', 'axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(0, '+(height-40)+')')
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "11px")
        .style("text-anchor", "start");

    cola.append('g').attr('class','axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(40, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "11px")
        .style("text-anchor", "left");

	//X label
	cola.append('text')
       	.attr("transform","translate("+width+","+(height-10)+")")
       	.attr("fill", "#999")
       	.style("text-anchor", "end")
       	.style("font-size", "10px")
       	.text(labelx.toUpperCase());

    //Y label
    cola.append('text')
    	.attr("fill", "#999")
    	.attr("transform","translate(10,0),rotate(-90)")
		.style("text-anchor", "end")
       	.style("font-size", "10px")
       	.text(labely.toUpperCase());
		
	//override css
    cola.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

    

    // Pinpoint student with 2 lines
	var ipos=0;//studend position
	$.each(data,function(i,d){if(d.student_id==student_id)ipos=i;});
	//console.log(ipos,xScale(ipos));
	

	// Vertical line to pin point the user
	var vline= cola.selectAll("line.vline").data([data[ipos]]);
	vline.enter().append("line")
		.attr("class","vline")
		.attr("stroke","#f98d70")
		.style("stroke-dasharray", ("3, 3"))
		.style("opacity",0.5)
		.attr("stroke-width",1)
		.style('shape-rendering','crispEdges');
	
	vline.transition()
		.attr("x1",function(d){return xScale(d.vx);})
		.attr("x2",function(d){return xScale(d.vx);})
		.attr("y1",0).attr("y2",height-40);


	// Horizontal line to pin point the user
	var hline= cola.selectAll("line.hline").data([data[ipos]]);
	hline.enter().append("line")
		.attr("class","hline")
		.style("stroke-dasharray", ("3, 3"))
		.attr("stroke","#f98d70")
		.attr("stroke-width",1)
		.style("opacity",0.5)
		.style('shape-rendering','crispEdges');
	
	hline.transition()
		.attr("y1",function(d){return yScale(d.vy);})
		.attr("y2",function(d){return yScale(d.vy);})
		.attr("x1",40).attr("x2",width);




	// Plot students (class)
	var m=cola.selectAll("circle.student").data(data);
	m.enter().append("circle").attr("class","student")
		.attr("cx",width/2)
		.attr("cy",height/2)
		.attr("r",4)
		.attr("stroke","#000")
		.attr("stroke-width",0)
		.style("opacity", 0.5)
		.attr("fill",function(d){
			return '#999';
			//return colorDomain(d.problem_done/d.problem_score*100);
		})
		.on("mouseover",function(d,i){
			d3.select(this).style('stroke-width', 2);
			d3.select(this).style('opacity', 1);
			var htm="<b>Student #"+d.student_id+"</b><hr />";
			htm+="<table width=100%>";
			htm+="<tr><td>Sessions<td style='text-align:right'>"+d.sessions;
			htm+="<tr><td>Avg session time<td style='text-align:right'>"+Math.round(d.session_avg)+" minute";
			
			if(d.time_spent>60){
				var hours=Math.round(d.time_spent/60)+"h and "+d.time_spent%60+" minutes";
				htm+="<tr><td>Time spent<td style='text-align:right'>"+hours;	
			}else{
				htm+="<tr><td>Time spent<td style='text-align:right'>"+d.time_spent+" minutes";	
			}
			
			htm+="<tr><td>Video count<td style='text-align:right'>"+d.video_count+"/141";
			
			var minutes=Math.round(d.video_watched/60);
			if(minutes>60){
				var hours=Math.round(minutes/60)+"h "+minutes%60+" min";
				htm+="<tr><td>Video watched<td style='text-align:right'>"+hours;	
			}else{
				htm+="<tr><td>Video watched<td style='text-align:right'>"+minutes+" min";	
			}

			
			
			//
			htm+="<tr><td>Problems done<td style='text-align:right'>"+d.problem_done+"/108";
			var score=Math.round(d.problem_score/d.problem_done*100);
			htm+="<tr><td>Problems score<td style='text-align:right'><b style='color:"+colorDomain(score)+"'>"+d.problem_score+"/"+d.problem_done+" ("+score+"%)</b>";
			
			htm+="</table>";
			
			ttover(htm);
		})
		.on("mousemove",function(d,i){ttmove();})
		.on("mouseout",function(d,i){
			d3.select(this).style('stroke-width', 0);
			d3.select(this).style('opacity', function(d){
				if(d.student_id==student_id)return 1;
				return 0.5;
			});
			ttout();})
		;
	m.transition().delay(10)
		.attr("cx",function(d,i){return xScale(d.vx);})
		.attr("cy",function(d,i){return yScale(d.vy);})
		.attr("fill",function(d){
			if(d.student_id==student_id)return '#c00';
			return '#939da9';
			//return colorDomain(d.problem_done/d.problem_score*100);
		})
		.attr("r",function(d){if(d.student_id==student_id)return 5;else return 4;})
		.style("opacity", function(d){if(d.student_id==student_id)return 1;else return 0.5;})
		;

}






// Column B
function updateClass2(data,criteria,student_id){
	//console.log('updateSelector criteria',criteria);
	switch(criteria){
		
		case 'video_watched'://no
			var labely="Video watched";
			$.each(data,function(i,d){d.val=d.video_watched});		
			break;
		
		case 'problem_done':
			var labely="Problems answered";
			$.each(data,function(i,d){d.val=d.problem_done});
			break;

		case 'problem_score':
			var labely="Problems score";
			$.each(data,function(i,d){d.val=d.problem_score});
			break;

		case 'time_spent':
			var labely="Time spent on course";
			$.each(data,function(i,d){d.val=d.time_spent});
			break;
		
		case 'sessions':
			var labely="Sessions";
			$.each(data,function(i,d){d.val=d.sessions});
			break;

		case 'session_avg'://
			var labely="Avg session length (min)";
			$.each(data,function(i,d){d.val=d.session_avg});
			break;
		
		default:console.log('criteria error');return false;break;
	}
	
	data.sort(function(a,b){return a.val-b.val});	
	var domain=d3.extent(data,function(d){return d.val});
	
	//console.log('domain '+criteria,domain);
	var xScale = d3.scale.linear().range([40, width-20]).domain([0,500]);
	var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5)//x tick
    .tickSize(4)
    .tickPadding(5);

	colb.selectAll('g,text').remove();//quick and dirty :: todo update axis
	colb.append('g')
	    .attr('class', 'axis')
	    .style('shape-rendering','crispEdges')
	    .attr('transform', 'translate(0,'+(height-40)+')')
	    .call(xAxis)
	    .selectAll("text")
	    .style("font-size", "11px")
	    .style("text-anchor", "start");
	

	// X label
	colb.append('text')
		.attr("fill", "#999")
       	.attr("transform","translate("+width+","+(height-10)+")")
       	.style("text-anchor", "end")
       	.style("font-size", "10px")
       	.text("STUDENTS");

    // Y label
    colb.append('text')
    	.attr("fill", "#999")
    	.attr("transform","")
    	.attr("transform","translate(10,0),rotate(-90)")
		.style("text-anchor", "end")
       	.style("font-size", "10px")
       	.text(labely.toUpperCase());

	
	var yScale = d3.scale.linear().range([height-40,10]).domain(domain);
	var yAxis = d3.svg.axis().scale(yScale).orient('left')
	    .ticks(5)//x tick
	    .tickSize(2)
	    .tickPadding(2);

    colb.append('g').attr('class','axis')
        .style('shape-rendering','crispEdges')
        .attr('transform', 'translate(40, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "11px")
        .style("text-anchor", "left");

	//override css
    colb.selectAll('.axis line, .axis path').style({ 'stroke': '#ddd', 'fill': 'none', 'stroke-width': '1px'});

	var ipos=0;//studend position
	$.each(data,function(i,d){if(d.student_id==student_id)ipos=i;});
	
	// Vertical line to pin point the user
	var vline= colb.selectAll("line.vline").data([ipos]);
	vline.enter().append("line")
		.attr("class","vline")
		.attr("stroke","#f98d70")
		.style("stroke-dasharray", ("3, 3"))
		.style("opacity",0.5)
		.attr("stroke-width",1)
		.style('shape-rendering','crispEdges')
		;
	
	vline.transition()
		.attr("x1",function(d){return xScale(d);})
		.attr("x2",function(d){return xScale(d);})
		.attr("y1",0).attr("y2",height-40);

	// Horizontal line to pin point the user
	var vline= colb.selectAll("line.hline").data([ipos]);
	vline.enter().append("line")
		.attr("class","hline")
		.attr("stroke","#f98d70")
		.style("stroke-dasharray", ("3, 3"))
		.style("opacity",0.5)

		.attr("stroke-width",1)
		.style('shape-rendering','crispEdges');
	
	vline.transition()
		.attr("y1",function(d){return yScale(data[d].val);})
		.attr("y2",function(d){return yScale(data[d].val);})
		.attr("x1",40).attr("x2",width);

	var us=colb.selectAll("circle.classroom").data(data)
	us.enter()
		.append("circle")
		.attr("class","classroom")
		.attr("r",0)
		.style("opacity", function(d){
			if(d.student_id==student_id)return 1;
			return 0.5;
		})
		.attr("stroke","#000")
		.attr("stroke-width",0)
		.on("mouseover",function(d,i){
			d3.select(this).style('stroke-width', 2);
			d3.select(this).style('opacity', 1);
			var htm="<b>Student #"+d.student_id+"</b><hr />";
			htm+="<table width=100%>";
			htm+="<tr><td>Sessions<td style='text-align:right'>"+d.sessions;
			htm+="<tr><td>Avg session time<td style='text-align:right'>"+Math.round(d.session_avg)+" minutes";
			
			var hours=Math.round(d.time_spent/60)+"h and "+d.time_spent%60+" minutes";
			if(d.time_spent>60){
				htm+="<tr><td>Time spent<td style='text-align:right'>"+hours;
			}else{
				htm+="<tr><td>Time spent<td style='text-align:right'>"+d.time_spent+" minutes";
			}
			
			htm+="<tr><td>Video count<td style='text-align:right'>"+d.video_count+"/141";
			
			var minutes=Math.round(d.video_watched/60);
			if(minutes>60){
				var hours=Math.round(minutes/60)+"h "+minutes%60+" minutes";
				htm+="<tr><td>Video watched<td style='text-align:right'>"+hours;
			}else{
				htm+="<tr><td>Video watched<td style='text-align:right'>"+minutes+" minutes";
			}
			
			
			htm+="<tr><td>Problems answered<td style='text-align:right'>"+d.problem_done+"/108";
			if(d.problem_score>0&&d.problem_done>0){
				var score=Math.round(d.problem_score/d.problem_done*100);	
			}else var score=0;
			
			htm+="<tr><td>Problems score<td style='text-align:right'><b style='color:"+colorDomain(score)+"'>"+d.problem_score+"/"+d.problem_done+" ("+score+"%)</b>";
			htm+="</table>";
			ttover(htm);
		})
		.on("mousemove",function(d,i){ttmove();})
		.on("mouseout",function(d,i){
			d3.select(this).style('stroke-width', 0);
			if(d.student_id==student_id)d3.select(this).style('opacity', 1);
			else d3.select(this).style('opacity', 0.5);
			ttout();
		})
		;
	
	us.transition()
		.attr("cx",function(d,i){return xScale(i);})
		.attr("cy",function(d,i){return yScale(d.val);})
		.attr("fill",function(d){
			if(d.student_id==student_id)return "#c00";
			return "#939da9"
		})
		.style("opacity", function(d){
			if(d.student_id==student_id)return 1;
			return 0.5;
		})
		.attr("r",function(d){
			if(d.student_id==student_id)return 5;
			return 4;
		});	
}


$(function(){
	$('#selector1').change(function(o){
		if($('#selector1').val())updateClass1(csv_class,$('#selector1').val(),+$('#student_id').val());
	});
	$('#selector2').change(function(o){
		if($('#selector2').val())updateClass2(csv_class,$('#selector2').val(),+$('#student_id').val());
	});
});
