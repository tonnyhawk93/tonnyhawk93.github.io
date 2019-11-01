window.addEventListener('DOMContentLoaded', ()=> {    
    var burgermenuicon = document.querySelector('.burger-menu-icon');   
    var header = document.querySelector('.header');
    var reservation = document.querySelector('.right-block-head p');        
    var miniMenu = document.querySelector('.menu');
    var logo =  document.querySelector('.logo');
    var activeButton =  document.querySelector('.burger-menu-button');
    var contHeader = document.querySelector('.conteiner-header');         
    burgermenuicon.onclick = function () {
        this.classList.toggle('burger-menu-active');            
        miniMenu.classList.toggle('menu-active');
        logo.classList.toggle('logo-active');
        activeButton.classList.toggle('burger-menu-button-a');
        reservation.classList.toggle('reservation_hidden'); 
        header.classList.toggle('header_active');
        contHeader.classList.toggle('conteiner-header_active');    
    }
    window.onscroll = function show_header(){
        if (window.pageYOffset > 120){
            header.classList.add('header-fixed');
        }
        else{
            header.classList.remove('header-fixed');
        }
    }
    
})