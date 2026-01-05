/*https://www.geeksforgeeks.org/javascript/javascript-calculator/*/

// const display = document.querySelector('.screen p');
// const keys = document.querySelectorAll('.key');
// const theme = document.querySelectorAll('input[name="theme"]');
// const body = document.body;

// let currentInput = '';
// let currentOperation = '';
// let previousInput = '';

// const delBtn = document.querySelector('.key.delete');
// delBtn.addEventListener('click', () => {
//   if (currentInput !== '') {
//     currentInput = currentInput.toString().slice(0, -1);
//     updateDisplay();
//   }
// });

// keys.forEach(key => {
//   key.addEventListener('click', () => {
//     const value = key.textContent;

//     if (value === 'DEL') {
//       currentInput = currentInput.toString().slice(0, -1);
//       updateDisplay();
//       return;
//     }
//   });
// });

// function updateDisplay() {
//   if (currentOperation) {
//     display.textContent = `${previousInput} ${currentOperation === '*' ? 'x' : currentOperation} ${currentInput}`;
//   } else {
//     display.textContent = currentInput || '0';
//   }
// }

// function calculate() {
//   if (previousInput === '' || currentInput === '') return;
//   let result;
//   let prev = parseFloat(previousInput);
//   let current = parseFloat(currentInput);
//   if (isNaN(prev) || isNaN(current)) return;
//   switch (currentOperation) {
//     case '+':
//       result = prev + current;
//       break;
//     case '-':
//       result = prev - current;
//       break;
//     case '*':
//       result = prev * current;
//       break;
//     case '/':
//       if (current === 0) {
//         display.textContent = 'Invalid';
//         currentInput = '';
//         previousInput = '';
//         currentOperation = '';
//         return;
//       }
//       result = prev / current;
//       break;
//     default:
//       return;
//   }
//   currentInput = result.toString();
//   currentOperation = '';
//   previousInput = '';
// }

// keys.forEach(key => {
//   key.addEventListener('click', () => {
//     const value = key.textContent;

//     if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
//       currentInput += value;
//       updateDisplay();
//       return;
//     }

//     if (value === '.') {
//       if (currentInput.includes('.')) return;
//       currentInput += value;
//       updateDisplay();
//       return;
//     }

//     if (['+', '-', '/', 'x'].includes(value)) {
//       let op = value === 'x' ? '*' : value;
//       if (currentInput === '') return;
//       if (previousInput !== '') {
//         calculate();
//         updateDisplay();
//       }
//       currentOperation = op;
//       previousInput = currentInput;
//       currentInput = '';
//       updateDisplay();
//       return;
//     }

//     if (value === '=') {
//       calculate();
//       updateDisplay();
//       return;
//     }

//     if (value === 'RESET') {
//       currentInput = '';
//       previousInput = '';
//       currentOperation = '';
//       updateDisplay();
//       return;
//     }
//   });
// });

// updateDisplay();

// theme.forEach((theme, index) => {
//   theme.addEventListener('change', () => {
//     body.className = `theme-${index + 1}`;
//   });
// });

const display = document.querySelector('.screen p');
const keys = document.querySelectorAll('.key');
const themeInputs = document.querySelectorAll('input[name="theme"]');
const body = document.body;

let currentInput = '';

function updateDisplay() {
  display.textContent = currentInput === '' ? '0' : currentInput;
}

function isOperator(c) {
  return c === '+' || c === '-' || c === 'x' || c === '/';
}

function getOperator(c) {
  if (c === '+' || c === '-') return 1;
  if (c === 'x' || c === '/') return 2;
  return 0;
}

function toString(input) {
  const strings = [];
  let number = '';

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    if ((c >= '0' && c <= '9') || c === '.') {
      number += c;
    } else if (isOperator(c)) {
      if (number !== '') {
        strings.push(number);
        number = '';
      }
      strings.push(c);
    }
  }

  if (number !== '') {
    strings.push(number);
  }

  return strings;
}

function infixToPrefix(strings) {
  const stack = [];
  const result = [];

  for (let i = strings.length - 1; i >= 0; i--) {
    const token = strings[i];

    if (!isNaN(Number(token))) {
      result.push(token);
    } else {
      while (
        stack.length > 0 &&
        getOperator(stack[stack.length - 1]) >= getOperator(token)
      ) {
        result.push(stack.pop());
      }
      stack.push(token);
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop());
  }

  return result.reverse();
}

function prefixCalculator(arr) {
  const stack = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i];

    if (isOperator(v)) {
      const a = stack.pop();
      const b = stack.pop();

      if (v === '+') stack.push(a + b);
      else if (v === '-') stack.push(a - b);
      else if (v === 'x') stack.push(a * b);
      else if (v === '/') {
        if (b === 0) return NaN;
        stack.push(a / b);
      }
    } else {
      stack.push(Number(v));
    }
  }

  return stack[0];
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;
    const last = currentInput[currentInput.length - 1];

    if (value >= '0' && value <= '9') {
      currentInput += value;
      updateDisplay();
      return;
    }

    if (value === '.') {
      if (last === '.' || isOperator(last)) return;
      if (currentInput === '') currentInput = '0';
      currentInput += '.';
      updateDisplay();
      return;
    }

    if (isOperator(value)) {
      if (currentInput === '' || isOperator(last)) return;
      currentInput += value;
      updateDisplay();
      return;
    }

    if (value === 'DEL') {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
      return;
    }

    if (value === 'RESET') {
      currentInput = '';
      updateDisplay();
      return;
    }

    if (value === '=') {
      const tokens = toString(currentInput);
      const prefix = infixToPrefix(tokens);
      const result = prefixCalculator(prefix);

      if (isNaN(result) || !isFinite(result)) {
        currentInput = '';
        display.textContent = 'Invalid';
      } else {
        currentInput = result.toString();
        updateDisplay();
      }
    }
  });
});

themeInputs.forEach((input, index) => {
  input.addEventListener('change', () => {
    body.className = 'theme-' + (index + 1);
  });
});

updateDisplay();
