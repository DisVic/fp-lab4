type Operation = (a: number, b?: number) => number;

const add: Operation = (a, b = 0) => a + b;
const subtract: Operation = (a, b = 0) => a - b;
const multiply: Operation = (a, b = 1) => a * b;
const divide: Operation = (a, b = 1) => (b !== 0 ? a / b : NaN);
const power: Operation = (a, b = 2) => Math.pow(a, b);
const sqrt: Operation = (a) => Math.sqrt(a);

const operations: Record<string, Operation> = {
    add,
    subtract,
    multiply,
    divide,
    power,
    sqrt,
};

let displayValue = ""; // Текущее значение, отображаемое на экране
let currentValue = 0;  // Текущее сохраненное значение для вычисления
let currentOperation: Operation | null = null; // Текущая операция, если выбрана
let operationSymbol = ""; // Символ текущей операции для отображения

// Функция для обновления значения на экране
function updateDisplay(value: string) {
    const display = document.getElementById("display") as HTMLInputElement;
    display.value = value;
}

function updateOperationDisplay(text: string) {
    const operationDisplay = document.getElementById("operation-display");
    if (operationDisplay) {
        operationDisplay.textContent = text;
    }
}

// Обработчик для чисел и точки
function handleNumberInput(value: string) {
    displayValue += value;
    updateDisplay(displayValue);
}

// Обработчик для операций (+, -, *, /, √, ^)
function handleOperation(action: string) {
  if (action === "subtract" && displayValue === "") {
      // Если displayValue пустой и выбрано вычитание, добавляем "-" для отрицательного числа
      displayValue = "-";
      updateDisplay(displayValue);
      return;
  }

  if (action === "sqrt") {
      // Если выбран корень, сразу вычисляем и отображаем результат
      currentValue = parseFloat(displayValue) || 0;
      const newValue = sqrt(currentValue);
      displayValue = newValue.toString();
      updateDisplay(displayValue);
      updateOperationDisplay(`√${currentValue}`);
      return;
  }

  if (currentOperation) calculate(); // Выполнить текущую операцию, если выбрана

  if (action in operations) {
      currentOperation = operations[action];
      operationSymbol = getSymbol(action);
      currentValue = parseFloat(displayValue) || 0;
      displayValue = "";
      updateOperationDisplay(`${currentValue} ${operationSymbol} `);
  }
}

// Получение символа операции для отображения
function getSymbol(action: string) {
    switch (action) {
        case "add": return "+";
        case "subtract": return "-";
        case "multiply": return "×";
        case "divide": return "÷";
        case "power": return "^";
        default: return "";
    }
}

// Выполнение операции и обновление экрана
function calculate() {
  if (currentOperation) {
      const secondValue = parseFloat(displayValue) || 0;
      const newValue = currentOperation(currentValue, secondValue);
      displayValue = newValue.toString();
      updateDisplay(displayValue);
      updateOperationDisplay(`${currentValue} ${operationSymbol} ${secondValue} =`);
      currentOperation = null;
  }
}

// Сброс калькулятора
function clear() {
    displayValue = "";
    currentValue = 0;
    currentOperation = null;
    updateDisplay(displayValue);
    updateOperationDisplay("");
}

// Удаление последнего символа
function backspace() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay(displayValue || "0"); // Отобразить 0, если значение пустое
}

// Инициализация калькулятора
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const target = event.target as HTMLButtonElement;
            const value = target.getAttribute("data-value");
            const action = target.getAttribute("data-action");

            if (value) {
                handleNumberInput(value);
            } else if (action) {
                switch (action) {
                    case "clear":
                        clear();
                        break;
                    case "calculate":
                        calculate();
                        break;
                    case "backspace":
                        backspace();
                        break;
                    default:
                        handleOperation(action);
                        break;
                }
            }
        });
    });
});
