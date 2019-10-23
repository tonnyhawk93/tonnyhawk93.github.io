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
    price: 190,
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
  document.getElementById('name-field').innerText = name.trim();
}
document.getElementById('first_name').addEventListener('change', change);
document.getElementById('first_name').addEventListener('keyup', change);
document.getElementById('last_name').addEventListener('change', change);
document.getElementById('last_name').addEventListener('keyup', change);

var basePrice = plan.price;
var priceEnd = document.getElementById('price').innerText;

document.getElementById('plan-field').innerText = plan.name;

var recalcPrice = function() {
  var price = parseInt(basePrice);
  document.getElementById('price').innerText = price + priceEnd;
}
recalcPrice();

$('.to-tab-2').click(function() { $('#switch-tab-2').click() });

