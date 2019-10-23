<?php
@session_start();
$cfg = array();
$cfg['xmlclient'] = FALSE;
$cfg['doctypeid'] = "<!DOCTYPE html>";
$contenttype = ($cfg['doctypeid']>2 && $cfg['xmlclient']) ? 'application/xhtml+xml' : 'text/html; charset=utf-8';
@header('Content-Type: '.$contenttype);

@require_once("inc/mainfile.php");
foreach ($_POST as $key => $value){if ($key != "submit") {$$key = mysqli_real_escape_string($conn, $value);}}

// Заявка
if ($event == "order_task") {
	$result_users = mysqli_query($conn, "SELECT * FROM `users` WHERE `email` LIKE '".trim($email)."'");
	if (mysqli_num_rows($result_users) == 0) {
		$time = time();
		$password = rand(1000, 9999);
		$password_hash = password_hash($password, PASSWORD_DEFAULT, array('cost' => 13));
		mysqli_query($conn, "INSERT INTO `users`(`id`, `role`, `email`, `password`, `password_hash`, `folder`, `civility`, `first_name`, `last_name`, `address`, `city`, `zip`, `phone`, `created_at`, `last_at`) VALUES (NULL, '2', '$email', '$password', '', '', '', '$first_name', '$last_name', '', '$city', '', '$phone', '$time', '$time')") or die(mysqli_error());
		$user_id = mysqli_insert_id($conn);
	} else {
		$row_users = mysqli_fetch_assoc($result_users);
		$user_id = $row_users['id'];
		mysqli_query($conn, "UPDATE `users` SET `civility` = '', `first_name` = '$first_name', `last_name` = '$last_name', `address` = '', `city` = '$city', `zip` = '', `phone` = '$phone' WHERE `id` = ".$user_id);
	}
	mysqli_query($conn, "INSERT INTO `orders`(`id`, `user_id`, `order_type`, `box_type`, `event_date`, `type`, `message`, `start_event`, `end_event`, `green_background`, `magnet_lozenges`, `frame_selfies`, `double_impression`, `photobox_clothing`, `pack_props`, `delivery`, `themplate`, `price`, `status`) VALUES (NULL, '$user_id', '1', '$box_type', '".strtotime($event_date." 00:00:00")."', '$type', '$message', '16:00', '20:00', '$green_background', '$magnet_lozenges', '$frame_selfies', '$double_impression', '$photobox_clothing', '$pack_props', '$delivery', '', '$price', 0)");
	
	switch($box_type) {
		case 1: $box_type_str = "LE CUBE"; break;
		case 2: $box_type_str = "LE POCKET"; break;
		case 3: $box_type_str = "LE MIROIR"; break;
	}
	
	$options = "";
	if ($green_background != 0) { $options .= "Fond Vert"; }
	if ($magnet_lozenges != 0) { if($options != "") {$options .= " / ";} $options .= "Pastilles Magnet"; }
	if ($frame_selfies != 0) { if($options != "") {$options .= " / ";} $options .= "Cadre à Selfies"; }
	if ($double_impression != 0) { if($options != "") {$options .= " / ";} $options .= "Double Impression"; }
	if ($photobox_clothing != 0) { if($options != "") {$options .= " / ";} $options .= "Habillage Photobox"; }
	if ($pack_props != 0) { if($options != "") {$options .= " / ";} $options .= "Pack Props"; }

	$subject = "Nouvelle demande ".date("d-m-Y H:i", time());
	$mailheaders = "MIME-Version: 1.0\r\n";
	$mailheaders.= "Content-Type: text/html; charset=utf-8\r\n";
	$mailheaders.= "From: =?utf-8?B?".base64_encode("ShootnBox")."?= <noreply@shootnbox.fr>\r\n";
	$mailheaders.= "X-Mailer: PHP/".phpversion()."\r\n";
	$msg = '<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Mail</title>
			<style>
				@font-face {
					font-family: \'msyi\';
					src: url(http://www.shootnbox.fr/fonts/msyi.ttf);
				}
				body {
					margin: 0;
					width: 920px;
					margin: 0 auto;
					border: 10px solid #d01e59;
					font-family: \'msyi\';
					font-size: 24px;
					font-weight: 500;
				}
				.logo {
					margin-top: 20px;
					display: block;
					margin: 0 auto;
					margin-bottom: 30px;
				}
				footer {
					display: -webkit-flex;
					display: -moz-flex;
					display: -ms-flex;
					display: -o-flex;
					display: flex;

					justify-content: space-between;

					height: 150px;
					width: 100%;

					background-color: #3e3e3e;

					margin-top: 100px;
					padding: 48.5px 30px;

					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
				}
				footer .txt {
					text-align: center;
					color: #fff;
					font-weight: 900;
					font-size: 25px;
				}
				.text {
					width: 800px;
					margin: auto;
				}
				.facebook {
					width: 54px;
					height: 53px;
				}
				footer p {
					text-align: center;
					display: block;
					font-size: 55px;
					color: #fff;
				}
			</style>
		</head>
		<body>
			<img src="http://www.shootnbox.fr/img/logo.png" alt="" class="logo"style="margin-top: 20px;">
			<div class="text">
				Cher client, <br><br>

				Vous venez d’effectuer une réservation de box sur notre site internet et nous vous en remercions.<br><br>

				Pour rappel, voici le détail de votre commande :<br>
				Quoi : '.$box_type_str.'<br>
				Quand : '.$event_date.'<br>
				Où : '.$city.'<br>
				Pour quelle occasion : '.$type.'<br>
				Options souscrites : '.$options.'<br>
				<span style="color:#bb0000">TOTAL TTC : '.$price.'€</span><br><br>

				Et maintenant ? <br>
				Nos équipes prendront très prochainement contact avec vous par téléphone afin de finaliser votre réservation et ainsi établir votre contrat définitif.<br><br>

				Et ensuite ?<br>
				Un chèque de réservation de 90€ vous sera demandé. Après réception, nous vous communiquerons vos identifiants afin d’accéder à votre espace client en ligne.<br><br>

				A quoi me sert l’espace client ?<br>
				Celui-ci vous permettra de choisir votre maquette pour votre réception. Vous pourrez également la personnaliser en choisissant le texte que vous souhaitez y voir figurer.<br>
				C’est également dans votre espace client que vous retrouverez, sous 48h maximum après votre réception, l’ensemble des clichés qui auront été pris par notre borne. Vous pourrez ainsi télécharger l’ensemble des photos, ou bien les partager sur les réseaux sociaux !<br><br>


				Pour toute question n’hésitez pas à nous contacter par mail ou par téléphone :<br>
				Mqil : contact@shootnbox.fr<br>
				Tél    : 01 45 01 66 66 <br><br>

				L’equipe Shoot’n Box
			</div>
			<footer>
				<img src="http://www.shootnbox.fr/img/fa-facebook.png" alt="facebook" class="facebook">
				<p style="margin-top: 0">www.shootnbox.fr</p>
				<div class="txt">
					Central de réservation <br>01 45 01 66 66
				</div>
			</footer>
		</body>
		</html>';
	mail($email, "=?utf-8?B?".base64_encode($subject)."?=", $msg, $mailheaders);
	mail($row_settings['email'], "=?utf-8?B?".base64_encode($subject)."?=", $msg, $mailheaders);
	echo"done";
}

if ($event == "order_themplate") {
	mysqli_query($conn, "UPDATE `orders` SET `themplate` = '$themplate' WHERE `id` = ".$order_id);
	if ($themplate == 0) {
		$result_orders = mysqli_query($conn, "SELECT `price` FROM `orders` WHERE `id` = ".$order_id);
		$row_orders = mysqli_fetch_assoc($result_orders);
		mysqli_query($conn, "UPDATE `orders` SET `price` = ".($row_orders['price'] + 60)." WHERE `id` = ".$order_id);
	}
	echo"done";
}

if ($event == "get_photos") {
	echo UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path;
	$dirs_arr = scandir(UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path);
	if (count($dirs_arr) > 2) {
		require_once("ImageResize.php");
		foreach($dirs_arr as $key => $dir) {
			if ($dir != "." && $dir != ".." && strpos($dir, "thumb_") === false) {
				if (is_file(UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path."/".$dir)) {
					if (!file_exists(UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path."/thumb_".$dir)) {
						$image = new ImageResize(UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path."/".$dir);
						$image->resizeToHeight(150, true);
						//$image->crop(200, 200, ImageResize::CROPCENTER);
						$image->save(UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path."/thumb_".$dir);
					}
					echo'<div class="slide">
						<div class="img-box">
							<img src="'.UPLOAD_USERS_DIR.$_SESSION['user']['folder']."/".$path."/thumb_".$dir.'">
						</div>
						<a href="download.php?date='.$path.'&file_name='.$dir.'"><img src="img/d-1.png"></a>
						<a href="#"><img src="img/f-1.png"></a>
					</div>';
				}
			}
		}
	}
}

if ($event == "add_themplate") {
	$result_orders = mysqli_query($conn, "SELECT `id` FROM `orders` WHERE `user_id` = ".$_SESSION['user']['id']." ORDER BY `id` DESC LIMIT 1");
	if (mysqli_num_rows($result_orders) != 0) {
		$row_orders = mysqli_fetch_assoc($result_orders);
		mysqli_query($conn, "UPDATE `orders` SET `themplate` = '$themplate' WHERE `id` = ".$row_orders['id']);
		$result_users = mysqli_query($conn, "SELECT `email` FROM `users` WHERE `id` = ".$_SESSION['user']['id']);
		$row_users = mysqli_fetch_assoc($result_users);
		$template_arr = explode("<br />", $themplate);
		$subject = "Choix de votre Template ".date("d-m-Y H:i", time());
		$mailheaders = "MIME-Version: 1.0\r\n";
		$mailheaders.= "Content-Type: text/html; charset=utf-8\r\n";
		$mailheaders.= "From: =?utf-8?B?".base64_encode("ShootnBox")."?= <noreply@shootnbox.fr>\r\n";
		$mailheaders.= "X-Mailer: PHP/".phpversion()."\r\n";
		$msg = '<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Mail</title>
				<style>
					@font-face {
						font-family: \'msyi\';
						src: url(http://www.shootnbox.fr/fonts/msyi.ttf);
					}
					body {
						margin: 0;
						width: 920px;
						margin: 0 auto;
						border: 10px solid #d01e59;
						font-family: \'msyi\';
						font-size: 24px;
						font-weight: 500;
					}
					.logo {
						margin-top: 20px;
						display: block;
						margin: 0 auto;
						margin-bottom: 30px;
					}
					footer {
						display: -webkit-flex;
						display: -moz-flex;
						display: -ms-flex;
						display: -o-flex;
						display: flex;

						justify-content: space-between;

						height: 150px;
						width: 100%;

						background-color: #3e3e3e;

						margin-top: 100px;
						padding: 48.5px 30px;

						-webkit-box-sizing: border-box;
						-moz-box-sizing: border-box;
						box-sizing: border-box;
					}
					footer .txt {
						text-align: center;
						color: #fff;
						font-weight: 900;
						font-size: 25px;
					}
					.text {
						width: 800px;
						margin: auto;
					}
					.facebook {
						width: 54px;
						height: 53px;
					}
					footer p {
						text-align: center;
						display: block;
						font-size: 55px;
						color: #fff;
					}
				</style>
			</head>
			<body>
				<img src="http://www.shootnbox.fr/img/logo.png" alt="" class="logo"style="margin-top: 20px;">
				<div class="text">
					Bonjour, <br /><br />

					Vous venez d\'effectuer votre choix de maquette pour votre événement du [date de l\'événement] et nous vous en remercions.<br /><br />

					Pour rappel, voici la maquette que vous avez sélectionnée :<br />
					<img src="http://www.shootnbox.fr/'.$template_arr[2].'" alt="" style="width: 480px;" />
					<br /><br />

					Celle-ci sera personnalisée avec votre texte :<br />

					Ligne 1 : '.$template_arr[3].'<br />
					Ligne 2 : '.$template_arr[4].'<br /><br />

					Nous disposons à présent de toutes les informations nécessaires au bon déroulement de notre prestation sur votre événement. Nous sommes impatients de vous rencontrer à cette occasion !<br /><br />

					L\'équipe Shoot\'n Box vous remercie et se tient à votre disposition pour tout renseignement.
				</div>
				<footer>
					<img src="http://www.shootnbox.fr/img/fa-facebook.png" alt="facebook" class="facebook">
					<p style="margin-top: 0">www.shootnbox.fr</p>
					<div class="txt">
						Central de réservation <br>01 45 01 66 66
					</div>
				</footer>
			</body>
			</html>';
		mail($row_users['email'], "=?utf-8?B?".base64_encode($subject)."?=", $msg, $mailheaders);
		mail($row_settings['email'], "=?utf-8?B?".base64_encode($subject)."?=", $msg, $mailheaders);
	}
	echo"done";
}

@mysqli_close();
?>