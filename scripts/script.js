'use strict'; //покажетт ошибки в коде (очень строго пишем)

//классы для js отдельно и без стилей, классы для стилей отдельно))
//если id  не нужны, то не юзать лишний раз
// массив для объявлений
const dataBase =  JSON.parse(localStorage.getItem('awito')) || [];
let counter = dataBase.length;
const modalAdd = document.querySelector('.modal__add'), 
    addAd = document.querySelector('.add__ad'), 
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');

const modalImageItem = document.querySelector('.modal__image-item'),
    modalHeaderItem = document.querySelector('.modal__header-item'),
    modalStatusItem = document.querySelector('.modal__status-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector(".search__imput");

const textFileBtn = modalFileBtn.textContent;
const scrModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON');
 //... - спрет опператор - все что в квадратных скобках записать через ,
//если обернуть в [] то получим массив 
    
const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () => {
    //валидация 
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : ''; //тернарная операция 
}

    
const closeModal = event => {
    //закрыть везде  не только на крестик
    const target = event.target;

    if(target.closest('.modal__close') || 
        target.classList.contains('modal') ||
        event.code === "Escape") {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
            document.removeEventListener('keydown', closeModal);
            modalSubmit.reset();
            modalImageAdd.src = scrModalImage;
            modalFileBtn.textContent = textFileBtn;
            checkForm();
        }
};

const renderCard = () => {
    catalog.textContent = '';

    dataBase.forEach((item, i) => {
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${i}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image64}" alt="test"> 
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
        </li>
        `);
        //добавляет верстку в HTML - 4 позиции ( перед открыв главным тегом, после, перед внутр откр илил закрыт)
    });
};

modalFileInput.addEventListener('change', event => {
    const target = event.target;

    const reader = new FileReader();

    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    //метод load работает только после того как файл был загружен
    reader.addEventListener('load', event => {

        if(infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);//конвертирует картинку в строку
            modalImageAdd.src = `data:image/jpeg;base64, ${infoPhoto.base64}`;
        }
        else{
            modalFileBtn.textContent = "Файл не должен превышать 200Кб";
            modalFileInput.value = '';
            checkForm();
        }
        
    });

});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    //БЛОКИРУЕМ АВТОМАТ перезагрузку страницы после отправки
    event.preventDefault();
    const itemObject = {};
    for (const elem of elementsModalSubmit) {
        itemObject[elem.name] = elem.value;
    }
    itemObject.id = counter++;
    itemObject.image64 = infoPhoto.base64;
    dataBase.push(itemObject);
    closeModal({target:modalAdd});
    saveDB();
    renderCard();
});

addAd.addEventListener('click', () => {
        modalAdd.classList.remove('hide'); //убрали класс у кнопки 
        modalBtnSubmit.disabled = true; //когда отрыв модальное окно, кнопка блокируется
        document.addEventListener('keydown', closeModal);
});

    //делегирование
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);


catalog.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.card');
    if(card){
        const item = dataBase.find(obj = > obj.id === +card.dataset.id);
        //1.15.10 в видосе - доделать этот момент



        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});


document.addEventListener('keydown', closeModal);
renderCard();



