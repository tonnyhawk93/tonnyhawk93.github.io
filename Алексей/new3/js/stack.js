$(document).ready(function() {

  var imgs = [];

  var resizeImgs = function () {
    imgs.forEach(function(img) {
      var cf = 0.9;
      var $wrapper = $(img).parent().parent().parent().parent().parent().find('.format-wrapper');
      var ow = parseFloat($wrapper.width());
      var oh = parseFloat($wrapper.height());

      cf = 0.9;
      ow = $(window).width() / 4.1;
      oh = ow;

      var top = $(window).width() / 9;

      if ($(window).width() < 779) {
        ow = $(window).width() / 1.65;
        oh = ow;
        top *= 2.35;
      }

      $('.formats').css('top', top + 'px');

      if ( ! ow || ! oh) return;
      var width  = (ow * parseFloat(img.dataset.cw)) * cf;
      var height = (oh * parseFloat(img.dataset.ch)) * cf;
      $(img).css({ width: width + 'px', height: height + 'px' }).removeClass('hidden');
    });
  }

  document.querySelectorAll('.mover').forEach(function (el) {
    el.addEventListener('click', function () {
      const potentialMover = el.parentNode.parentNode.parentNode.parentNode.querySelectorAll('#' + this.parentElement.id + ' .mover')
      const activeMover = el.parentNode.parentNode.parentNode.parentNode.querySelectorAll('#' + this.parentElement.id + ' .send-back1, #' + this.parentElement.id + ' .send-back2, #' + this.parentElement.id + ' .send-back3')
      this.classList.add('send-back' + (Math.round(Math.random() * 2) + 1))
      console.log('M', activeMover.length, potentialMover.length - 1)
      if (activeMover.length === 2) activeMover.forEach(function (el) {
        el.classList.remove('send-back1', 'send-back2', 'send-back3')
      })
    })
    var img = el.querySelector('img');
    var iVal = setInterval(function() {
      var [cw, ch] = img.dataset.coef.split(' ');
      if ( ! cw || ! ch) return;
      console.log(cw, ch);
      img.dataset.cw = cw;
      img.dataset.ch = ch;
      imgs.push(img);
      clearInterval(iVal);
      resizeImgs();
    }, 100);
  })

  $(window).resize(resizeImgs);
});
