$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    rtl: false,
    loop: true,
    margin: 0,
    items: 4,
    autoplayTimeout: 100000,
    merge: true,
    StartPosition: "first_slide",
    navigationText: ["", ""],
    slideBy: 1,
    dots: false
  });
  var owl = $(".owl-carousel");
  owl.owlCarousel();
  $(".carousel_right").click(function () {
    owl.trigger("next.owl.carousel");
  });
  $(".carousel_left").click(function () {
    owl.trigger("prev.owl.carousel");
  });
});