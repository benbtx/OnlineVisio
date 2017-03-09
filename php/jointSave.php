<?php
file_put_contents('test.json', $_POST['message']);
file_put_contents('data.json', $_POST['data']);
echo json_encode(array('result'=>'success'));//$_POST['message'];//json_encode(array('result'=>'success'));
?>