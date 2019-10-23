var events = [
  {'Date': new Date(2018, 09, 25), 'Title': 'Грандиозная акция на шаблоны'},
  {'Date': new Date(2018, 10, 18), 'Title': 'Раздача промокодов на покупку шаблонов'},
  {'Date': new Date(2016, 12, 27), 'Title': 'День рождение администратора сайта'},
];
var settings = {};
var element = document.getElementById('caleandar');
caleandar(element, events, settings);



// Табы

const tabLinks = document.querySelectorAll(".particuliers3-section1__left-item__head-title span");
const tabPanels = document.querySelectorAll(".particuliers3-section1__left-item__body");

for (let el of tabLinks) {
  el.addEventListener("click", e => {
  e.preventDefault();

  document.querySelector(".particuliers3-section1__left-item__head-title.active").classList.remove("active");
  document.querySelector(".particuliers3-section1__left-item__body.active").classList.remove("active");

  const parentListItem = el.parentElement;
  parentListItem.classList.add("active");
  const index = [...parentListItem.parentElement.children].indexOf(parentListItem);

  const panel = [...tabPanels].filter(el => el.getAttribute("data-index") == index);
  panel[0].classList.add("active");
  });
}