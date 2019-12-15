<?php
@header('Content-Type: application/json; charset=utf-8');

@require_once("inc/mainfile.php");
foreach ($_POST as $key => $value){$$key = mysqli_real_escape_string($conn, $value);}
foreach ($_GET as $key => $value){$$key = mysqli_real_escape_string($conn, $value);}

if ($event == "get_last_names") {
  require 'Library/NCLNameCaseRu.php';
  $case = new NCLNameCaseRu();

	$result_last_names = mysqli_query($conn, "SELECT * FROM `last_names` ORDER BY RAND() LIMIT 2");
  $last_names = array();
  $i = 0;
  while($row_last_names = mysqli_fetch_assoc($result_last_names)) {
     if ($i == 0) {
        $to = $row_last_names['last_name'];
        $array = $case->q($to);
        $to_right = $array[2];
     } else {
        $from = $row_last_names['last_name'];
        $array = $case->q($from);
        $from_right = $array[1];
     }
     $i++;
  }
	$result = array('to' => $to, 'to_initials' => initials(), 'to_right' => mb_strtolower($to_right), 'from' => $from, 'from_initials' => initials(), 'from_right' => mb_strtolower($from_right));
	echo json_encode($result);
}

@mysqli_close();

function initials() {
  $initials_str = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ";
  $rnd = mt_rand(0, mb_strlen($initials_str) - 1);
  $rnd2 = mt_rand(0, mb_strlen($initials_str) - 1);
  return mb_substr($initials_str, $rnd, 1).".".mb_substr($initials_str, $rnd2, 1).". ";
}
?>