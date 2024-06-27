// GET all expenses data from /expenses API
const xhttp = new XMLHttpRequest();

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

xhttp.onload = function () {
    const response = JSON.parse(xhttp.responseText);

    const transactionList = document.getElementById("transaction-list");

    response.expenses.forEach(expense => {
        const sign = "income" === type ? 1 : -1;

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