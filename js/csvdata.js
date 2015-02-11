var csv_minutes_per_day;//	student_id,date,minutes_on_site
var csv_problem_attempts;//	student_id,section,subsection,problem_id,date_attempted,max_points,score
var csv_problems;//		id,section,subsection,max_points
var csv_video_views;//	student_id,section,subsection,video_id,date_viewed,duration_seconds,watched_seconds
var csv_videos;//	id,section,subsection,duration_seconds

//100% progress
var group_100=[23,47,84,95,119,127,129,130,146,158,208,214,246,287,296,307,315,346,369,370,393,394,408,431,450,461,499];

//Over 50% progress
var group_50=[92,159,113,363,152,342,449,423,161,460,283,162,178,120];

$(function(){
	
	// https://github.com/mbostock/d3/wiki/CSV
    
	d3.csv("minutes_per_day.csv", function(error,data) {
		data.forEach(function(d){
			d.student_id=+d.student_id;
			d.date=new Date(d.date);
			d.minutes_on_site=+d.minutes_on_site;
		});
   		csv_minutes_per_day=data;
	});

	d3.csv("problem_attempts.csv", function(error,data) {
		data.forEach(function(d){
			d.student_id=+d.student_id;
			d.date_attempted=new Date(d.date_attempted);
			d.max_points=+d.max_points;
			d.score=+d.score;
		});
   		csv_problem_attempts=data;
	});

	d3.csv("problems.csv", function(error,data) {
		data.forEach(function(d){
			d.max_points=+d.max_points;
		});
   		csv_problems=data;
	});

	d3.csv("video_views.csv", function(error,data) {
		data.forEach(function(d){
			d.student_id=+d.student_id;
			d.date_viewed=new Date(d.date_viewed);
			d.duration_seconds=+d.duration_seconds;
			d.watched_seconds=+d.watched_seconds;
		});
   		csv_video_views=data;
	});

	d3.csv("videos.csv", function(error,data) {
		data.forEach(function(d){
			d.duration_seconds=+d.duration_seconds;
		});
   		csv_videos=data;
	});


	csvloaded=function(){
		var ld=true;
		if(!csv_minutes_per_day)ld=false;
		if(!csv_problem_attempts)ld=false;
		if(!csv_problems)ld=false;
		if(!csv_video_views)ld=false;
		if(!csv_videos)ld=false;
		if(ld){
			console.log("csv_minutes_per_day",csv_minutes_per_day.length);
			console.log("csv_problem_attempts",csv_problem_attempts.length);
			console.log("csv_problems",csv_problems.length);
			console.log("csv_video_views",csv_video_views.length);
			console.log("csv_videos",csv_videos.length);
			updateStudent(92);
			return ld;
		}else{
			console.log('loading csv...');
			t=setTimeout(csvloaded,50);
		}
	}

	var t=setTimeout(csvloaded,50);//todo -> retry on fail

	$('#btnRandom').click(function(){
		var student_id=Math.round(Math.random()*500);
		var dat=getStudentData(student_id);
		//console.log(dat);
	});
});

function minutes_per_day(student_id){
	return csv_minutes_per_day.filter(function(d){return d.student_id==student_id});
}

function problem_attempts(student_id){
	return csv_problem_attempts.filter(function(d){return d.student_id==student_id});
}

function video_views(student_id){
	return csv_video_views.filter(function(d){return d.student_id==student_id});
}


// build a complete json array for a given student
function getStudentData(student_id){
	//console.log('getStudentData(student_id)',student_id);
	var min=minutes_per_day(student_id);
	var prb=problem_attempts(student_id);
	var prbMap={};
	
	var vid=video_views(student_id);
	var vidMap={};

	//add problems attempted
	for(var i=0;i<prb.length;i++){
		if(!prbMap[prb[i].date_attempted])prbMap[prb[i].date_attempted]=[];
		prbMap[prb[i].date_attempted].push(prb[i]);
	}
	//add video watched
	for(var i=0;i<vid.length;i++){
		if(!vidMap[vid[i].date_viewed])vidMap[vid[i].date_viewed]=[];
		vidMap[vid[i].date_viewed].push(vid[i]);
	}
	
	var dat=[];// daily data
	$.each(min,function(k,o){
		var p=prbMap[o.date];
		var v=vidMap[o.date];
		if(p)o.problem=p;
		if(v)o.video=v;
		dat.push(o);
	});

	
	//some simplification
	$.each(dat,function(k,o){
        o.problem_done=0;
        o.problem_score=0;
        o.video_watched=0;
        
        if(o.problem){
            $.each(o.problem,function(i,v){
                o.problem_done++;
                o.problem_score+=v.score;
            });
        }
        
        if(o.video){
            $.each(o.video,function(i,v){
                o.video_watched+=v.watched_seconds;
            });
        }
    });

	//console.log(dat);
	return dat;
}

//
function getWeeklyData(student_id){
	var weeks=['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'];
	var prb=problem_attempts(student_id);
	var vid=video_views(student_id);
	var scores={};
	var dat={};
	
	for(var i=0;i<weeks.length;i++)dat[weeks[i]]={};//init structure
	
	$.each(csv_problems,function(i,o){
		if(!dat[o.section][o.subsection])dat[o.section][o.subsection]={};
		if(!dat[o.section][o.subsection]['problem'])dat[o.section][o.subsection]['problem']={};
		dat[o.section][o.subsection]['problem'][o.id]=o;
		//dat[o.section][o.subsection]['problem_done']=0;
		//dat[o.section][o.subsection]['problem_score']=0;
		//dat[o.section][o.subsection]['problem_count']=0;
	});

	$.each(csv_videos,function(i,o){
		if(!dat[o.section][o.subsection]['video'])dat[o.section][o.subsection]['video']={};
		dat[o.section][o.subsection]['video'][o.id]=o;
	});
		
	$.each(prb,function(i,o){
		dat[o.section][o.subsection]['problem'][o.problem_id].date_attempted=o.date_attempted;
		dat[o.section][o.subsection]['problem'][o.problem_id].score=o.score;
		//scores[o.problem_id]={};
	});

	$.each(vid,function(i,o){
		dat[o.section][o.subsection]['video'][o.video_id].date_viewed=o.date_viewed;
		dat[o.section][o.subsection]['video'][o.video_id].watched_seconds=o.watched_seconds;
	});

	
	$.each(dat,function(week,obj){
		$.each(obj,function(lecture,o){
			//console.log(week,lecture,o);
			//precalc problem data
			dat[week][lecture].problem_count=Object.keys(o.problem).length;
			dat[week][lecture].problem_done=Math.random()*100;
			dat[week][lecture].problem_score=Math.random()*100;
			
			//problem_done
			//problem_score
			//precalc video data
		});
	});
	

	return dat;
}