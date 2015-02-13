<?php
//db connection
try {
    $dsn = "mysql:host=127.0.0.1;dbname=dashboard-challenge";
    //echo "dsn=$dsn";
    $db = new PDO($dsn, 'cron', 'robotix');
} catch (PDOException $e) {
    echo "<li>" . $e->getMessage();
    exit;
}
