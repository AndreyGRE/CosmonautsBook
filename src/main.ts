import "./style.css";

document.getElementById("name")?.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    console.log(input.value);
});


document.getElementById("add")?.addEventListener("click", () => {
    const name  = document.getElementById("name")?.value;
    const job = document.getElementById("job")?.value;
    const phone = document.getElementById("phone")?.value;
    console.log(name, job, phone);
});
