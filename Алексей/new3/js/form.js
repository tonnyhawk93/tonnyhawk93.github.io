var calendarClickHandler = function(day, month, year) {
  var pad = function (num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  }
  document.getElementById('date-field').innerText = pad(day, 2) + '.' + pad(month + 1, 2) + '.' + year;
}

var plans = {
  'le-miroir': {
    name: 'Le Mirroir',
    price: 590
  },
  'le-vegas': {
    name: 'Le Vegas',
    price: 390
  },
  'le-ring': {
    name: 'Le Ring',
    price: 149,
  }
};

var hash = document.location.hash.replace('#', '');
if ( ! plans[hash]) {
  hash = 'le-ring';
  document.location.hash = hash;
}
var plan = plans[hash];

var txtFields = ['txt-1', 'txt-2', 'email', 'phone'];
txtFields.forEach(function(id){
  var change = function(e) {
    document.getElementById(id + '-field').innerText = e.target.value.trim();
  }
  document.getElementById(id).addEventListener('change', change);
  document.getElementById(id).addEventListener('keyup', change);
})

var change = function() {
  var name = document.getElementById('first_name').value.trim();
  var last_name = document.getElementById('last_name').value.trim();
  if (last_name.length) name += ' ' + last_name;
  document.getElementById('name-field').innerText = name;
}
document.getElementById('first_name').addEventListener('change', change);
document.getElementById('first_name').addEventListener('keyup', change);
document.getElementById('last_name').addEventListener('change', change);
document.getElementById('last_name').addEventListener('keyup', change);

var opts = [];
var shipPrice = parseInt(
  $($('.livraison .particuliers3-section1__left-item__body__left__a .text')[1]).html().split('<span>')[1]
);
var payShip = false;

var basePrice = plan.price;
var priceEnd = document.getElementById('price').innerText;

document.getElementById('plan-field').innerText = plan.name;

var recalcPrice = function() {
  var price = parseInt(basePrice);
  var texts = [];
  opts.forEach(function(opt){
    if (opt.enabled)
    {
      price += parseInt(opt.price);
      texts.push(opt.name.trim());
    }
  });
  if (payShip) price += shipPrice;
  document.getElementById('opts-field').innerHTML = texts.join(',<br>\n');
  document.getElementById('price').innerText = price + priceEnd;
}
recalcPrice();

var odds = [];
[].forEach.call(document.querySelectorAll('#tab-2 .particuliers3-section1__left-item__body__left__a'), function(el) {
  opts.push({
    enabled: false,
    name: $('.text', el).html().split('<span>')[0].trim(),
    price: parseInt($('.text', el).html().split('<span>')[1].trim())
  });
  odds.push(true);
  var redrawOpts = function(num) {
    if (num !== false) {
      $('.particuliers3-section1__left-item__body__right > div').hide();
      $($('.particuliers3-section1__left-item__body__right > div')[num]).show();
    }
    recalcPrice();
  }
  $(el).click(function(){
    var num = this.dataset.num - 1;
    if (odds[num]) {
      odds[num] = false;
      return;
    }
    odds[num] = true;
    opts[num].enabled = $('.checkmark', this).is(':visible');
    redrawOpts(opts[num].enabled ? num : false);
  });
});

$('.livraison .particuliers3-section1__left-item__body__left__a').click(function(){
  $('#shipping-field').text($('.text', this).html().split('<span>')[0].trim());
  payShip = $('.checkmark', $('.livraison .particuliers3-section1__left-item__body__left__a')[1]).is(':visible');
  $('.particuliers3-section1__left-item__body__right > div', $('.livraison')).hide();
  $($('.particuliers3-section1__left-item__body__right > div', $('.livraison'))[payShip * 1]).show();
  recalcPrice();
});

var st2 = false;
$('#switch-tab-2').click(function(){
  if (st2) return;
  st2 = true;
  setTimeout(function() {
    $('#tab-2 .particuliers3-section1__left-item__body__left__a').each(function () {
      if ($('.checkmark', this).is(':visible')) $(this).click();
    });
  });
});

var st3 = false;
$('#switch-tab-3').click(function(){
  if (st3) return;
  st = true;
  setTimeout(function() {
    $('.livraison  .particuliers3-section1__left-item__body__left__a').each(function () {
      if ($('.checkmark', this).is(':visible')) $(this).click();
    });
  });
});

$('.to-tab-2').click(function() { $('#switch-tab-2').click() });
$('.to-tab-3').click(function() { $('#switch-tab-3').click() });
$('.to-tab-4').click(function() { $('#switch-tab-4').click() });
