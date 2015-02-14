<?php
//javascript.php

//read all the javascript files, and return one big javascript blob :)
$js=[];
$js[]='js/student_progress_overview.js';
$js[]='js/student_progress_detail.js';
$js[]='js/student_constancy.js';
$js[]='js/student_vidnprobs.js';
$js[]='js/student_class.js';
$js[]='js/tooltip.js';
$js[]='js/csvdata.js';
$js[]='js/init.js';

$script=[];
foreach($js as $file){
	$f=file($file);
	foreach($f as $line){
		$line=trim($line);
		if(preg_match("/^\/\//",$line))continue;
		if($line)$script[]=$line;
	}
}

//echo implode("\n",$script);

$f=fopen("pack.js","w+");
fwrite($f,implode("\n",$script));
fclose($f);

echo implode("\n",$script);
