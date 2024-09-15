
(function () {
    const openButton = document.querySelector('.nav__menu');
    const menu = document.querySelector('.nav__link');
    const closeMenu = document.querySelector('.nav__close');

    openButton.addEventListener('click', () => {
        menu.classList.add('nav__link--show');
    });

    closeMenu.addEventListener('click', () => {
        menu.classList.remove('nav__link--show');
    });
})();

(function () {
    const titleQuestions = [...document.querySelectorAll('.questions__title')];
    console.log(titleQuestions)

    titleQuestions.forEach(question => {
        question.addEventListener('click', () => {
            let height = 0;
            let answer = question.nextElementSibling;
            let addPadding = question.parentElement.parentElement;

            addPadding.classList.toggle('questions__padding--add');
            question.children[0].classList.toggle('questions__arrow--rotate');

            if (answer.clientHeight === 0) {
                height = answer.scrollHeight;
            }

            answer.style.height = `${height}px`;
        });
    });
})();

(function () {

    const sliders = [...document.querySelectorAll('.testimony__body')];
    const buttonNext = document.querySelector('#next');
    const buttonBefore = document.querySelector('#before');
    let value;

    buttonNext.addEventListener('click', () => {
        changePosition(1);
    });

    buttonBefore.addEventListener('click', () => {
        changePosition(-1);
    });

    const changePosition = (add) => {
        const currentTestimony = document.querySelector('.testimony__body--show').dataset.id;
        value = Number(currentTestimony);
        value += add;

        sliders[Number(currentTestimony) - 1].classList.remove('testimony__body--show');
        if (value === sliders.length + 1 || value === 0) {
            value = value === 0 ? sliders.length : 1;
        }

        sliders[value - 1].classList.add('testimony__body--show');
    }

})();

/* Nueva funcionalidad para mover el menú */
const leftArrow = document.querySelector('.arrow_menu.left');
const rightArrow = document.querySelector('.arrow_menu.righ');
const navMenu = document.querySelector('.nav__link');
const menuItems = document.querySelectorAll('.nav__items');

let offset = 0;
const itemWidth = 150; // Ajusta este valor al ancho de un elemento de menú (puede diferir según tus estilos)
const maxOffset = -((menuItems.length - 1) * itemWidth);

leftArrow.addEventListener('click', () => {
    if (offset > maxOffset) {
        offset -= itemWidth; // Ajusta la cantidad que deseas desplazar
        if (offset > 0) {
            offset = 0; // No permitir que se desplace más a la izquierda
        }
        navMenu.style.transform = `translateX(${offset}px)`;
    }
});

rightArrow.addEventListener('click', () => {
    if (offset < 0) {
        offset += itemWidth; // Ajusta la cantidad que deseas desplazar
        if (offset < maxOffset) {
            offset = maxOffset; // No permitir que se desplace más a la derecha
        }
        navMenu.style.transform = `translateX(${offset}px)`;
    }
});
