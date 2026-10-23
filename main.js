const buttonValues = [
  'AC',
  'del',
  '+/-',
  '%',
  '÷',
  '7',
  '8',
  '9',
  'x',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '=',
  '10%',
  '15%',
  '20%',
  '25%',
];

const rightSymbols = ['÷', 'x', '-', '+', '='];
const topSymbols = ['AC', 'del', '+/-', '%'];
const bottomSymbols = ['10%', '15%', '20%', '25%'];

const display = document.getElementById('display');
display.value = '0';

// Tip/Total UI
const billEl = document.getElementById('bill-amount');
const tipEl = document.getElementById('tip-amount');
const totalEl = document.getElementById('total-amount');
const tipResults = document.getElementById('tip-results');

// Expression line UI
const exprEl = document.getElementById('expr-line');
const setExpr = (a, op, b = '') => {
  if (!exprEl) return;
  const left = a !== '' ? String(+a) : '';
  const right = b !== '' ? String(+b) : '';
  exprEl.textContent = right ? `${left} ${op} ${right}` : `${left} ${op}`;
};
const clearExpr = () => {
  if (exprEl) exprEl.textContent = '';
};

// Formatter
const fmt = (n) => Number(n).toFixed(2);

// UI helpers
function updateTipUI(bill, tip, total) {
  billEl.textContent = `Bill: $${fmt(bill)}`;
  tipEl.textContent = `Tip: $${fmt(tip)}`;
  totalEl.textContent = `Total: $${fmt(total)}`;
  tipResults.classList.add('show');
}
function clearTipUI() {
  billEl.textContent = '';
  tipEl.textContent = '';
  totalEl.textContent = '';
  tipResults.classList.remove('show');
}

// Calculator state
let A = 0;
let operator = null;
let B = null;
let lastBill = null;
let enteringNewBill = true;

function clearAll() {
  A = 0;
  operator = null;
  B = null;
}

// Build buttons
for (let value of buttonValues) {
  const button = document.createElement('button');
  button.innerText = value;

  if (value === '0') {
    button.classList.add('zero-btn');
  }

  if (value === 'AC') {
    button.classList.add('clear-btn');
  }

  // Visual styles belong in CSS, not inline JavaScript.
  if (rightSymbols.includes(value)) button.classList.add('operator-btn');
  else if (topSymbols.includes(value)) button.classList.add('utility-btn');
  else if (bottomSymbols.includes(value)) button.classList.add('tip-btn');
  button.type = 'button';
  button.setAttribute(
    'aria-label',
    value === 'del' ? 'Delete' : value === 'AC' ? 'All clear' : value,
  );

  button.addEventListener('click', function () {
    // OPERATORS
    if (rightSymbols.includes(value)) {
      if (value === '=') {
        if (operator && display.value !== '') {
          B = display.value;
          const numA = Number(A);
          const numB = Number(B);
          let result;

          switch (operator) {
            case '÷':
              result = numA / numB;
              break;
            case 'x':
              result = numA * numB;
              break;
            case '-':
              result = numA - numB;
              break;
            case '+':
              result = numA + numB;
              break;
          }

          display.value = Number.isFinite(result)
            ? Number.isInteger(result)
              ? String(result)
              : result.toFixed(2)
            : 'Error';

          clearAll();
          clearExpr();
        }
      } else {
        if (operator && display.value !== '') {
          const acc = Number(A);
          const rhs = Number(display.value);
          let interim;

          switch (operator) {
            case '÷':
              interim = acc / rhs;
              break;
            case 'x':
              interim = acc * rhs;
              break;
            case '-':
              interim = acc - rhs;
              break;
            case '+':
              interim = acc + rhs;
              break;
          }

          A = Number.isFinite(interim)
            ? String(Number.isInteger(interim) ? interim : +interim.toFixed(2))
            : '0';

          setExpr(A, value);
          display.value = '0';
        } else {
          A = display.value;
          setExpr(A, value);
          display.value = '0';
        }

        operator = value;
      }

      // TOP BUTTONS
    } else if (topSymbols.includes(value)) {
      if (value === 'AC') {
        clearAll();
        display.value = '0';
        lastBill = null;
        enteringNewBill = true;
        clearTipUI();
        clearExpr();
      } else if (value === 'del') {
        if (display.value === 'Error') {
          display.value = '0';
          return;
        }

        if (display.value.length > 1) {
          display.value = display.value.slice(0, -1);
          if (
            display.value === '-' ||
            display.value === '' ||
            display.value === '0.'
          ) {
            display.value = '0';
          }
        } else {
          display.value = '0';
        }
      } else if (value === '+/-') {
        if (display.value !== '0') {
          display.value =
            display.value[0] === '-'
              ? display.value.slice(1)
              : '-' + display.value;
        }
      } else if (value === '%') {
        const n = Number(display.value);
        if (Number.isFinite(n)) display.value = String(n / 100);
      }

      // TIP BUTTONS
    } else if (bottomSymbols.includes(value)) {
      // Save the bill only when entering a new amount
      if (enteringNewBill || lastBill === null) {
        const base = Number(display.value);

        if (!Number.isFinite(base)) return;

        lastBill = base;
        enteringNewBill = false;
      }

      // Always calculate from the original bill
      const pct = Number(value.slice(0, -1)) / 100;

      // Convert the bill to integer cents
      const billCents = Math.round(lastBill * 100);
      const percent = Number(value.slice(0, -1));

      // Calculate the tip in cents
      const tipCents = Math.round((billCents * percent) / 100);

      // Convert back to dollars
      const tip = tipCents / 100;
      const total = (billCents + tipCents) / 100;

      display.value = tip.toFixed(2);

      updateTipUI(lastBill, tip, total);

      clearAll();
      clearExpr();

      // NUMBERS & DOT
    } else {
      if (!enteringNewBill) {
        display.value = '0';
        lastBill = null;
        enteringNewBill = true;
        clearTipUI();
      }

      if (value === '.') {
        if (display.value === '0') {
          display.value = '0.';
        } else if (!display.value.includes('.')) {
          display.value += '.';
        }
      } else {
        if (display.value === '0') {
          display.value = value;
        } else {
          display.value += value;
        }
      }
    }
    fitDisplayText();
  });

  document.getElementById('buttons').appendChild(button);
}

// Move tip buttons into the left panel in landscape.
// Keep the same button elements and event listeners.
const keypad = document.getElementById('buttons');
const landscapeTips = document.getElementById('landscape-tips');
const landscapeQuery = window.matchMedia(
  '(orientation: landscape) and (max-height: 570px)',
);

function arrangeTipButtons() {
  const tipButtons = Array.from(document.querySelectorAll('.tip-btn'));

  if (landscapeQuery.matches) {
    tipButtons.forEach((button) => landscapeTips.appendChild(button));
  } else {
    tipButtons.forEach((button) => keypad.appendChild(button));
  }

  fitDisplayText();
}

landscapeQuery.addEventListener('change', arrangeTipButtons);

// Fit long numeric results inside the available display width.
// The calculator's math is unchanged; this adjusts only the font size.
const displayCanvas = document.createElement('canvas');
const displayContext = displayCanvas.getContext('2d');
function fitDisplayText() {
  const available = Math.max(0, display.clientWidth - 8);
  if (!available || !displayContext) return;
  const style = getComputedStyle(display);
  const baseSize = landscapeQuery.matches
    ? 42
    : Math.min(76, Math.max(32, window.innerWidth * 0.11));
  let size = baseSize;
  const family = style.fontFamily;
  const text = display.value || '0';
  while (size > 16) {
    displayContext.font = `${size}px ${family}`;
    if (displayContext.measureText(text).width <= available) break;
    size -= 1;
  }
  display.style.fontSize = `${size}px`;
}
window.addEventListener('resize', fitDisplayText);
arrangeTipButtons();

// PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('SW registration failed:', err));
  });
}
