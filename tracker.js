const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmountEl = document.getElementById("totalAmount");
const entryCountEl = document.getElementById("entryCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const expenseDateInput = document.getElementById("expenseDate");

let expenses = JSON.parse(localStorage.getItem("expenseTrackerItems")) || [];
let total = expenses.reduce((sum, item) => sum + item.amount, 0);

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2//it will show the amount in rs with 2 decimal points.
    }).format(value);
}

function saveExpenses() {
    localStorage.setItem("expenseTrackerItems", JSON.stringify(expenses));
}

function updateSummary() {
    totalAmountEl.textContent = formatCurrency(total);
    entryCountEl.textContent = expenses.length;
}

function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = '<p class="empty-state">No expenses yet. Add your first one.</p>';
        updateSummary();
        return;
    }

    const list = document.createElement("ul");

    expenses.forEach((expense) => {
        const item = document.createElement("li");
        item.className = "expense-item";

        const main = document.createElement("div");
        main.className = "expense-main";

        const title = document.createElement("div");
        title.className = "expense-title";
        title.textContent = expense.name;

        const meta = document.createElement("div");
        meta.className = "expense-meta";
        meta.textContent = `${expense.date} • ${expense.category}`;//it will show the date and category of the expense 
        // in the meta section of the expense item

        const pill = document.createElement("span");
        pill.className = "expense-pill";
        pill.textContent = expense.category;

        const amount = document.createElement("div");
        amount.className = "expense-amount";
        amount.textContent = formatCurrency(expense.amount);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteExpense(expense.id));

        main.appendChild(title);
        main.appendChild(meta);
        main.appendChild(pill);
        item.appendChild(main);
        item.appendChild(amount);
        item.appendChild(deleteBtn);
        list.appendChild(item);
    });

    expenseList.appendChild(list);
    updateSummary();
}

function deleteExpense(id) {
    expenses = expenses.filter((expense) => expense.id !== id);
    total = expenses.reduce((sum, item) => sum + item.amount, 0);
    saveExpenses();
    renderExpenses();
}

function addExpense(event) {
    event.preventDefault();

    const expenseName = document.getElementById("expenseName").value.trim();
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);
    const expenseDate = document.getElementById("expenseDate").value;
    const expenseCategory = document.getElementById("expenseCategory").value;

    if (!expenseName || Number.isNaN(expenseAmount) || expenseAmount <= 0 || !expenseDate || !expenseCategory) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    const expense = {
        id: Date.now(),
        name: expenseName,
        amount: expenseAmount,
        date: expenseDate,
        category: expenseCategory
    };

    expenses.unshift(expense);
    total += expense.amount;
    saveExpenses();
    renderExpenses();
    expenseForm.reset();
    expenseDateInput.value = new Date().toISOString().split("T")[0];
    document.getElementById("expenseName").focus();
}

clearAllBtn.addEventListener("click", () => {
    if (expenses.length === 0) {
        return;
    }

    if (confirm("Clear all expenses?")) {
        expenses = [];
        total = 0;
        saveExpenses();
        renderExpenses();
    }
});

expenseForm.addEventListener("submit", addExpense);

expenseDateInput.value = new Date().toISOString().split("T")[0];
renderExpenses();
