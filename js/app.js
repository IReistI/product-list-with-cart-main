const containerDesserts = document.querySelector("#container-desserts");
const containerCarts = document.querySelector("#carts");

let cart = [];

function initApp() {
    cart = getCartLocalStorage();
    getDesserts();
    showCart();
    
};

function showDesserts(results) {
    results.forEach( result => {
        const {image, name, category, price, id} = result;    
        const dessert = createDessert(image, name, category, price, id);
        
        containerDesserts.appendChild(dessert);
    });
};  

function createDessert(image, name, category, price, id) {
    const divDessert = document.createElement("DIV");
    divDessert.classList.add('dessert');
    divDessert.dataset.id = id;

    const div = document.createElement("DIV");

    const imgDessert = document.createElement("IMG");
    imgDessert.classList.add(`${cart.some(dessert => dessert.id === id) ? 'img-dessert-red' : 'img-dessert'}`);
    imgDessert.src = `${verifySize(image)}`;
    imgDessert.alt = `image ${name}`;
    div.appendChild(imgDessert);

    if (cart.some(dessert => dessert.id === id)) {
        const divBtns = showOptions(id);
        div.appendChild(divBtns);
    } else {
        const button = showButton(name, price, id, div, image.mobile);
        div.appendChild(button);
    }
    
    const divInfo = document.createElement("DIV");
    divInfo.classList.add('info-dessert');
    
    const h4 = document.createElement("H4");
    h4.classList.add('info-name-dessert');
    h4.textContent = name;

    const h3 = document.createElement("H3");
    h3.classList.add('info-title-dessert');
    h3.textContent = category;

    const span = document.createElement("SPAN");
    span.classList.add('info-price-dessert');
    span.textContent = `$${price}`;

    divInfo.appendChild(h4);
    divInfo.appendChild(h3);
    divInfo.appendChild(span);

    divDessert.appendChild(div);
    divDessert.appendChild(divInfo);

    return divDessert;
};

function addToCart(name, price, id, img) {
    let objDessert = {
        id,
        name,
        price,
        cant: 1,
        total: price,
        img
    };
    
    cart = [...cart, objDessert];
    showCart();
};

function showCart() {
    while(containerCarts.firstChild) {
        containerCarts.removeChild(containerCarts.firstChild);
    }
    const h2 = document.createElement("H2");
    h2.classList.add('carts-title');
    h2.textContent = `Your Cart (${cart.length})`;
    containerCarts.appendChild(h2);
    if (cart.length === 0) {
        const img = document.createElement("IMG");
        img.classList.add('cart-img');
        img.src = 'assets/images/illustration-empty-cart.svg';
        img.alt = 'empty cart';

        const p = document.createElement("P");
        p.classList.add('cart-text');
        p.textContent = 'Your added items will appear here';

        containerCarts.appendChild(h2);
        containerCarts.appendChild(img);
        containerCarts.appendChild(p);
        return;   
    }
    const divCart = document.createElement("DIV");
    divCart.classList.add('cart-container');
    divCart.onclick = (e) => {
        if (e.target && (e.target.id === 'btn-removeItem' || e.target.id === 'btn-img')){
            let button = e.target.closest('button#btn-removeItem');
            let id = button.parentElement.dataset.id;
            removeDessertCart(id);
        }
    };

    cart.forEach( dessert => {
        const {id, name, price, cant, total} = dessert;
        divCart.innerHTML += `
        <div class="cart" data-id="${id}">
            <div>
            <h3 class="cart-title">${name}</h3>
            <div class="cart-info">
                <span>${cant}x</span>
                <h4>$${price}</h4>
                <span>$${total}</span>
            </div>
            </div>
            <button class="cart-button" id="btn-removeItem"><img id="btn-img" src="assets/images/icon-remove-item.svg" alt="remove item"></button>
        </div>
        `;
    });
    const divResults = document.createElement("DIV");
    divResults.classList.add('carts-result');
    divResults.innerHTML = ` 
      <h3>Order total</h3>
      <span>$${getTotalCart(cart)}</span>
    `;

    const h3 = document.createElement("H3");
    h3.classList.add('carts-msj');
    h3.innerHTML = `This is a <span>carbon-neutral</span> delivery`;

    const btnConfirm = document.createElement("BUTTON");
    btnConfirm.classList.add('carts-button');
    btnConfirm.textContent = 'Confirm Order';
    btnConfirm.onclick = () => {
        confirmOrder();  
    };

    containerCarts.appendChild(divCart);
    containerCarts.appendChild(divResults);
    containerCarts.appendChild(h3);
    containerCarts.appendChild(btnConfirm);
};  

function showOptions(id) {
    const divBtns = document.createElement("DIV");
    divBtns.classList.add('menuButton-dessert');

    const span = document.createElement("SPAN");
    span.textContent = `${getQuantity(id)}`;

    const btnDecrement = document.createElement("BUTTON");
    btnDecrement.onclick = () => {
        incrementOrDecrement(id, "decrement");
        span.textContent = `${getQuantity(id)}`;
    };

    const imgDecrement = document.createElement("IMG");
    imgDecrement.src = 'assets/images/icon-decrement-quantity.svg';
    imgDecrement.alt = 'decrement quantity';
    btnDecrement.appendChild(imgDecrement);

    const btnIncrement = document.createElement("BUTTON");
    btnIncrement.onclick = () => {
        incrementOrDecrement(id, "increment");
        span.textContent = `${getQuantity(id)}`;
    };

    const imgIncrement = document.createElement("IMG");
    imgIncrement.src = 'assets/images/icon-increment-quantity.svg';
    imgIncrement.alt = 'increment quantity';
    btnIncrement.appendChild(imgIncrement);

    divBtns.appendChild(btnDecrement);
    divBtns.appendChild(span);
    divBtns.appendChild(btnIncrement);

    return divBtns;
};

function showButton(name = '', price = 0, id = 0, location, img) {
    const button = document.createElement("BUTTON");
    button.classList.add('button-dessert');
    button.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart"><span>Add to Cart</span>`;
    button.onclick = () => {
        if (cart.some(dessert => dessert.id === id)) return;
        button.remove();
        addToCart(name, price, id, img);
        saveLocalStorage();
        const divBtns = showOptions(id);
        location.appendChild(divBtns);
        location.children[0].classList.add('img-dessert-red');
    };
    return button;
};

function removeDessertCart(id) {
    let element = document.querySelector(`[data-id="${id}"]`);
    let img = element.children[0].children[0];

    let name = element.children[1].children[0].textContent;
    let price = element.children[1].children[2].textContent;

    const button = showButton(name, Number(price.replace('$', '')), Number(id), element.children[0], img.src);
    element.children[0].children[1].remove();
    element.children[0].appendChild(button);

    img.classList.add('img-dessert');
    img.classList.remove('img-dessert-red');
    
    cart = cart.filter(dessert => dessert.id !== Number(id));
    saveLocalStorage();
    showCart();
};

function incrementOrDecrement(id, action) {
    if (cart.some(dessert => dessert.id === id)) {
        const actCart = cart.map(element => {
            if (element.id === id && action === 'increment') {
                element.cant++;
                element.total += element.price;
                return element;
            } else if (element.id === id && action === 'decrement') {
                element.cant--;
                if (element.cant < 1) {
                    const dessertDiv = document.querySelector(`[data-id="${element.id}"]`);
                    const button = dessertDiv.firstChild.lastChild;
                    button.remove();
        
                    const id = dessertDiv.dataset.id;
                    const img = dessertDiv.firstChild.firstChild;
                    const name = dessertDiv.lastChild.firstChild.textContent;
                    const price = dessertDiv.lastChild.lastChild.textContent;
                    
                    const btn = showButton(name , Number(price.replace('$', '')), Number(id), dessertDiv.children[0], img.src);
                    dessertDiv.children[0].appendChild(btn);
        
                    img.classList.add('img-dessert');
                    img.classList.remove('img-dessert-red');
                    return element;
                }
                element.total -= element.price;
                return element;
            } else {
                return element;
            }
        });
        const eliminate = actCart.filter(element => element.cant !== 0);
        cart = [...eliminate];
        showCart();
        saveLocalStorage();
    }
};

function confirmOrder() {
    const cartConfirm = [...cart];
    const clearCart = [];
    cart = [...clearCart];
    resetStyles();
    showCart();
    saveLocalStorage();
    showResume(cartConfirm);
};

function showResume(cartConfirm) {
    const modal = document.querySelector(".modal");
    modal.classList.add('modal-show');

    const modalContainer = document.querySelector(".modal-container");
    modalContainer.insertAdjacentHTML("beforeend", `
        <img class="modal-img" src="assets/images/icon-order-confirmed.svg" alt="order confirmed">
        <h2 class="modal-title">Order Confirmed</h2>
        <p class="modal-subtitle">We hope you enjoy your food!</p>
    `);
    

    const modalDesserts = document.createElement("DIV");
    modalDesserts.classList.add('modal-desserts');

    const modalTotal = document.createElement("DIV");
    modalTotal.classList.add('modal-total');
    modalTotal.insertAdjacentHTML("beforeend", `
        <p>Order Total</p>
        <span>$${getTotalCart(cartConfirm)}</span>
    `);

    cartConfirm.forEach(dessert => {
        const {name, price, img, total, cant} = dessert;
        const dessertDiv = document.createElement("DIV");
        dessertDiv.classList.add('modal-dessert');
        dessertDiv.insertAdjacentHTML("beforeend", `
            <div class="modal-img-info">
              <img src="${img}" alt="dessert ${name}">
              <div class="modal-dessert-info">
                <h3>${name}</h3>
                <div>
                  <span>${cant}x</span>
                  <p>$${price}</p>
                </div>
              </div>
            </div>
            <span>$${total}</span>    
        `);
        modalDesserts.appendChild(dessertDiv);
    });
    const modalButton = document.createElement('BUTTON');
    modalButton.classList.add('modal-button');
    modalButton.textContent = 'Start New Order';
    modalButton.onclick = () => {
        const modal = document.querySelector(".modal");
        modal.classList.remove("modal-show");
        modalContainer.innerHTML = "";
    };

    modalDesserts.appendChild(modalTotal);
    modalContainer.appendChild(modalDesserts);
    modalContainer.appendChild(modalButton);
};

function resetStyles() {
    const dessertsDiv = document.querySelectorAll('.dessert');
    for(dessert of dessertsDiv) {
        if(dessert.firstChild.lastChild.classList.contains('menuButton-dessert')) {
            const button = dessert.firstChild.lastChild;
            button.remove();

            const id = dessert.dataset.id;
            const img = dessert.firstChild.firstChild;
            const name = dessert.lastChild.firstChild.textContent;
            const price = dessert.lastChild.lastChild.textContent;
            
            const btn = showButton(name , Number(price.replace('$', '')), Number(id), dessert.children[0], img.src);
            dessert.children[0].appendChild(btn);

            img.classList.add('img-dessert');
            img.classList.remove('img-dessert-red');
        }
    }
};

function verifySize(images) {
    const width = window.innerWidth;
    if (width >= 1440) {
        return images.desktop;
    } else if (width >= 768) {
        return images.tablet;
    } else {
        return images.mobile;
    }
};

function getQuantity(id) {
    let element = cart.find(dessert => dessert.id === id);
    return element ? element.cant : 0;
};

function getTotalCart(cart) {
    let total = cart.reduce((ttl, dessert) => ttl + dessert.total, 0);
    return total;
};

function saveLocalStorage() {
    localStorage.setItem('DessertsCart', JSON.stringify(cart));
};

function getCartLocalStorage() {
    return JSON.parse(localStorage.getItem('DessertsCart')) ?? [];
};

async function getDesserts() {
    try {
        const response = await fetch('data.json');
        if(!response) throw new error("Error");
        const result = await response.json();
        showDesserts(result);
    } catch (error) {
        console.log(error);
    }
};

document.addEventListener("DOMContentLoaded", initApp());