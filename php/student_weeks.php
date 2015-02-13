<?php
// student overview per week


// select all problems //
$sql="SELECT * FROM problems WHERE 1 ORDER BY section, subsection;";
$q=$db->query($sql) or die("Error:$sql");
$problems=[];
while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
	//print_r($r);
	$problems[$r['section']][$r['subsection']][]=$r;
}

// all student problem attempts
$sql="SELECT * FROM problem_attempts WHERE student_id=$student_id;";
$q=$db->query($sql) or die("Error:$sql");

$problem_attempts=[];
while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
	//print_r($r);
	$problem_attempts[$r['section']][$r['subsection']][]=$r;
}


// select all videos //
$sql="SELECT * FROM videos WHERE 1 ORDER BY section, subsection;";
$q=$db->query($sql) or die("Error:$sql");
$videos=[];
while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
	//print_r($r);
	$videos[$r['section']][$r['subsection']][]=$r;
}

// all student video attempts
$sql="SELECT * FROM video_views WHERE student_id=$student_id;";
$q=$db->query($sql) or die("Error:$sql");

$video_attempts=[];
while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
	//print_r($r);
	$video_attempts[$r['section']][$r['subsection']][]=$r;
}



//echo "<pre>";print_r($problem_attempts);

foreach($problems as $section=>$data){
	
	echo "<div class=row>";
	echo "<h4><i class='fa fa-calendar'></i> $section</h4>";// Week 
	
	foreach($data as $subsection=>$dat){

		/*
		$pas=@$problem_attempts[$section][$subsection];

		if(!count($pas) && !@count($video_attempts[$section][$subsection])) {
			//echo "<li>$subsection -> No data";
			continue;
		}
		*/
	
		//echo "<li>$subsection -> " .count($pas).'/'.count($dat) . " problem(s); - ";
		//echo @count($video_attempts[$section][$subsection]) . "/" . @count($videos[$section][$subsection])." videos";
		
		//print_r($pas);
		//echo "<li>pas".count($pas);
		//echo "<pre>";print_r($problems["Week $i"]);echo "</pre>";
		//$sql="SELECT * FROM problems WHERE ";
		
		
		$dat=$problems[$section][$subsection];
		$pas=@$problem_attempts[$section][$subsection];
		$pct_probs=round(count($pas)/count($dat)*100);

		$dat=$videos[$section][$subsection];
		$vvs=@$video_attempts[$section][$subsection];
		$pct_video=round(count($vvs)/count($dat)*100);

		if ($pct_probs || $pct_video) {
			echo "<div class='col-xs-6'>";
			// progress bar
			echo "$subsection";// lecture x
			//echo "$subsection -> " .count($pas).'/'.count($dat) . " problems;";
			echo "<div class='progress xs' title='Problems : $pct_probs'>";
				echo "<div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow=0 aria-valuemin=0 aria-valuemax=100 style='width: $pct_probs%;'></div>";
			echo "</div>";

			echo "<div class='progress xs' title='Videos : $pct_video'>";
				echo "<div class='progress-bar progress-bar-default' role='progressbar' aria-valuenow=0 aria-valuemin=0 aria-valuemax=100 style='width: $pct_video%;'></div>";
			echo "</div>";

			echo  "</div>";
		}

	}
	
	echo "</div>";

}