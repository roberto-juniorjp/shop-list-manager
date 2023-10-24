/* ELEMENT SELECTION */

const buttons = document.querySelectorAll(".form-control button");

const comprasForm = document.querySelector("#compras-form");
const comprasInput = document.querySelector("#compras-input");
const comprasList = document.querySelector("#compras-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

/* FUNCTIONS */

const saveCompra = (text, done = 0, save = 1) => {
  const compra = document.createElement("div");
  compra.classList.add("item");

  const itemTitle = document.createElement("h3");
  itemTitle.innerText = text;
  compra.appendChild(itemTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-compra");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  compra.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-compra");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  compra.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-compra");
  removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  compra.appendChild(removeBtn);

  // Using Data From Local Storage
  if (done) {
    compra.classList.add("done");
  }

  if (save) {
    saveItensLocalStorage({ text, done });
  }

  comprasList.appendChild(compra);

  comprasInput.value = "";
  comprasInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  comprasForm.classList.toggle("hide");
  comprasList.classList.toggle("hide");
  if (comprasForm.classList.contains("hide")) {
    editInput.focus();
  } else {
    comprasInput.focus();
  }
};

const updateItem = (text) => {
  const itens = document.querySelectorAll(".item");

  itens.forEach((item) => {
    let itemTitle = item.querySelector("h3");
    if (itemTitle.innerText === oldInputValue) {
      itemTitle.innerText = text;
      updateItemLocalStorage(oldInputValue ,text);
    }
  });
};

const getSearchItens = (search) => {
  const itens = document.querySelectorAll(".item");

  itens.forEach((item) => {
    let itemTitle = item.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    item.style.display = "flex";

    if (!itemTitle.includes(normalizedSearch)) {
      item.style.display = "none";
    }
  });
};

const filterItens = (filterValue) => {
  const itens = document.querySelectorAll(".item");
  switch (filterValue) {
    case "all":
      itens.forEach((item) => (item.style.display = "flex"));
      break;

    case "done":
      itens.forEach((item) =>
        item.classList.contains("done")
          ? (item.style.display = "flex")
          : (item.style.display = "none")
      );
      break;

    case "missing":
      itens.forEach((item) =>
        !item.classList.contains("done")
          ? (item.style.display = "flex")
          : (item.style.display = "none")
      );
      break;
    default:
      break;
  }
};

/* EVENTS */

comprasInput.focus();

comprasForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = comprasInput.value;

  if (inputValue) {
    saveCompra(inputValue);
  } else {
    comprasInput.focus();
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let compraTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    compraTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-compra")) {
    parentEl.classList.toggle("done");
    if (filterBtn.value === "missing") {
      filterItens(filterBtn.value);
    } else if (filterBtn.value === "done") {
      filterItens(filterBtn.value);
    }

    updateItemStatusLocalStorage(compraTitle);
    comprasInput.focus();
  }

  if (targetEl.classList.contains("edit-compra")) {
    e.preventDefault();
    toggleForms();
    editInput.value = compraTitle;
    oldInputValue = compraTitle;
    editInput.focus();
  }

  if (targetEl.classList.contains("remove-compra")) {
    e.preventDefault();
    parentEl.remove();
    removeItemLocalStorage(compraTitle);
    comprasInput.focus();
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;
  if (editInputValue) {
    updateItem(editInputValue);
  }
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchItens(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.focus();
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterItens(filterValue);
});

/* LOCAL STORAGE */

const getItensLocalStorage = () => {
  const itens = JSON.parse(localStorage.getItem("itens")) || [];
  return itens;
};

const loadItens = () => {
  const itens = getItensLocalStorage();
  itens.forEach((item) => {
    saveCompra(item.text, item.done, 0);
  });
};

const saveItensLocalStorage = (item) => {
  const itens = getItensLocalStorage();

  itens.push(item);

  localStorage.setItem("itens", JSON.stringify(itens));
};

const removeItemLocalStorage = (itemText) => {
  const itens = getItensLocalStorage();

  const filteredItens = itens.filter((item) => item.text !== itemText);

  localStorage.setItem("itens", JSON.stringify(filteredItens));
};

const updateItemStatusLocalStorage = (itemText) => {
  const itens = getItensLocalStorage();

  itens.map((item) =>
    item.text === itemText ? (item.done = !item.done) : null
  );

  localStorage.setItem("itens", JSON.stringify(itens));
};

const updateItemLocalStorage = (itemOldText, itemNewText) => {
  const itens = getItensLocalStorage();

  itens.map((item) =>
    item.text === itemOldText ? (item.text = itemNewText) : null
  );

  localStorage.setItem("itens", JSON.stringify(itens));
};



loadItens();
