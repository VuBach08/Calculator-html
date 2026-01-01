/*https://www.geeksforgeeks.org/javascript/javascript-calculator/*/
const display = document.querySelector('.screen p');
const keys = document.querySelectorAll('.key');
const theme = document.querySelectorAll('input[name="theme"]');
const body = document.body;

let currentInput = '';
let currentOperation = '';
let previousInput = '';

const delBtn = document.querySelector('.key.delete');
delBtn.addEventListener('click', () => {
  if (currentInput !== '') {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
  }
});

keys.forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;

    if (value === 'DEL') {
      currentInput = currentInput.toString().slice(0, -1);
      updateDisplay();
      return;
    }
  });
});

function updateDisplay() {
  if (currentOperation) {
    display.textContent = `${previousInput} ${currentOperation === '*' ? 'x' : currentOperation} ${currentInput}`;
  } else {
    display.textContent = currentInput || '0';
  }
}

function calculate() {
  if (previousInput === '' || currentInput === '') return;
  let result;
  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(current)) return;
  switch (currentOperation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        display.textContent = 'Invalid';
        currentInput = '';
        previousInput = '';
        currentOperation = '';
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }
  currentInput = result.toString();
  currentOperation = '';
  previousInput = '';
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
      currentInput += value;
      updateDisplay();
      return;
    }

    if (value === '.') {
      if (currentInput.includes('.')) return;
      currentInput += value;
      updateDisplay();
      return;
    }

    if (['+', '-', '/', 'x'].includes(value)) {
      let op = value === 'x' ? '*' : value;
      if (currentInput === '') return;
      if (previousInput !== '') {
        calculate();
        updateDisplay();
      }
      currentOperation = op;
      previousInput = currentInput;
      currentInput = '';
      updateDisplay();
      return;
    }

    if (value === '=') {
      calculate();
      updateDisplay();
      return;
    }

    if (value === 'RESET') {
      currentInput = '';
      previousInput = '';
      currentOperation = '';
      updateDisplay();
      return;
    }
  });
});

updateDisplay();

theme.forEach((theme, index) => {
  theme.addEventListener('change', () => {
    body.className = `theme-${index + 1}`;
  });
});