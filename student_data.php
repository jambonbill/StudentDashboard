<?php
// student data

// count records (4411)
$sql="SELECT COUNT(*) as count FROM minutes_per_day;";
$q=$db->query($sql) or die("error : $sql\n");
$r=$q->fetch(PDO::FETCH_ASSOC);
$minutes_per_day_count=$r['count'];//4411
//die("<li>".$minutes_per_day_count);
//print_r(minutes_per_day($student_id));exit;

$totaltime=array_sum(minutes_per_day()[$student_id]);

// days working
$day_class = round($minutes_per_day_count/500);
$day_student=count(minutes_per_day()["$student_id"]);

// Total work time (minutes working)
$total_class=round(array_sum(student_total_work_time())/500);
$total_student=$totaltime;

// Average work time per day (in minutes)
$avg_class=minutes_average();
$avg_student=round($totaltime/count(minutes_per_day()[$student_id]));

// Problem attemps
$problem_class=round(array_sum(problem_attempts())/500);
$problem_class_pct=round($problem_class/108*100);// %
$problem_student=@(problem_attempts()["$student_id"]*1);
$problem_student_pct=round($problem_student/108*100);// %

// Problems score
$score_class=problem_score_average();
$score_student=@student_score_average()[$student_id]*1;

// video watched
$video_class=round(array_sum(video_access_count())/500);
$video_student=@count(video_views()["$student_id"])*1;

//$overall_progress=rand(0,100);//fake number
$overall_progress=$problem_student_pct;//
