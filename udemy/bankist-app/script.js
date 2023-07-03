'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

let currentUser;

let sorted = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const renderMovements = function (account, sorted = false) {
  let movements = account.movements.slice();
  containerMovements.innerHTML = '';

  if (sorted) {
    movements.sort((a, b) => a - b);
  }

  movements.forEach((value, i) => {
    let type = value > 0 ? 'deposit' : 'withdrawal';

    const newHtml = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${value}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', newHtml);
  });
};

const calcBalance = function (account) {
  account.balance = account.movements.reduce((sum, v) => sum + v, 0);

  labelBalance.textContent = `${account.balance}€`;
};

const calcSummary = function (account) {
  const deposit = account.movements
    .filter(v => v > 0)
    .reduce((sum, v) => sum + v, 0);
  labelSumIn.textContent = `${deposit}€`;

  const withdrawal = account.movements
    .filter(v => v < 0)
    .reduce((sum, v) => sum + v, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;

  const interest = account.movements
    .filter(v => v > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createInitials = function (users) {
  users.forEach(u => {
    u.initials = u.owner
      .toLowerCase()
      .split(' ')
      .reduce((initials, v) => (initials += v[0]), '');
  });
};

createInitials(accounts);

// EVENTS

const updateUI = function (user) {
  renderMovements(user);
  calcBalance(user);
  calcSummary(user);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const user = accounts.find(acc => acc.initials === inputLoginUsername.value);
  const pin = inputLoginPin.value;

  inputLoginUsername.value = inputLoginPin.value = '';

  if (!pin) {
    alert('Pleae enter pin-code');
    return;
  }

  if (!user) {
    alert('User not found!');
    return;
  }

  if (user.pin !== Number(pin)) {
    alert(`Wrong PIN-code!`);
    return;
  }

  containerApp.style.opacity = 100;
  labelWelcome.textContent = `Welcome, ${user.owner.split(' ')[0]}`;
  currentUser = user;
  updateUI(currentUser);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.initials === inputTransferTo.value);
  const transferAmount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (!receiver) {
    alert('User with such name not found!');
    return;
  }

  if (!transferAmount || transferAmount < 0) {
    alert('Incorrect transfer amount');
    return;
  }

  if (transferAmount > currentUser.balance) {
    alert('Not enough funds for this transaction!');
    return;
  }

  currentUser.movements.push(-transferAmount);
  receiver.movements.push(transferAmount);
  updateUI(currentUser);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const confirmName = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';

  if (!confirmName) {
    alert('Please enter user name');
    return;
  }

  if (!confirmPin) {
    alert('Please enter PIN-code!');
    return;
  }

  if (currentUser.initials !== confirmName || currentUser.pin !== confirmPin) {
    alert('Wrong credentials!');
    return;
  }

  const userIndex = accounts.findIndex(
    acc => acc.initials === currentUser.initials
  );

  accounts.splice(userIndex, 1);

  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sorted = !sorted;
  renderMovements(currentUser, sorted);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);

    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
