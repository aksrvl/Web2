document.getElementById('add-button').addEventListener('click', addItem);
document.getElementById('item-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addItem();
    }
});

function initializeItems() {
    const items = document.querySelectorAll('#item-list .item');
    items.forEach(item => {
        const itemNameSpan = item.querySelector('.item-name');
        const itemQuantitySpan = item.querySelector('.item-quantity') || item.querySelector('.item-quantity-notbought');
        const decrementButton = item.querySelector('.item-decrement');
        const incrementButton = item.querySelector('.item-increment');
        const deleteButton = item.querySelector('.item-delete');
        const boughtButton = item.querySelector('.item-status');

        if (!itemNameSpan.classList.contains('bought')) {
            itemNameSpan.addEventListener('click', editItemNameHandler);
        }
        if (decrementButton) {
            decrementButton.addEventListener('click', () => updateQuantity(itemQuantitySpan, -1));
        }
        if (incrementButton) {
            incrementButton.addEventListener('click', () => updateQuantity(itemQuantitySpan, 1));
        }
        if (deleteButton) {
            deleteButton.addEventListener('click', () => deleteItem(item, item.previousElementSibling));
        }
        if (boughtButton) {
            boughtButton.addEventListener('click', () => toggleBought(item));
        }
    });
}


function addItem() {
    const itemInput = document.getElementById('item-input');
    const itemName = itemInput.value.trim();
    
    if (itemName === '') {
        alert('Введіть назву товару');
        return;
    }
    
    const itemList = document.getElementById('item-list');
    
    const underlineDiv = document.createElement('span');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    
    const itemNameSpan = document.createElement('span');
    itemNameSpan.className = 'item-name';
    itemNameSpan.textContent = itemName;
    itemNameSpan.addEventListener('click', editItemNameHandler);
    
    const itemQuantitySpan = document.createElement('span');
    itemQuantitySpan.className = 'item-quantity';
    itemQuantitySpan.textContent = '1';
    
    const underLine = document.createElement('hr');
    
    const itemControlsDiv = document.createElement('div');
    itemControlsDiv.className = 'item-controls';
    
    const itemControlsDivChange = document.createElement('div');
    itemControlsDivChange.className = 'item-controls-change';
    
    const decrementButton = document.createElement('button');
    decrementButton.className = 'item-decrement';
    decrementButton.title = "Відняти";
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => updateQuantity(itemQuantitySpan, -1));
    
    const incrementButton = document.createElement('button');
    incrementButton.className = 'item-increment';
    incrementButton.title = "Додати";
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => updateQuantity(itemQuantitySpan, 1));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'item-delete';
    deleteButton.title = "Видалити";
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteItem(itemDiv, underlineDiv));
    
    const boughtButton = document.createElement('button');
    boughtButton.className = 'item-status';
    boughtButton.title = "Відмітити";
    boughtButton.textContent = 'Куплено';
    boughtButton.addEventListener('click', () => toggleBought(itemDiv));
    
    underlineDiv.appendChild(underLine);
    
    itemControlsDivChange.appendChild(decrementButton);
    itemControlsDivChange.appendChild(itemQuantitySpan);
    itemControlsDivChange.appendChild(incrementButton);
    
    itemControlsDiv.appendChild(boughtButton);
    itemControlsDiv.appendChild(deleteButton);
    
    itemDiv.appendChild(itemNameSpan);
    itemDiv.appendChild(itemControlsDivChange);
    itemDiv.appendChild(itemControlsDiv);
    
    itemList.appendChild(underlineDiv);
    itemList.appendChild(itemDiv);
    
    itemInput.value = '';
    itemInput.focus();
    updateSummary();
}


function editItemNameHandler(event) {
    editItemName(event.target);
}

function editItemName(itemNameSpan) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = itemNameSpan.textContent;
    input.className = 'edit-item-name-input';
    itemNameSpan.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        const newName = input.value.trim();
        if (newName === '') {
            alert('Назва не може бути порожньою');
            input.focus();
            return;
        }

        itemNameSpan.textContent = newName;
        input.replaceWith(itemNameSpan);
        if (!itemNameSpan.classList.contains('bought')) {
            itemNameSpan.addEventListener('click', editItemNameHandler);
        }
        updateSummary();
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            input.blur();
        }
    });
}

function updateQuantity(quantitySpan, delta) {
    let quantity = parseInt(quantitySpan.textContent);
    quantity += delta;
    if (quantity < 1) {
        quantity = 1;
    }
    quantitySpan.textContent = quantity;
    updateSummary();
}

function deleteItem(itemDiv, underlineDiv) {
    itemDiv.remove();
    underlineDiv.remove();
    updateSummary();
}

function toggleBought(itemDiv) {
    const itemNameSpan = itemDiv.querySelector('.item-name');
    const boughtButton = itemDiv.querySelector('.item-status');
    const deleteButton = itemDiv.querySelector('.item-delete');
    const itemQuantitySpan = itemDiv.querySelector('.item-quantity') || itemDiv.querySelector('.item-quantity-notbought');
    const incrementButton = itemDiv.querySelector('.item-increment');
    const decrementButton = itemDiv.querySelector('.item-decrement');

    itemNameSpan.classList.toggle('bought');
    if (itemNameSpan.classList.contains('bought')) {
        boughtButton.textContent = 'Не куплено';
        itemNameSpan.removeEventListener('click', editItemNameHandler);
        deleteButton.style.display = 'none'; 
        itemQuantitySpan.className = 'item-quantity-notbought'; 
        incrementButton.style.display = 'none';
        decrementButton.style.display = 'none';
    } else {
        boughtButton.textContent = 'Куплено';
        itemNameSpan.addEventListener('click', editItemNameHandler);
        deleteButton.style.display = 'inline-block';
        itemQuantitySpan.className = 'item-quantity'; 
        incrementButton.style.display = 'inline-block';
        decrementButton.style.display = 'inline-block';
    }
    updateSummary();
}

function updateSummary() {
    const remainingItemsDiv = document.querySelector('.remaining-items');
    const boughtItemsDiv = document.querySelector('.bought-items');

    remainingItemsDiv.innerHTML = '';
    boughtItemsDiv.innerHTML = '';

    const items = document.querySelectorAll('#item-list .item');
    items.forEach(item => {
        const itemNameSpan = item.querySelector('.item-name');
        const itemQuantitySpan = item.querySelector('.item-quantity') || item.querySelector('.item-quantity-notbought');
        const itemName = itemNameSpan.textContent;
        const itemQuantity = itemQuantitySpan.textContent;

        const itemSummaryDiv = document.createElement('div');
        const itemSummaryNameSpan = document.createElement('span');
        const itemSummaryQuantitySpan = document.createElement('span');

        if (itemNameSpan.classList.contains('bought')) {
            itemSummaryDiv.className = 'bought-item';
            itemSummaryNameSpan.className = 'bought';
        } else {
            itemSummaryDiv.className = 'remaining-item';
        }

        itemSummaryNameSpan.textContent = itemName;
        itemSummaryQuantitySpan.className = 'num';
        itemSummaryQuantitySpan.textContent = itemQuantity;

        itemSummaryDiv.appendChild(itemSummaryNameSpan);
        itemSummaryDiv.appendChild(itemSummaryQuantitySpan);

        if (itemNameSpan.classList.contains('bought')) {
            boughtItemsDiv.appendChild(itemSummaryDiv);
        } else {
            remainingItemsDiv.appendChild(itemSummaryDiv);
        }
        itemSummaryDiv.style.marginRight='5px';
    });
}

initializeItems();
