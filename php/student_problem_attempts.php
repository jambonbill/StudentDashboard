<?php
//print_r(problem_attempts());
// Problem attempts and main student progression

echo "<h2>Problem attempts</h2>";

$sql="SELECT * FROM problems WHERE 1 ORDER BY section, subsection;";
$q=$db->query($sql) or die("error : $sql\n");
$problems=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$problems[$r['section']][$r['subsection']][]=$r['id'];
}

//echo "<pre>";print_r($problems);exit;
$pac=problem_attempt_count();
//print_r($pac);exit;


$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id;";
$q=$db->query($sql) or die("error : $sql\n");
//echo "<pre>$sql</pre>";
$pas=[];
while($r=$q->fetch(PDO::FETCH_ASSOC)){
	$pas[$r['section']][$r['subsection']][]=$r;
}

echo "<table class='table table-condensed table-striped'>";
echo "<thead>";
echo "<th>Section</th>";
echo "<th>Prb.</th>";
echo "<th title='Class progression'>Class</th>";
echo "<th title='Student progression'>Student</th>";
echo "</thead>";
foreach($problems as $section=>$data)
{
	foreach($data as $subsection=>$dat){
		if(@count($pas[$section][$subsection])){
			echo "<tr>";
		} else {
			echo "<tr class='text-muted'>";//no student data
		}
		
		echo "<td>$section::$subsection";
		echo "<td>".count($dat);//number of problems
		echo "<td>";//avg problems attemped by the class
		echo "<td>".@count($pas[$section][$subsection]) . '/' . count($dat);
	}
}
echo "</table>";
echo "<i class='text-muted'>16 problems</i>";

/*
foreach($pas as $section=>$dat){
	
	if (count($dat)) {

		echo "<table class='table table-condensed table-striped'>";
		echo "<thead>";
		//echo "<th>$section</th>";
		echo "<th>subsection</th>";
		echo "<th>problem_id</th>";
		echo "<th>date_attempted</th>";
		echo "<th>max_points</th>";
		echo "<th>score</th>";
		echo "</thead>";
		
		$score=0;
		foreach($dat as $r){
			//print_r($r);
			echo "<tr>";
			//echo "<td>".$r['section'];
			echo "<td>$section :: ".$r['subsection'];
			echo "<td><a href=../problem.php?".$r['problem_id'].">".$r['problem_id']."</a>";
			echo "<td>".$r['date_attempted'];
			echo "<td>".$r['max_points'];
			echo "<td>".$r['score'];
			$score+=$r['score'];
		}
		
		echo "<tfoot>";
		echo "<tr>";
		echo "<td>";
		echo "<td>";
		echo "<td style='text-align:right'><b>Total :</b>";
		echo "<td>".count($dat);
		echo "<td>".$score;
		echo "</tfoot>";

		echo "</table>";

	} else {
		echo "<h4>No problem attemps for $section</h4>";
	}
}
*/