const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
  signDisplay: "always",
});

const list = document.getElementById("transaction-list");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

form.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        const response = JSON.parse(xhttp.responseText);

        if (response.error) {
            alert("Error: " + response.error);
        } else {
            form.reset();

            updateTotal();
            renderList();
        }
    };

    xhttp.open("POST", "http://localhost:3030/expenses");
    xhttp.send(JSON.stringify({
        amount: parseFloat(form.amount.value),
        type: form.type.value,
        description: form.description.value,
        date: new Date(form.date.value),
    }));
};

function updateTotal() {
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function () {        
        const response = JSON.parse(xhttp.responseText);

        const transactions = response.expenses;

        const incomeTotal = transactions
                .filter((trx) => trx.type === "income")
                .reduce((total, trx) => total + trx.amount, 0);

        const expenseTotal = transactions
            .filter((trx) => trx.type === "expense")
            .reduce((total, trx) => total + trx.amount, 0);

        const balanceTotal = incomeTotal - expenseTotal;

        balance.textContent = formatter.format(balanceTotal).substring(1);
        income.textContent = formatter.format(incomeTotal);
        expense.textContent = formatter.format(expenseTotal * -1);
    };

    xhttp.open("GET", "http://localhost:3030/expenses");
    xhttp.send();
}

function deleteTransaction(id) {    
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        const response = JSON.parse(xhttp.responseText);

        if (response.error) {
            alert("Error: " + response.error);
        } 

        updateTotal();
        renderList();
    };

    xhttp.open("DELETE", `http://localhost:3030/expenses?id=${id}`);
    xhttp.send();
}


function renderList() {
    const xhttp = new XMLHttpRequest();

    list.innerHTML = "";

    xhttp.onload = function () {        
        const response = JSON.parse(xhttp.responseText);

        const transactionList = document.getElementById("transaction-list");

        status.textContent = "";
        if (response.expenses.length === 0) {
            status.textContent = "No transactions.";
            return;
        }

        response.expenses.forEach(expense => {
            const sign = "income" === expense.type ? 1 : -1;

            const li = document.createElement("li");

            li.innerHTML = `
            <div class="name">
                <h4>${expense.description}</h4>
                <p>${new Date(expense.date).toLocaleDateString()}</p>
            </div>

            <div class="amount ${expense.type}">
                <span>${formatter.format(expense.amount * sign)}</span>
            </div>
            
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${expense.id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        `;
        
            transactionList.appendChild(li);
        });
    };

    xhttp.open("GET", "http://localhost:3030/expenses");
    xhttp.send();
}

renderList();
updateTotal();