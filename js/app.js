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
    imgDessert.src = image.mobile;
    imgDessert.alt = `image ${name}`;
    div.appendChild(imgDessert);

    if (cart.some(dessert => dessert.id === id)) {
        const divBtns = showOptions(id);
        div.appendChild(divBtns);
    } else {
        const button = showButton(name, price, id, div);
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

function addToCart(name, price, id) {
    let objDessert = {
        id,
        name,
        price,
        cant: 1,
        total: price
    };
    
    cart = [...cart, objDessert];
    showCart();
};

function showCart() {
    while(containerCarts.firstChild) {
        containerCarts.removeChild(containerCarts.firstChild);
    }
    if (cart.length === 0) {
        const h2 = document.createElement("H2");
        h2.classList.add('carts-title');
        h2.textContent = `Your Cart (${cart.length})`;

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
      <span>$${getTotalCart()}</span>
    `;

    const h3 = document.createElement("H3");
    h3.classList.add('carts-msj');
    h3.innerHTML = `This is a <span>carbon-neutral</span> delivery`;

    const btnConfirm = document.createElement("BUTTON");
    btnConfirm.classList.add('carts-button');
    btnConfirm.textContent = 'Confirm Order';

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

function showButton(name = '', price = 0, id = 0, location) {
    const button = document.createElement("BUTTON");
    button.classList.add('button-dessert');
    button.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart"><span>Add to Cart</span>`;
    button.onclick = () => {
        if (cart.some(dessert => dessert.id === id)) return;
        button.remove();
        addToCart(name, price, id);
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

    const button = showButton(name, Number(price.replace('$', '')), Number(id), element.children[0]);
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
            if(element.id === id && action === 'increment') {
                element.cant++;
                element.total += element.price;
                return element;
            } else if (element.id === id && action === 'decrement' && element.cant > 1) {
                element.cant--;
                element.total -= element.price;
                return element;
            } else {
                return element;
            }
        });
        cart = [...actCart];
        showCart();
        saveLocalStorage();
    }
};

function getQuantity(id) {
    let element = cart.find(dessert => dessert.id === id);
    return element.cant;
};

function getTotalCart() {
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
        const result = await response.json();
        showDesserts(result);
    } catch (error) {
        console.log(error);
    }
};

document.addEventListener("DOMContentLoaded", initApp());