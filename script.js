const display = document.querySelector("#display");
const expressionText = document.querySelector("#expression");
const keys = document.querySelector(".keys");

let expression = "";
const operators = "+-*/%";

const pretty = (value) => value.replaceAll("*", "×").replaceAll("/", "÷").replaceAll("-", "−");

function update() {
    display.textContent = expression || "0";
    expressionText.textContent = expression ? pretty(expression) : "";
}

function add(value) {
    const last = expression.at(-1);

    if (value === "." && expression.split(/[+\-*/%]/).pop().includes(".")) return;
    if (operators.includes(value) && operators.includes(last)) {
        expression = expression.slice(0, -1);
    }
    if (!expression && operators.includes(value) && value !== "-") return;

    expression += value;
    update();
}

function calculate() {
    if (!expression || operators.includes(expression.at(-1))) return;

    try {
        if (!/^[\d+\-*/%. ]+$/.test(expression)) throw new Error();

        const result = Function(`"use strict"; return (${expression})`)();
        if (!Number.isFinite(result)) throw new Error();

        expressionText.textContent = pretty(expression);
        expression = Number(result.toFixed(10)).toString();
        display.textContent = expression;
    } catch {
        display.textContent = "Ошибка";
        expression = "";
    }
}

function handle(action, value) {
    if (value) add(value);
    if (action === "clear") expression = "";
    if (action === "delete") expression = expression.slice(0, -1);
    if (action === "calculate") calculate();
    if (action !== "calculate") update();
}

keys.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) handle(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^\d$/.test(key) || operators.includes(key) || key === ".") handle(null, key);
    if (key === "Enter" || key === "=") handle("calculate");
    if (key === "Backspace") handle("delete");
    if (key === "Escape") handle("clear");
});

update();
