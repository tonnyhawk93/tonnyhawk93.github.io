jQuery(document).ready(function(){
	$('.form-reservation').on('submit', function(event){
		event.preventDefault();
		
		if ($('.last_name').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre nom / prénom!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.email').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre adresse e-mail!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if (!checkemail($('.email').val())) {
			swal({
				title: 'Erreur!',
				text: 'S\'il vous plaît entrer un e-mail valide!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.phone').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre telephone!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		
		if ($('.city').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez ville de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.type').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez type de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.event_date').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez date de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		$.ajax({
			type: 'POST',
			url: 'ph2018.php',
			data: {
				event: 'order_task',
				box_type: 0,
				first_name: '',
				last_name: $('.last_name').val(),
				email: $('.email').val(),
				phone: $('.phone').val(),
				message: $('.message').val(),
				type: $('.type').val(),
				event_date: $('.event_date').val(),
				city: $('.city').val(),
				price: 0,
				green_background: 0,
				magnet_lozenges: 0,
				frame_selfies: 0,
				double_impression: 0,
				photobox_clothing: 0,
				pack_props: 0,
				delivery: 0
			},
			cache: false,
			success: function(responce){
				if (responce == 'done') {
					$('input, textarea').val('');
					swal({
						title: 'Commande envoyée avec succès!',
						text: 'Dans un proche avenir, nous vous contacterons.',
						type: 'success',
						confirmButtonColor: '#348fe2',
						confirmButtonText: 'ОК',
						showCloseButton: true,
						closeOnConfirm: true
					}).then(function() {
						window.location.href = './';
					});
				} else {
					showError(responce);
				}
			}
		});
	});

	$('.particuliers-reservation').click(function(event){
		event.preventDefault();
		
		if ($('#date-field').text().trim() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez date de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.type').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez type de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.city').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez ville de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if (typeof $('.delivery:checked').val() == 'undefined') {
			swal({
				title: 'Erreur!',
				text: 'Сhoisissez la ma livraison!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('#last_name').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre nom!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		
		if ($('#first_name').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre prénom!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		

		if ($('#email').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre adresse e-mail!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if (!checkemail($('#email').val())) {
			swal({
				title: 'Erreur!',
				text: 'S\'il vous plaît entrer un e-mail valide!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('#phone').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre telephone!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		
		$.ajax({
			type: 'POST',
			url: 'ph2018.php',
			data: {
				event: 'order_task',
				box_type: $('#plan-field').val(),
				first_name: $('#first_name').val(),
				last_name: $('#last_name').val(),
				email: $('#email').val(),
				phone: $('#phone').val(),
				message: $('#textarea').val(),
				type: $('.type').val(),
				event_date: $('#date-field').text(),
				city: $('.city').val(),
				price: parseInt($('#price').text()),
				green_background: $('.green_background').is(':checked') ? 1 : 0,
				magnet_lozenges: $('.magnet_lozenges').is(':checked') ? 1 : 0,
				frame_selfies: $('.frame_selfies').is(':checked') ? 1 : 0,
				double_impression: $('.double_impression').is(':checked') ? 1 : 0,
				photobox_clothing: $('.photobox_clothing').is(':checked') ? 1 : 0,
				pack_props: $('.pack_props').is(':checked') ? 1 : 0,
				delivery: $('.delivery:checked').val(),
			},
			cache: false,
			success: function(responce){
				if (responce == 'done') {
					$('input, textarea').val('');
					window.location.href = 'particuliers4.html';
				} else {
					showError(responce);
				}
			}
		});
	});

	$('.entreprises-reservation').click(function(event){
		event.preventDefault();

		if ($('#date-field').text().trim() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez date de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.type').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez type de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('.city').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez ville de l’evenement!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}


		if ($('#last_name').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre nom!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		
		if ($('#first_name').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre prénom!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		

		if ($('#email').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre adresse e-mail!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if (!checkemail($('#email').val())) {
			swal({
				title: 'Erreur!',
				text: 'S\'il vous plaît entrer un e-mail valide!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}

		if ($('#phone').val() == '') {
			swal({
				title: 'Erreur!',
				text: 'Entrez votre telephone!',
				type: 'error',
				confirmButtonColor: '#53a3d8',
				confirmButtonText: 'Fermer'
			});
			return false;
		}
		
		$.ajax({
			type: 'POST',
			url: 'ph2018.php',
			data: {
				event: 'order_task',
				box_type: $('#plan-field').val(),
				first_name: $('#first_name').val(),
				last_name: $('#last_name').val(),
				email: $('#email').val(),
				phone: $('#phone').val(),
				message: $('#textarea').val(),
				type: $('.type').val(),
				event_date: $('#date-field').text(),
				city: $('.city').val(),
				price: parseInt($('#price').text()),
				green_background: 0,
				magnet_lozenges: 0,
				frame_selfies: 0,
				double_impression: 0,
				photobox_clothing: 0,
				pack_props: 0,
				delivery: 0
			},
			cache: false,
			success: function(responce){
				if (responce == 'done') {
					$('input, textarea').val('');
					window.location.href = 'entreprises4.html';
				} else {
					showError(responce);
				}
			}
		});
	});
});
function checkemail(value){
	reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	if (value!='' && !value.match(reg)) {return false;} else {return true;}
}

function setCookie(name, value, expires, path, domain, secure) {
	document.cookie = name + '=' + escape(value) +
		((expires) ? '; expires=' + expires : '') +
		((path) ? '; path=' + path : '') +
		((domain) ? '; domain=' + domain : '') +
		((secure) ? '; secure' : '');
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function showError(errorText) {
	swal({
		title: 'Erreur!',
		text: errorText,
		type: 'error',
		confirmButtonColor: '#348fe2',
		confirmButtonText: 'Fermer'
	});
}
