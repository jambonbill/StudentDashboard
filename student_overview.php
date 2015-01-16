<?php

echo "<table class='table table-striped table-condensed'>";
echo "<thead>";
echo "<th><i class='fa fa-info-circle'></i> Student stats</th>";
echo "<th>Class (avg)</th>";
echo "<th>Student</th>";
echo "</thead>";

echo "<tbody>";

$label_type='label-default';
if($day_student>$day_class)$label_type='label-success';
if($day_student<$day_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Days working";
echo "<td><span class='label label-default'>$day_class days</span>";
echo "<td><span class='label $label_type'>$day_student days</span>";


$label_type='label-default';
if($total_student>$total_class)$label_type='label-success';
if($total_student<$total_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Total work time";
echo "<td><span class='label label-default'>".$total_class." minutes</span>";// class
echo "<td><span class='label $label_type'>$totaltime minutes</span>";// student



$label_type='label-default';
if($avg_student>$avg_class)$label_type='label-success';
else $label_type='label-danger';

echo "<tr>";
echo "<td>Avg work time per day";
echo "<td><span class='label label-default'>" . $avg_class . " minutes</span>";// Class
echo "<td><span class='label $label_type'>" . $avg_student . " minutes</span>";// Student




$label_type='label-default';
if($problem_student>$problem_class)$label_type='label-success';
if($problem_student<$problem_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem attempts";
echo "<td><span class='label label-default'>" . $problem_class . "</span> <i class=text-muted>".$problem_class_pct."%</i>";// Class
echo "<td><span class='label $label_type'>" . $problem_student . "</span> <i class=text-muted>".$problem_student_pct."%</i>";// Student





$label_type='label-default';
if($score_student>$score_class)$label_type='label-success';
if($score_student<$score_class)$label_type='label-danger';

echo "<tr>";
echo "<td>Problem score";
echo "<td><span class='label label-default'>" . $score_class . " %</span>";// Class
echo "<td><span class='label $label_type'>" . $score_student . " %</span>";// Student




$label_type='label-default';
if($video_student>$video_class)$label_type='label-success';
if($video_student<$video_class)$label_type='label-danger';


echo "<tr>";
echo "<td>Video watched";
echo "<td><span class='label label-default'>".$video_class."</span> <i class=text-muted>".round($video_class/141*100)."%</i>";// Class
echo "<td><span class='label $label_type'>".$video_student."</span> <i class=text-muted>".round($video_student/141*100)."%</i>";// Student


echo "</tbody>";
echo "</table>";