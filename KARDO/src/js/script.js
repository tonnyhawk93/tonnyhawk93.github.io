window.addEventListener('DOMContentLoaded', () => {

    function activeMark(littlePhoto, bigPhoto = undefined) {
        if(bigPhoto!=undefined){
            var big = document.querySelector(`.${bigPhoto}`)
        }
        let little = document.querySelectorAll(`.${littlePhoto}`)
        little.forEach((item) => {
            item.addEventListener('click', (e) => {
                little.forEach((item) => {
                    if (item.classList.contains(`${littlePhoto}_active`))
                        item.classList.remove(`${littlePhoto}_active`)
                    })
                    item.classList.add(`${littlePhoto}_active`)
                    if(bigPhoto!=undefined){
                        big.setAttribute('src', item.getAttribute('src')) 
                    }
            })
        })
    }
    var slider = tns({
        container: '.carousel__items',
        items: 3,
        lop: false,
        slideBy: 1,
        center: true,
        autoWidth: false,
        fixedWidth: 356,
        autoHeight: true,
        gutter: 30,
        viewportMax: 1000,
        nav: false,
        controlsContainer: '.carousel__controls',
        responsive: {
            1200: {
                container: '.carousel__items',
                items: 3,
                lop: false,
                slideBy: 1,
                center: true,
                autoWidth: false,
                fixedWidth: 356,
                autoHeight: true,
                gutter: 30,
                viewportMax: 1000,
                nav: false,
                controlsContainer: '.carousel__controls' 
            },
            991: {
                container: '.carousel__items',
                items: 3,
                lop: false,
                slideBy: 1,
                center: true,
                autoWidth: false,
                fixedWidth: 290,
                autoHeight: true,
                gutter: 20,
                nav: false,
                controlsContainer: '.carousel__controls'
            }
        }
    })
    var team1 = tns({
        container: '.carousel__items_first',
        items: 1,
        slideBy: 1,
        controlsContainer: '.carousel__controls_first',
        nav: false
    })
    var team2 = tns({
        container: '.carousel__items_second',
        items: 1,
        slideBy: 1,
        nav: false,
        controlsContainer: '.carousel__controls_second',
    })
    var judjes = tns({
        container: '.judges__carousel_items',
        items: 1,
        slideBy: 1,
        nav: true,
        navContainer: '.judges__list',
        controls: false,
        autoHeight: true
    })
    let winersInfo = tns({
        container: '.winers__infos',
        mode: "gallery",
        items: 1,
        slideBy: 1,
        nav: false,
        autoWidth: false,
        center: true,
        controlsContainer: '.carousel__controls'
    })
    let about = tns({
        container: '.about__photolitle',
        items: 4,
        fixedWidth: 128,
        gutter: 30,
        slideBy: 4,
        controlsContainer: '.about__photos_controls',
        nav: false,
        responsive: {
            1200: {
                container: '.about__photolitle',
                items: 4,
                fixedWidth: 128,
                gutter: 30,
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
    })
   
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
    })
    let smiNews = tns({
        container: '.smi__news',
        mode: "gallery",
        items: 1,
        controls: false,
        slideBy: "page",
        navContainer: '.smi__photolitle',
    })
    let smiPhotoLittle = tns({
        container: '.smi__photolitle',
        items: 4,
        fixedWidth: 128,
        gutter: 30,
        slideBy: 1,
        nav: false,
        nextButton: '.button_arow_next',
        prevButton: '.button_arow_prev',
        onInit: ()=> {
            let next = document.querySelector('.button_arow_next'),
                prev = document.querySelector('.button_arow_prev'),
                startIndex,
                photos = document.querySelectorAll('.smi__photolitle_item');
                next.addEventListener('click',(e) => {
                    photos.forEach((item,index)=>{
                    if(item.classList.contains('smi__photolitle_item_active')) {
                        startIndex = index;
                    }
                    })
                    photos[startIndex+1].click(); 
                    if(photos[startIndex+1].classList.contains('smi__photolitle_item_active')){
                        photos[startIndex+1].classList.add('smi__photolitle_item_active')
                    }
                })
                prev.addEventListener('click',(e) => {
                    photos.forEach((item,index)=>{
                        if(item.classList.contains('smi__photolitle_item_active')) {
                            startIndex = index;
                        }
                        })
                        photos[startIndex-1].click();    
            })
        }
    })
    function central() {
        searchCentral()
        let rightConrols = document.querySelector('.carousel__right');
        let leftConrols = document.querySelector('.carousel__left');
        rightConrols.addEventListener('click', e => {
            setTimeout(()=>{
                searchCentral()
            }, 350);
        })
        leftConrols.addEventListener('click', e => {
            setTimeout(()=>{
                searchCentral(2)
            }, 350);
        })  
    };

    function searchCentral(num = 2) {
        let central, all
            central = document.querySelectorAll('.carousel__item_winers+.tns-slide-active');
            all = document.querySelectorAll('.carousel__item_winers'); 
        if (typeof central == "undefined" || central.length == 0) {
            setTimeout(searchCentral, 10) 
        } else {
            if (typeof central[num] !== "undefined" && central.length !== 0) {
                if(num>=2) {
                        all.forEach(item=>{
                            item.style.transform = 'translateY(0px)'
                        })
                        central[num].style.transform = 'translateY(60px)'   
                    
                } else if( num<=2) {
                    all.forEach(item=>{
                        item.style.transform = 'translateY(0px)'
                    })
                    central[num].style.transform = 'translateY(60px)'
                }
            }
        }
    }

    
    function serachAllMarks() {
        let AllMarks = document.querySelectorAll('g g');
        AllMarks.forEach(item => {
            item.setAttribute('filter', '1')
            const boundingBox = item.getBBox()
            const xCenter = (boundingBox.width / 2) + boundingBox.x
            const yCenter = (boundingBox.height / 2) + boundingBox.y
            item.style.transformOrigin = `${xCenter}px ${yCenter}px`
            item.classList.add('map__mark');
            item.addEventListener('mouseleave', () => {
                item.classList.toggle('map__mark_hover');
            })
            item.addEventListener('mouseenter', () => {
                item.classList.toggle('map__mark_hover');
            })
            item.addEventListener('click', () => {
                AllMarks.forEach(item => {
                    if (item.classList.contains('map__mark_active'))
                        item.classList.remove('map__mark_active')
                })
                item.classList.toggle('map__mark_active');
            })
        })
    }
    activeMark('smi__photolitle_item');
    activeMark('about__imglitle', 'about__imgbig');
    central();
    serachAllMarks();
})