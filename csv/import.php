<?php
// Import challenge csv data
die("nope");
echo "<pre>";

try {
    $dsn = "mysql:host=127.0.0.1;dbname=dashboard-challenge";
    //echo "dsn=$dsn";
    $db = new PDO($dsn, 'cron', 'robotix');
} catch (PDOException $e) {
    echo "<li>" . $e->getMessage();
}


$TABLES=['minutes_per_day','problems','problem_attempts','videos','video_views'];

foreach($TABLES as $k=>$TABLE){
	$sql="TRUNCATE TABLE `dashboard-challenge`.`$TABLE`;";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true));
	echo "$sql\n";
}


// minutes per day

$f=fopen("minutes_per_day.csv","r");
while ($data=fgetcsv($f)) {
	//print_r($data);
	$sql = "INSERT INTO `dashboard-challenge`.`minutes_per_day` VALUES (".$db->quote($data[0]).",".$db->quote($data[1]).",".$db->quote($data[2]).");";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true)."<hr />$sql");
	echo "$sql\n";
}
fclose($f);


// problem attempts

$f=fopen("problem_attempts.csv","r");
while ($data=fgetcsv($f)) {
	$sql = "INSERT INTO `dashboard-challenge`.`problem_attempts` VALUES (".$db->quote($data[0]).",".$db->quote($data[1]).",".$db->quote($data[2]).",".$db->quote($data[3]).",".$db->quote($data[4]).",".$db->quote($data[5]).",".$db->quote($data[6]).");";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true)."<hr />$sql");
	echo "$sql\n";
}
fclose($f);


// problems

$f=fopen("problems.csv","r");
while ($data=fgetcsv($f)) {
	if(count($data)<3)continue;
	$sql = "INSERT INTO `dashboard-challenge`.`problems` VALUES (".$db->quote($data[0]).",".$db->quote($data[1]).",".$db->quote($data[2]).",".$db->quote($data[3]).");";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true)."<hr />$sql");
	echo "$sql\n";
}
fclose($f);


// video_views

$f=fopen("video_views.csv","r");
while ($data=fgetcsv($f)) {
	if(count($data)<3)continue;
	$sql = "INSERT INTO `dashboard-challenge`.`video_views` VALUES (".$db->quote($data[0]).",".$db->quote($data[1]).",".$db->quote($data[2]).",".$db->quote($data[3]).",".$db->quote($data[4]).",".$db->quote($data[5]).",".$db->quote($data[6]).");";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true)."<hr />$sql");
	echo "$sql\n";
}
fclose($f);


// videos
$f=fopen("videos.csv","r");
while ($data=fgetcsv($f)) {
	if(count($data)<3)continue;
	$sql = "INSERT INTO `dashboard-challenge`.`videos` VALUES (".$db->quote($data[0]).",".$db->quote($data[1]).",".$db->quote($data[2]).",".$db->quote($data[3]).");";
	$q=$db->query("$sql") or die(print_r($db->errorInfo(), true)."<hr />$sql");
	echo "$sql\n";
}
fclose($f);



die("ok");
