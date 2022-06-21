'use strict'

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jafar Sadique',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2021-11-18T21:31:17.178Z',
        '2021-12-23T07:42:02.383Z',
        '2022-03-28T09:15:04.904Z',
        '2022-04-01T10:17:24.185Z',
        '2022-04-22T14:11:59.604Z',
        '2022-06-13T17:01:17.194Z',
        '2022-06-15T23:36:17.929Z',
        '2022-06-19T10:51:36.790Z',
    ],
    currency: 'GBP',
    locale: 'en-GB', // de-DE
}

const account2 = {
    owner: 'Iftekhar Uddin Ahmed',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2021-11-13T13:15:33.035Z',
        '2021-12-24T09:48:16.867Z',
        '2021-12-31T06:04:23.907Z',
        '2022-01-25T14:18:46.235Z',
        '2022-02-05T16:33:06.386Z',
        '2022-04-10T14:43:26.374Z',
        '2022-05-25T18:49:59.371Z',
        '2022-06-18T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
}

const accounts = [account1, account2]

/////////////////////////////////////////////////
////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')

///////////////////////////////////////////
//////////////////////////////////////////

// Functionality of the bankist app

// Movement Dates
const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 24 * 60 * 60))

    const daysPassed = calcDaysPassed(new Date(), date)
    // console.log(daysPassed)

    if (daysPassed === 0) return 'Today'
    if (daysPassed === 1) return 'Yesterday'
    if (daysPassed <= 7) return `${daysPassed} days ago`
    else {
        return new Intl.DateTimeFormat(locale).format(date)
    }
}

// Formatted Numbers
const formatCurrency = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value)
}

// Displaying movements
const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = ''

    // Sorting the movements array
    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements

    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal'

        // Date functionality
        const date = new Date(acc.movementsDates[i])
        const displayDate = formatMovementDate(date, acc.locale)

        const formattedMov = formatCurrency(mov, acc.locale, acc.currency)

        // Printing movements to the App
        const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
          </div>`

        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}

// Displaying current balance
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)

    const formattedBalance = formatCurrency(acc.balance, acc.locale, acc.currency)

    labelBalance.textContent = formattedBalance
}

// Calculating the incomeing and outgoing balance
const calcDisplaySummery = function (acc) {

    // Income Summery
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0)
    
    const formattedIN = formatCurrency(incomes, acc.locale, acc.currency)
    labelSumIn.textContent = formattedIN

    // Outgoing Summery
    const outgoing = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0)
    
    const formattedOut = formatCurrency(Math.abs(outgoing), acc.locale, acc.currency)
    labelSumOut.textContent = formattedOut

    // Interest rate summery
    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0)
    
    const formattedInterest = formatCurrency(interest, acc.locale, acc.currency)
    labelSumInterest.textContent = formattedInterest
}

// User Account Creation
const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(user => user[0])
            .join('')
    })
}
createUsernames(accounts)

// Updationg UI
const updateUI = function (acc) {
    // Display movements
    displayMovements(acc)

    // Display balance
    calcDisplayBalance(acc)

    // Display summery
    calcDisplaySummery(acc)
}

/////////////////////////////////////
////////////////////////////////////
// Event Handlers
let currentAccount

// FAKE ALWAYS LOGIN
currentAccount = account1
updateUI(currentAccount)
containerApp.style.opacity = 100


// Login event handler
btnLogin.addEventListener('click', function (e) {
    e.preventDefault() // Prevent form from submitting

    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    )

    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`

        // Showing the account
        containerApp.style.opacity = 100

        // Create International current date and time
        const now = new Date()
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        }

        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now)

        // Clear the input fields
        inputLoginUsername.value = inputLoginPin.value = ''
        inputLoginPin.blur()

        updateUI(currentAccount)
    }
})

// Transfering Money
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault()

    const amount = +inputTransferAmount.value
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    ) // Checks the username for transfer is valid or not.

    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // Transfer Process
        currentAccount.movements.push(-amount)
        receiverAcc.movements.push(amount)

        // Add date and time
        currentAccount.movementsDates.push(new Date().toISOString())
        receiverAcc.movementsDates.push(new Date().toISOString())

        // Update UI
        updateUI(currentAccount)
    }

    // Cleaning the input fields
    inputTransferAmount.value = inputTransferTo.value = ''
})

// Loan Evant Handler
btnLoan.addEventListener('click', function (e) {
    e.preventDefault()

    const amount = Math.floor(inputLoanAmount.value)

    if (
        amount > 0 &&
        currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
        // Adding the loan amount
        currentAccount.movements.push(amount)

        // Add date
        currentAccount.movementsDates.push(new Date().toISOString())

        // Updating UI
        updateUI(currentAccount)
    }

    inputLoanAmount.value = ''
    inputLoanAmount.blur()
})

// Closing account event handler
btnClose.addEventListener('click', function (e) {
    e.preventDefault()

    const user = inputCloseUsername.value
    const pin = +inputClosePin.value

    if (user === currentAccount.username && pin === currentAccount.pin) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        )

        // Delete account
        accounts.splice(index, 1)

        // Hide the account
        containerApp.style.opacity = 0
    }

    inputCloseUsername.value = inputClosePin.value = ''
    inputClosePin.blur()
})

// Sort Event Handler
let sorted = false
btnSort.addEventListener('click', function (e) {
    e.preventDefault()

    displayMovements(currentAccount.movements, !sorted)
    sorted = !sorted
})


