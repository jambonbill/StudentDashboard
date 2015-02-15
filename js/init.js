$(function(){
	$('#btn0').click(function(){updateStudent(group_0[Math.round(Math.random()*group_0.length-1)]);});
	$('#btn50').click(function(){updateStudent(group_50[Math.round(Math.random()*group_50.length-1)]);});
	$('#btn100').click(function(){updateStudent(group_100[Math.round(Math.random()*group_100.length-1)]);});
	$('#btnRand').click(function(){updateStudent(Math.round(Math.random()*500))});
});

function updateStudent(student_id){
	if(!student_id)student_id=0;
	$('#title').html('Student #'+student_id);
	$('#student_id').val(student_id);
	var dat=getStudentData(student_id);
	computeStats(dat);//columns and arcs
	updateConstancy(dat);
	updateVidnprobs(dat);
	updateClass1(csv_class,$('#selector1').val(),student_id);
	updateClass2(csv_class,$('#selector2').val(),student_id);
	updateProgressDetails(getWeeklyData(student_id));
}