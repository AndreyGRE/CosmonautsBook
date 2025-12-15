import "./style.css";

interface Person {
    name: string;
    job: string;
    phone: string;
}

interface PhoneBook {
    [key: string]: Person[];
}

interface ValidationResult {
    isValid: boolean;
    normalizedPhone?: string;
    error?: string;
}

document.addEventListener("DOMContentLoaded", () => {
    let book = JSON.parse(localStorage.getItem("book") || "{}");
    renderBookElement(book);
});

document.getElementById("name")?.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    console.log(input.value);
});

// обработка кнопки добавить участника
document.getElementById("add")?.addEventListener("click", () => {
    const nameInput = document.getElementById(
        "name"
    ) as HTMLInputElement | null;
    const jobInput = document.getElementById("job") as HTMLInputElement | null;
    const phoneInput = document.getElementById(
        "phone"
    ) as HTMLInputElement | null;

    if (!nameInput || !jobInput || !phoneInput) return;

    const name = nameInput.value;
    const job = jobInput.value;
    const phone = phoneInput.value;

    // валидация полей
    const result = validation(name, job, phone);
    if (!result.isValid) {
        renderBaner(result.error!);
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

    nameInput.value = "";
    jobInput.value = "";
    phoneInput.value = "";

    renderBaner("Участник добавлен");
    renderBookElement(book);
});

// обработка кнопки очистить книгу
document.getElementById("clear")?.addEventListener("click", () => {
    localStorage.clear();
    renderBookElement();
    renderBaner("Книга очищена");
});

// обработка кнопки  проверить локал участника
document.getElementById("local")?.addEventListener("click", () => {
    let book = JSON.parse(localStorage.getItem("book") || "{}");
    renderBookElement(book);
    console.log(localStorage);
});

// обработка кнопки открытия поиска
document.getElementById("search")?.addEventListener("click", () => {
    const ModslSerch = document.querySelector(".ModalSerch");
    ModslSerch?.classList.add("ModalSerch--open");
});
// --- функция для получения текущего результата поиска ---
function getCurrentSearchResult(): Person[] {
    const input = document.getElementById(
        "ModalSerch-content-search-panel-input"
    ) as HTMLInputElement;
    const searchValue = input.value.toLowerCase().trim();
    const book = JSON.parse(localStorage.getItem("book") || "{}");
    const result: Person[] = [];

    for (const key in book) {
        for (const person of book[key]) {
            if (
                person.name.toLowerCase().includes(searchValue) ||
                person.phone.toLowerCase().includes(searchValue)
            ) {
                result.push(person);
            }
        }
    }

    return result;
}

// --- функция рендера результатов поиска ---
function renderSearchResults(result: Person[]) {
    const container = document.querySelector(".ModalSerch-content-result")!;
    container.innerHTML = "";

    if (result.length === 0) {
        container.textContent = "Ничего не найдено";
        return;
    }

    result.forEach((person) => {
        const item = document.createElement("div");
        item.classList.add("ModalSerch-content-result-item");

        const nameEl = document.createElement("div");
        nameEl.textContent = `Имя: ${person.name}`;
        const jobEl = document.createElement("div");
        jobEl.textContent = `Вакансия: ${person.job}`;
        const phoneEl = document.createElement("div");
        phoneEl.textContent = `Телефон: ${person.phone}`;

        const EditDel = document.createElement("div");
        EditDel.classList.add("ModalSerch-content-result-item-EditDel");

        // Редактировать
        const Edit = document.createElement("button");
        Edit.textContent = "Редактировать ✏️";
        Edit.addEventListener("click", () => openEditModal(person));

        // Удалить
        const Del = document.createElement("button");
        Del.textContent = "Удалить 🗑";
        Del.addEventListener("click", () => {
            deletePerson(person);
            renderSearchResults(getCurrentSearchResult()); // обновляем результаты
        });

        EditDel.append(Edit, Del);
        item.append(nameEl, jobEl, phoneEl, EditDel);
        container.appendChild(item);
    });
}

// --- обработчик кнопки поиска ---
document
    .getElementById("ModalSerch-content-search-panel-btn")
    ?.addEventListener("click", () => {
        const input = document.getElementById(
            "ModalSerch-content-search-panel-input"
        ) as HTMLInputElement;

        if (!input.value.trim()) {
            renderBaner("Введите значение для поиска");
            return;
        }

        const result = getCurrentSearchResult();
        renderSearchResults(result);
    });
// обработка кнопки закрытия  поиска
function openEditModal(person: Person) {
    const modal = document.createElement("div");
    modal.classList.add("ModalEdit");

    const nameInput = document.createElement("input");
    nameInput.value = person.name;
    const jobInput = document.createElement("input");
    jobInput.value = person.job;
    const phoneInput = document.createElement("input");
    phoneInput.value = person.phone;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Сохранить";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Закрыть";

    modal.append(nameInput, jobInput, phoneInput, saveBtn, closeBtn);
    document.body.appendChild(modal);

    // закрытие модалки
    closeBtn.addEventListener("click", () => {
        modal.remove();
    });

    //  сохранение изменений
    saveBtn.addEventListener("click", () => {
        const book = JSON.parse(localStorage.getItem("book") || "{}");
        const letterOld = person.name[0].toUpperCase();

        if (book[letterOld]) {
            // удаляем старый объект
            book[letterOld] = book[letterOld].filter(
                (p: Person) =>
                    !(p.name === person.name && p.phone === person.phone)
            );
            if (book[letterOld].length === 0) delete book[letterOld];
        }

        //  новый объект
        const updatedPerson = {
            name: nameInput.value,
            job: jobInput.value,
            phone: phoneInput.value,
        };

        const letterNew = updatedPerson.name[0].toUpperCase();
        if (!book[letterNew]) book[letterNew] = [];
        book[letterNew].push(updatedPerson);

        localStorage.setItem("book", JSON.stringify(book));

        modal.remove();

        // обновляем результаты поиска
        const SerchInput = document.getElementById(
            "ModalSerch-content-search-panel-input"
        ) as HTMLInputElement;

        const searchValue = SerchInput.value.toLowerCase().trim();
        const newResult: Person[] = [];
        for (const key in book) {
            for (const p of book[key]) {
                if (
                    p.name.toLowerCase().includes(searchValue) ||
                    p.phone.toLowerCase().includes(searchValue)
                ) {
                    newResult.push(p);
                }
            }
        }

        renderSearchResults(newResult);
    });
}
document
    .getElementById("ModalSerch-content-close")
    ?.addEventListener("click", () => {
        const ModslSerch = document.querySelector(".ModalSerch");
        ModslSerch?.classList.remove("ModalSerch--open");
    });

function renderBookElement(book?: PhoneBook) {
    const container = document.querySelector(".book_element");
    if (!container) return;
    container.innerHTML = "";

    if (!book) return;

    // Сортируем ключи по алфавиту
    const sortedLetters = Object.keys(book).sort((a, b) =>
        a.localeCompare(b, "ru")
    );

    sortedLetters.forEach((letter) => {
        const letterEl = document.createElement("div");
        letterEl.classList.add("book_element_item");

        const itemElNameDiv = document.createElement("div");
        itemElNameDiv.textContent = ` ${letter}`;
        itemElNameDiv.classList.add("book_element_item_key");
        itemElNameDiv.classList.add("book_element_item_key--hover");

        const arrow = document.createElement("span");
        arrow.textContent = " ▼";
        arrow.classList.add("toggle-arrow");
        itemElNameDiv.appendChild(arrow);

        const itemElNameDivVac = document.createElement("div");
        itemElNameDivVac.classList.add("book_element_item_value");

        container.appendChild(letterEl);
        letterEl.appendChild(itemElNameDiv);
        letterEl.appendChild(itemElNameDivVac);

        itemElNameDiv.addEventListener("click", () => {
            itemElNameDivVac.classList.toggle("book_element_item_value--open");
            arrow.textContent = itemElNameDivVac.classList.contains(
                "book_element_item_value--open"
            )
                ? " ►"
                : " ▼";
        });
        let count = 0;

        // Список контактов под буквой
        book[letter].forEach((item: Person) => {
            count += 1;
            const ItemVac = document.createElement("div");
            ItemVac.classList.add("book_element_item_value_item");

            const itemElName = document.createElement("div");
            itemElName.textContent = `Имя: ${item.name}`;
            const itemElJob = document.createElement("div");
            itemElJob.textContent = `Вакансия:${item.job}`;
            const itemElPhone = document.createElement("div");
            itemElPhone.textContent = `Номер: ${item.phone}`;
            const Delete = document.createElement("div");
            Delete.textContent = `🗑`;
            Delete.addEventListener("click", () => {
                deletePerson(item);
                renderBookElement();
            });
            ItemVac.append(itemElName, itemElJob, itemElPhone, Delete);

            itemElNameDivVac.appendChild(ItemVac);
        });
        const spnaCount = document.createElement("span");
        spnaCount.textContent = `(${count})`;
        itemElNameDiv.appendChild(spnaCount);
    });
}

// удаление
function deletePerson(person: Person) {
    const book = JSON.parse(localStorage.getItem("book") || "{}");
    const letter = person.name[0].toUpperCase();

    if (book[letter]) {
        book[letter] = book[letter].filter(
            (p: Person) => !(p.name === person.name && p.phone === person.phone)
        );
        if (book[letter].length === 0) delete book[letter];
        localStorage.setItem("book", JSON.stringify(book));
    }
}
// функция вывода банера
function renderBaner(text: string) {
    const modalContent = document.querySelector(".Modal_content");
    const modal = document.querySelector(".Modal");

    if (!modalContent || !modal) return; // безопасно выходим, если элементов нет

    modalContent.innerHTML = text;
    modal.classList.add("Modal--appears");

    setTimeout(() => {
        modal.classList.remove("Modal--appears");
    }, 3000);
}

function validation(
    name: unknown,
    job: unknown,
    phone: unknown
): ValidationResult {
    function isNonEmptyString(val: unknown): val is string {
        return typeof val === "string" && val.trim() !== "";
    }

    if (!isNonEmptyString(name)) {
        return { isValid: false, error: "Введите имя" };
    }
    if (!isNonEmptyString(job)) {
        return { isValid: false, error: "Введите должность" };
    }
    if (!isNonEmptyString(phone)) {
        return { isValid: false, error: "Введите номер телефона" };
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return {
            isValid: false,
            error: "Имя должно содержать от 2 до 50 символов",
        };
    }

    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ]+(?:[-'][a-zA-Zа-яА-ЯёЁ]+)*$/;
    if (!nameRegex.test(trimmedName)) {
        return {
            isValid: false,
            error: "Имя может содержать только буквы, дефис и апостроф",
        };
    }

    const trimmedJob = job.trim();
    if (trimmedJob.length < 2 || trimmedJob.length > 100) {
        return {
            isValid: false,
            error: "Должность должна содержать от 2 до 100 символов",
        };
    }

    const jobRegex = /^[\p{L}\s\-.']+$/u;
    if (!jobRegex.test(trimmedJob)) {
        return {
            isValid: false,
            error: "Должность может содержать только буквы, пробелы, дефис и точку",
        };
    }

    const digits = phone.replace(/\D/g, "");

    let normalizedPhone: string | null = null;

    if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
        normalizedPhone = `+7 ${digits.slice(1, 4)} ${digits.slice(
            4,
            7
        )}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length === 10) {
        normalizedPhone = `+7 ${digits.slice(0, 3)} ${digits.slice(
            3,
            6
        )}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }

    if (!normalizedPhone) {
        return {
            isValid: false,
            error: "Введите номер в формате 71234567890 или 81234567890",
        };
    }

    return {
        isValid: true,
        normalizedPhone,
    };
}
