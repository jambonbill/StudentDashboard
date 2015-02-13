
<h3><i class='fa fa-bar-chart'></i> Student progression <small>version 4</small></h3>
<style>
.progressico{
	height: 20px;
	margin-bottom: 20px;
}
</style>
<?php
//student_progression table
echo "<table class='table table-condensed'>";
echo "<thead>";
echo "<th></th>";
for($i=0;$i<8;$i++){
	echo "<th>Week ".($i+1)."</th>";
}
echo "</thead>";
echo "<tbody>";
echo "<tr>";//Problems
echo "<td>";//icons
echo "<div class='progressico'>";
	echo "Prb.";
echo "</div>";

echo "<div class='progressico'>";
	echo "Vid.";
echo "</div>";

for($i=0;$i<8;$i++){
	//echo "<td>Problems</td>";
	$pct1=rand(1,99);
	$pct2=rand(1,99);
	echo "<td>";
	echo "<div class='progress xs'>";
  	echo "<div class='progress-bar progress-bar-success' role=progressbar style='width: $pct1%;'></div>";
	echo "</div>";

	echo "<div class='progress xs'>";
  	echo "<div class='progress-bar progress-bar-warning' role=progressbar style='width: $pct2%;'></div>";
	echo "</div>";

	echo "</td>";
}
echo "</tbody>";
echo "</table>";
