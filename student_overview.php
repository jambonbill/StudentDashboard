<?php

// student overview
/*
$sql="SELECT student_id, MIN(minutes_on_site), MAX(minutes_on_site), AVG(minutes_on_site) FROM minutes_per_day WHERE student_id=$student_id;";
$q=$db->query($sql) or die("error : $sql\n");
$r=$q->fetch(PDO::FETCH_ASSOC);
echo "<pre>";print_r($r);echo "</pre>";//exit;
*/

// count records 
$sql="SELECT COUNT(*) as count FROM minutes_per_day;";
$q=$db->query($sql) or die("error : $sql\n");
$r=$q->fetch(PDO::FETCH_ASSOC);
$minutes_per_day_count=$r['count'];

//print_r(minutes_per_day($student_id));exit;

$totaltime=array_sum(minutes_per_day()[$student_id]);
echo "<table class='table table-striped table-condensed'>";
echo "<thead>";
echo "<th><i class='fa fa-info-circle'></i> Student stats</th>";
echo "<th>Class (avg)</th>";
echo "<th>Student</th>";
echo "</thead>";

echo "<tbody>";
// days working
$day_class = round($minutes_per_day_count/500);
$day_student=count(minutes_per_day()["$student_id"]);
$label_type='label-default';
if($day_student>$day_class)$label_type='label-success';
if($day_student<$day_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Days working";
echo "<td><span class='label label-default'>$day_class days</span>";
echo "<td><span class='label $label_type'>$day_student days</span>";

// Total work time (minutes working)

$total_class=round(array_sum(student_total_work_time())/500);
$total_student=$totaltime;
$label_type='label-default';
if($total_student>$total_class)$label_type='label-success';
if($total_student<$total_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Total work time";
echo "<td><span class='label label-default'>".$total_class." minutes</span>";// class
echo "<td><span class='label $label_type'>$totaltime minutes</span>";// student

// Average work time per day (in minutes)

$avg_class=minutes_average();
$avg_student=round($totaltime/count(minutes_per_day()[$student_id]));
$label_type='label-default';
if($avg_student>$avg_class)$label_type='label-success';
else $label_type='label-danger';

echo "<tr>";
echo "<td>Avg work time per day";
echo "<td><span class='label label-default'>" . $avg_class . " minutes</span>";// Class
echo "<td><span class='label $label_type'>" . $avg_student . " minutes</span>";// Student


// Problem attemps
$problem_class=round(array_sum(problem_attempts())/500);
$problem_student=@(problem_attempts()["$student_id"]*1);
$label_type='label-default';
if($problem_student>$problem_class)$label_type='label-success';
if($problem_student<$problem_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem attempts";
echo "<td><span class='label label-default'>" . $problem_class . "</span> <i class=text-muted>".round($problem_class/108*100)."%</i>";// Class
echo "<td><span class='label $label_type'>" . $problem_student . "</span> <i class=text-muted>".round($problem_student/108*100)."%</i>";// Student



// Problems score
$score_class=problem_score_average();
$score_student=@student_score_average()[$student_id]*1;

$label_type='label-default';
if($score_student>$score_class)$label_type='label-success';
if($score_student<$score_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem score";
echo "<td><span class='label label-default'>" . $score_class . " %</span>";// Class
echo "<td><span class='label $label_type'>" . $score_student . " %</span>";// Student





$video_class=round(array_sum(video_access_count())/500);
$video_student=@count(video_views()["$student_id"])*1;
$label_type='label-default';
if($video_student>$video_class)$label_type='label-success';
if($video_student<$video_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Video watched";
echo "<td><span class='label label-default'>".$video_class."</span>";// Class
echo "<td><span class='label $label_type'>".$video_student."</span>";// Student


echo "</tbody>";
echo "</table>";