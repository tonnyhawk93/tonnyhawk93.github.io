window.addEventListener('DOMContentLoaded', () => {
    let team1Count = document.querySelector(".carousel__items_first").childNodes.length;

    function activeMark(littlePhoto, bigPhoto = undefined) {
        if (bigPhoto != undefined) {
            var big = document.querySelector(`.${bigPhoto}`)
        }
        let little = document.querySelectorAll(`.${littlePhoto}`);
        little.forEach((item) => {
            item.addEventListener('click', (e) => {
                little.forEach((item) => {
                    if (item.classList.contains(`${littlePhoto}_active`))
                        item.classList.remove(`${littlePhoto}_active`)
                });
                item.classList.add(`${littlePhoto}_active`);
                if (bigPhoto != undefined) {
                    big.setAttribute('src', item.getAttribute('src'))
                }
            })
        })
    }
    function isScreenWidthM(num) {
        let answer;
        document.documentElement.clientWidth<num ? answer = true : answer = false;
        return answer;
    }
    function isScreenWidthB(num) {
        let answer;
        document.documentElement.clientWidth>num ? answer = true : answer = false;
        return answer;
    }
    var slider = tns({
        container: '.carousel__items',
        items: 3,
        preventScrollOnTouch: 'auto',
        onInit: moveCentral,
        loop: false,
        slideBy: 1,
        center: true,
        autoWidth: true,
        autoHeight: true,
        gutter: 30,
        nav: false,
        controlsContainer: '.carousel__controls'
    });

    slider.events.on('indexChanged', moveCentral);

    var team1 = tns({
        container: '.carousel__items_first',
        items: 1,
        slideBy: 1,
        controlsContainer: '.carousel__controls_first',
        nav: false,
        loop: false,
        onInit: initTeamFirstCounter
    });

    team1.events.on('indexChanged', initTeamFirstCounter);

    function initTeamFirstCounter(obj) {
        let elem = document.getElementById("team__first_counter");
        elem.innerText = `${obj.index + 1}/${obj.slideCount}`;
    }

    var team2 = tns({
        container: '.carousel__items_second',
        items: 1,
        slideBy: 1,
        nav: false,
        loop: false,
        onInit: initTeamTwoCounter,
        controlsContainer: '.carousel__controls_second'
    });

    team2.events.on('indexChanged', initTeamTwoCounter);

    function initTeamTwoCounter(obj) {
        let elem = document.getElementById("team__second_counter");
        elem.innerText = `${obj.index + 1}/${obj.slideCount}`;
    }

    var judjes = tns({
        container: '.judges__carousel_items',
        items: 1,
        slideBy: 1,
        nav: true,
        navContainer: '.judges__list',
        touch: false,
        controls: false,
        autoHeight: true
    });

    let judgesActive1 = tns({
        container: '#judges_riters',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive2 = tns({
        container: '#judges_trikers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive3 = tns({
        container: '#judges_trasers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive4 = tns({
        container: '#judges_braykers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive5 = tns({
        container: '#judges_workauters',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive6 = tns({
        container: '#judges_friraners',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive7 = tns({
        container: '#judges_mediameikers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive8 = tns({
        container: '#judges_socialworkers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive9 = tns({
        container: '#judges_hiphopdansers',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive10 = tns({
        container: '#j',
        mode: "gallery",
        nav: false,
        controls: false
    });
    let judgesActive11 = tns({
        container: '#jj',
        mode: "gallery",
        nav: false,
        controls: false
    });
    judgesActive1.destroy();
            judgesActive2.destroy();
            judgesActive3.destroy();
            judgesActive4.destroy();
            judgesActive5.destroy();
            judgesActive6.destroy();
            judgesActive7.destroy();
            judgesActive8.destroy();
            judgesActive9.destroy();
            judgesActive10.destroy();
    function JudjesSliders() {
        if(isScreenWidthM(768)) {
            judgesActive1.rebuild()
            judgesActive2.rebuild()
            judgesActive3.rebuild()
            judgesActive4.rebuild()
            judgesActive5.rebuild()
            judgesActive6.rebuild()
            judgesActive7.rebuild()
            judgesActive8.rebuild()
            judgesActive9.rebuild()
            judgesActive10.rebuild()
        }            
        if(isScreenWidthB(768)){
            judgesActive1.destroy();
            judgesActive2.destroy();
            judgesActive3.destroy();
            judgesActive4.destroy();
            judgesActive5.destroy();
            judgesActive6.destroy();
            judgesActive7.destroy();
            judgesActive8.destroy();
            judgesActive9.destroy();
            judgesActive10.destroy();
        }
            
    }
    window.onresize = JudjesSliders;
    
    let winersInfo = tns({
        container: '.winers__infos',
        mode: "gallery",
        items: 1,
        slideBy: 1,
        nav: false,
        loop: false,
        touch: false,
        center: true,
        
        controlsContainer: '.carousel__controls'
    });
    let about = tns({
        container: '.about__photolitle',
        items: 4,
        fixedWidth: 128,
        gutter: 10,
        slideBy: 4,
        controlsContainer: '.about__photos_controls',
        nav: false,
        responsive: {
            1200: {
                container: '.about__photolitle',
                items: 4,
                fixedWidth: 128,
                gutter: 20,
                slideBy: 4,
                controlsContainer: '.about__photos_controls',
            },
            991: {
                container: '.about__photolitle',
                items: 4,
                gutter: 5,
                slideBy: 4,
                fixedWidth: 115,
                controlsContainer: '.about__photos_controls',
                nav: false
            }
        }
    });

    let city = tns({
        container: '.city',
        mode: "gallery",
        items: 1,
        slideBy: 1,
        nav: true,
        autoWidth: false,
        center: true,
        controls: false,
        navContainer: '#g_container'
    });
    let smiNews = tns({
        container: '.smi__news',
        mode: "gallery",
        items: 1,
        controls: false,
        touch: false,
        slideBy: "page",
        navContainer: '.smi__photolitle',
    });
    let smiPhotoLittle = tns({
        container: '.smi__photolitle',
        items: 4,
        fixedWidth: 128,
        gutter: 30,
        slideBy: 1,
        loop: false,
        nav: false,
        nextButton: '.button_arow_next',
        prevButton: '.button_arow_prev'
    });

    winersInfo.events.on('transitionStart', hideCarousel);

    winersInfo.events.on('transitionEnd', showCarousel);

    function hideCarousel() {
        document.querySelector(".winers__infos").hidden = true;
    }

    function showCarousel() {
        document.querySelector(".winers__infos").hidden = false;
    }

    function moveCentral() {
        let all = document.querySelectorAll('.carousel__item_winers');
        all[slider.getInfo().index].style.transform = 'translateY(60px)';
        if (slider.getInfo().indexCached !== slider.getInfo().index) {
            winersInfo.goTo(slider.getInfo().index);
            all[slider.getInfo().indexCached].style.transform = 'translateY(0px)';
        }
    }

    function burger() {
        let burger = document.querySelector('.burger'),
            menu = document.querySelector('.header__menu'),
            links = document.querySelectorAll('.header__links');
        burger.addEventListener('click', () => {
            burger.classList.toggle('burger_active');
            menu.classList.toggle('header__menu_active')
        });
        links.forEach(item => {
            item.addEventListener('click', () => {
                burger.classList.toggle('burger_active');
                menu.classList.toggle('header__menu_active')
            })
        });
        document.addEventListener('scroll', () => {
            if (burger.classList.contains('burger_active')) {
                burger.classList.toggle('burger_active')
                menu.classList.toggle('header__menu_active')
            }
        })
    }


    function serachAllMarks() {
        let AllMarks = document.querySelectorAll('g g');
        AllMarks.forEach(item => {
            item.setAttribute('filter', '1');
            const boundingBox = item.getBBox();
            const xCenter = (boundingBox.width / 2) + boundingBox.x;
            const yCenter = (boundingBox.height / 2) + boundingBox.y;
            item.style.transformOrigin = `${xCenter}px ${yCenter}px`;
            item.classList.add('map__mark');
            item.addEventListener('mouseleave', () => {
                item.classList.toggle('map__mark_hover');
            });
            item.addEventListener('mouseenter', () => {
                item.classList.toggle('map__mark_hover');
            });
            item.addEventListener('click', () => {
                AllMarks.forEach(item => {
                    if (item.classList.contains('map__mark_active'))
                        item.classList.remove('map__mark_active')
                });
                item.classList.toggle('map__mark_active');
            })
        })
    }

    burger();
    activeMark('smi__photolitle_item');
    activeMark('about__imglitle', 'about__imgbig');
    serachAllMarks();
});