<?php

// dashboard functions

/**
 * Return list of students
 * @return [type] [description]
 */
function students()
{
	global $db;
}



/**
 * Return the total number of minutes spent by ONE student
 * @param  integer $student_id [description]
 * @return [type]              [description]
 */
function student_minutes($student_id=0)
{
	global $db;
	$sql="SELECT SUM(minutes_on_site) as sum FROM minutes_per_day WHERE student_id=$student_id;";
	$q=$db->query($sql) or die("error : $sql\n");
	$r=$q->fetch(PDO::FETCH_ASSOC);
	return $r['sum'];
}


function student_total_work_time(){
	global $db;
	$sql="SELECT student_id, SUM(minutes_on_site) as totaltime FROM minutes_per_day WHERE 1 GROUP BY student_id;";
	$q=$db->query($sql) or die("error:$sql");
	$dat=[];
	while($r=$q->fetch())
	{
		$dat[$r['student_id']]=$r['totaltime'];
	}
	return $dat;
}

function student_total_scores(){
	
	global $db;
	$sql="SELECT student_id, SUM(score) as totalscore FROM problem_attempts WHERE 1 GROUP BY student_id;";
	$q=$db->query($sql) or die("error:$sql");
	$dat=[];
	while($r=$q->fetch())
	{
		$dat[$r['student_id']]=$r['totalscore'];
	}
	return $dat;
}



/**
 * Return a student score average in %
 * @return [type] [description]
 */
function student_score_average()
{
	
	global $db;

	$sql="SELECT student_id, AVG(score) as score_avg FROM problem_attempts WHERE 1 GROUP BY student_id;";
	$q=$db->query($sql) or die("error:$sql");
	$dat=[];
	while($r=$q->fetch())
	{
		$dat[$r['student_id']]=round($r['score_avg']*100);
	}
	return $dat;
}

/**
 * Return the whole thing
 * @return [type] [description]
 */
/*
function minutes_per_day($student_id=0)
{
	global $db;
	
	$student_id*=1;

	if ($student_id > 0) {
		$sql="SELECT * FROM minutes_per_day WHERE student_id=$student_id;";
	} else {
		$sql="SELECT * FROM minutes_per_day WHERE 1;";	
	}

	
	$q=$db->query($sql) or die("error : $sql\n");
	
	$dat=[];
	while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
		$dat[]=$r;
	}
	return $dat;
}
*/


function minutes_per_day()
{
	
	global $db;

	$sql="SELECT * FROM minutes_per_day WHERE 1;";
	$q=$db->query($sql) or die("error : $sql\n");
	
	$dat=[];
	while ($r=$q->fetch(PDO::FETCH_ASSOC)) {
		$dat[$r['student_id']][$r['date']]=$r['minutes_on_site'];
	}
	return $dat;
}


function minutes_average(){
	global $db;	
	$sql="SELECT AVG(minutes_on_site) AS avg FROM `minutes_per_day` WHERE 1;";
	$q=$db->query($sql) or die("error : $sql\n");
	$r=$q->fetch();
	return round($r['avg']);
}


/**
 * Return video record
 * @param  string $video_id [description]
 * @return [type]           [description]
 */
function video($video_id='')
{
	global $db;
	
	$sql="SELECT * FROM videos WHERE id LIKE '$video_id' LIMIT 1;";
	$q=$db->query($sql);
	return $q->fetch(PDO::FETCH_ASSOC);
}


/**
 * [videos description]
 * @return [type] [description]
 */
function videos(){
	global $db;
	$sql="SELECT * FROM videos WHERE 1 ORDER BY section, id;";
	$q=$db->query($sql) or die("Error $sql");
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[]=$r;
	}
	return $dat;
}

function video_access_count()
{
	global $db;
	$sql="SELECT video_id, COUNT(*) as count FROM `video_views` WHERE 1 GROUP BY video_id;";
	$q=$db->query($sql) or die("errro:$sql");
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[$r['video_id']]=$r['count'];
	}
	return $dat;
}


function video_views(){
	global $db;
	$sql="SELECT * FROM video_views WHERE 1;";
	$q=$db->query($sql) or die("error : $sql\n");

	$vv=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$vv[$r['student_id']][]=$r;
	}
	return $vv;
}

/**
 * [problems description]
 * @return [type] [description]
 */
function problems(){
	global $db;
	$sql="SELECT * FROM problems WHERE 1 ORDER BY section, id;";
	$q=$db->query($sql);
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[]=$r;
	}
	return $dat;
}


/**
 * Return problem record
 * @param  string $video_id [description]
 * @return [type]           [description]
 */
function problem($problem_id='')
{
	global $db;

	$sql="SELECT * FROM problems WHERE id LIKE '$problem_id' LIMIT 1;";
	$q=$db->query($sql);
	return $q->fetch(PDO::FETCH_ASSOC);
}

function problem_score_average()
{
	global $db;

	$sql="SELECT AVG(score)*100 as score_avg FROM `problem_attempts` WHERE 1";
	$q = $db->query($sql);

	return round(61.8504);
}


/**
 * [problem_attempt_count description]
 * @return [type] [description]
 */
function problem_attempt_count()
{
	global $db;
	$sql="SELECT problem_id, COUNT(*) as count FROM `problem_attempts` WHERE 1 GROUP BY problem_id;";
	$q=$db->query($sql) or die("errro:$sql");
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[$r['problem_id']]=$r['count'];
	}
	return $dat;
}


/**
 * Reutn the number of problem attemps per user
 * @return [type] [description]
 */
function problem_attempts()
{
	global $db;
	$sql="SELECT student_id, COUNT(problem_id) as count FROM `problem_attempts` WHERE 1 GROUP BY student_id;";
	$q=$db->query($sql) or die("errro:$sql");
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[$r['student_id']]=$r['count'];
	}
	return $dat;
}


function problem_success_count()
{	
	global $db;
	
	$sql="SELECT problem_id, SUM(score) FROM problem_attempts WHERE 1 GROUP BY problem_id;";
	$q=$db->query($sql) or die("error : $sql\n");
	
	$dat=[];
	while($r=$q->fetch(PDO::FETCH_ASSOC)){
		$dat[$r['problem_id']]=$r['SUM(score)'];
	}
	return $dat;
}




