import "./style.css";

document.getElementById("name")?.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    console.log(input.value);
});

// обработка кнопки добавить участника
document.getElementById("add")?.addEventListener("click", () => {
    const name = document.getElementById("name")?.value;
    const job = document.getElementById("job")?.value;
    const phone = document.getElementById("phone")?.value;

    if (!name || !job || !phone) {
        renderBaner("Заполните все поля");
        return;
    }

    const newPuople = {
        name,
        job,
        phone,
    };

    let book = JSON.parse(localStorage.getItem("book") || "{}");

    if (!book[newPuople.name[0].toUpperCase()]) {
        book[newPuople.name[0].toUpperCase()] = [];
    }

    book[newPuople.name[0].toUpperCase()].push(newPuople);
    localStorage.setItem("book", JSON.stringify(book));

    document.getElementById("name").value = "";
    document.getElementById("job").value = "";
    document.getElementById("phone").value = "";

    renderBaner("Участник добавлен");
    renderBookElement(book);
});

// обработка кнопки очистить книгу
document.getElementById("clear")?.addEventListener("click", () => {
    localStorage.clear();
    renderBaner("Книга очищена");
});

// обработка кнопки  проверить локал участника
document.getElementById("local")?.addEventListener("click", () => {
    console.log(localStorage);
});

function renderBookElement(book: any) {
    let html = "";

    for (const [key, valueArray] of Object.entries(book)) {
        html += `<div class="book-element_key">${key}</div>`;
        for (const value of valueArray) {
            html += `<div class="book-element_key_item"> Имя: ${value.name}<br>Вакансия: ${value.job}<br>Телефон: ${value.phone}</div>`;
        }
    }

    document.querySelector(".book_element").innerHTML = html;
}

// функция вывода банера
function renderBaner(text: string) {
    document.querySelector(".Modal_content").innerHTML = text;
    document.querySelector(".Modal")?.classList.add("Modal--appears");
    setTimeout(() => {
        document.querySelector(".Modal_content").innerHTML = text;
        document.querySelector(".Modal")?.classList.toggle("Modal--appears");
    }, 3000);
}

function openBook() {}
