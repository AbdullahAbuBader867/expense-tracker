// ======================
// ====== Elements ======
// ======================
    // Form
const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const btnAddExpense = document.getElementById("btnAddExpense");
const btnCancelEdite = document.querySelector(".cancel-edite");
    // Message Error
const messageError = document.getElementById("messageError");
const cartUp = document.querySelector(".caret-up");
const errorTitle = document.querySelector(".error-title");
    // Expense List
const containerExpense = document.querySelector(".box-expense");
    // Filters
const filters = document.querySelector(".filters");
const btnsFilter = document.querySelectorAll(".filters button");
    // Search
const searchInput = document.getElementById("searchInput");
    // Summary Panel 
const totalResult = document.getElementById("totalResult");
const counterTransactions = document.getElementById("counterTransactions");
const largestAmount = document.getElementById("largestAmount");
const averagePerTransacton = document.getElementById("averagePerTransacton");
    // Summary Panel breakdown bars
const allBreakdown = document.querySelectorAll(".breakdown-bars > div");
const breakdownFood = document.querySelector(".breakdown-bars .food");
const progressBarFood = document.querySelector(".breakdown-bars .food .progress-bar");
const precentFood = document.querySelector(".breakdown-bars .food .precent-food");

const breakdownTransport = document.querySelector(".breakdown-bars .transport");
const progressBarTransport = document.querySelector(".breakdown-bars .transport .progress-bar");
const precentTransport = document.querySelector(".breakdown-bars .transport .precent-transport");

const breakdownFun = document.querySelector(".breakdown-bars .fun");
const progressBarFun = document.querySelector(".breakdown-bars .fun .progress-bar");
const precentFun = document.querySelector(".breakdown-bars .fun .precent-fun");

const breakdownBills = document.querySelector(".breakdown-bars .bills");
const progressBarBills = document.querySelector(".breakdown-bars .bills .progress-bar");
const precentBills = document.querySelector(".breakdown-bars .bills .precent-bills");

const breakdownOther = document.querySelector(".breakdown-bars .other");
const progressBarOther = document.querySelector(".breakdown-bars .other .progress-bar");
const precentOther = document.querySelector(".breakdown-bars .other .precent-other");
    // sorting
const sorting = document.getElementById("sorting");

// ===================
// ====== State ======
// ===================
    // Initialize boxExpense
let boxExpense = JSON.parse(localStorage.getItem("boxExpense")) ?? localStorage.setItem("boxExpense",JSON.stringify([]));
    // Initialize Category
localStorage.setItem("categoryExpense","food");
let categoryExpense = localStorage.getItem("categoryExpense");
    // Initialize Filter
localStorage.setItem("filterExpense","all");
let filterExpense = localStorage.getItem("filterExpense");
    // Initialize check seacrhing
localStorage.setItem("searching",false);
    // Initialize Variable stopSearch 
let stopSearch;
    // Initialize Form Inputs
resetExpenseForm();
    // Initialize Sort
localStorage.setItem("sortingExpense","Newest first");
    // Initialize First Display Box Expense
if(JSON.parse(localStorage.getItem("boxExpense"))) renderExpenseDashboard();

// ====================
// ====== Events ======
// ====================
    // Main Button to add expense
btnAddExpense.addEventListener("click",(e)=>{
    e.preventDefault();
    // Add new Expense
    if(descriptionInput.value.trim() && Number(amountInput.value.trim()) > 0 && dateInput.value && categoryExpense) {
        addExpense();
        resetExpenseForm();
        renderExpenseDashboard();
    } else handelMessageError();
});
    // Change Category
categoryInput.addEventListener("change",()=>{
    categoryExpense = categoryInput.value;
    // Save Category
    localStorage.setItem("categoryExpense",categoryExpense);
});
    // Reset Message Error
descriptionInput.addEventListener("input",()=>{
    messageError.classList.add("visually-hidden");
    errorTitle.innerHTML = `<i class="fa-solid fa-exclamation bg-warning text-white p-1 rounded-1"></i> This Field Is Required`;
});
amountInput.addEventListener("input",()=>{
    messageError.classList.add("visually-hidden");
    errorTitle.innerHTML = `<i class="fa-solid fa-exclamation bg-warning text-white p-1 rounded-1"></i> This Field Is Required`;
});
dateInput.addEventListener("input",()=>{
    messageError.classList.add("visually-hidden");
    errorTitle.innerHTML = `<i class="fa-solid fa-exclamation bg-warning text-white p-1 rounded-1"></i> This Field Is Required`;
});
    // Get Filter and Saved
filters.addEventListener("click",(e)=>{
    const filter = e.target.closest(".filter");
    // boxExpense = JSON.parse(localStorage.getItem("boxExpense"));
    if(!filter) return;
    // Get Filter
    const filterValue = filter.dataset.filter;
    // Save Filter
    localStorage.setItem("filterExpense",filterValue);
    // display Expense after click on filter
    renderExpenseDashboard();
});
    // add class active on filter
filters.addEventListener("click",(e)=>{
    btnsFilter.forEach(filter=>{
        filter.classList.remove("active");
    });
    e.target.classList.add("active");
});
    // Delete Expense
containerExpense.addEventListener("click",(e)=>{
    const btnDelete = e.target.closest(".btn-delete");
    if(!btnDelete) return;
    const id = btnDelete.dataset.id;
    // delete expense
    boxExpense = boxExpense.filter(expense=> expense.id !== id);
    // Save update(delete expense)
    localStorage.setItem("boxExpense",JSON.stringify(boxExpense));
    // Call Display Box Expense
    renderExpenseDashboard();
});
    // Edite Expense
containerExpense.addEventListener("click",(e)=>{
    const btnEdite = e.target.closest(".btn-edite");
    if(!btnEdite) return;
    // Get Id to this edite
    const id = btnEdite.dataset.id;
    // Get all Data is match the id edite
    const expenseEdite = boxExpense.filter(expense => expense.id === id );
    // Save expenseEdite
    localStorage.setItem("expenseEdite",JSON.stringify(expenseEdite));
    // checkEdite is True
    localStorage.setItem("checkEdite",true);
    // Scroll to Top form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    // Insert Data in inputs
    descriptionInput.value = expenseEdite[0].description;
    amountInput.value = expenseEdite[0].amount;
    categoryInput.value = expenseEdite[0].category; 
    // Update categoryExpense
    localStorage.setItem("categoryExpense",expenseEdite[0].category);
    dateInput.value = expenseEdite[0].date;
    // Show Button Cancel Edite and change content button btnAddExpense into Save Edite
    btnCancelEdite.classList.remove("visually-hidden");
    btnAddExpense.innerHTML = "Save Edite";
});
    // Cancel Edite reset all data Inputs and buttons and checkEdite
btnCancelEdite.addEventListener("click",()=>{
    resetExpenseForm();
});
    // Search Input
searchInput.addEventListener("input",()=>{
    boxExpense = JSON.parse(localStorage.getItem("boxExpense"));
    // cancel a previously scheduled function execution
    clearTimeout(stopSearch);

    const searchValue = searchInput.value.trim().toLowerCase();
    // Check is Searching or no
    if(searchValue.length > 0) localStorage.setItem("searching",true);
    else localStorage.setItem("searching",false);
    // Get result with Search Base on description
    const resultSearch = boxExpense.filter(expense=> expense.description.toLowerCase().includes(searchValue));
    // Save the Result Search
    localStorage.setItem("resultSearch",JSON.stringify(resultSearch));
    // Display all result is match with search after 250ms
    stopSearch = setTimeout(renderExpenseDashboard, 250);
});
    // sorting (Newest first,Oldest first,Highest amount,Lowest amount)
sorting.addEventListener("change",(e)=>{
    const sortValue = sorting.value;
    localStorage.setItem("sortingExpense",sortValue);

    renderExpenseDashboard();
});
// ====================
// ====== Render ======
// ====================
    // Generate Random IDs
function generateId() {
    let id;

    do {
        id = Array.from(
            { length: 4 },
            () => Math.random().toString(36)[2]
        ).join("");
    } while (boxExpense.some(task => task.id === id));

    return id;
};
    // Add Expense
function addExpense() {
    let id;
    const expenseEdite = JSON.parse(localStorage.getItem("expenseEdite"));
    const checkEdite = localStorage.getItem("checkEdite");
    const categoryExpense = localStorage.getItem("categoryExpense");
    const descriptionValue = descriptionInput.value.trim();
    const amountValue = Number(amountInput.value.trim());
    const dateValue = dateInput.value;
    if(checkEdite === "true") {
        id = expenseEdite[0].id;
        // Delete Old Expense
        boxExpense = boxExpense.filter(expense=> expense.id !== id);
        // Save Update
        localStorage.setItem("boxExpense",JSON.stringify(boxExpense));
    }
    else id = generateId();
    boxExpense.push({
        id: id,
        description: descriptionValue,
        amount: amountValue,           // number, always positive
        category: categoryExpense,        // "food" | "transport" | "fun" | "bills" | "other"
        date: dateValue, 
    });
        // Save Expense
    localStorage.setItem("boxExpense",JSON.stringify(boxExpense));
};
    // Handel Errors
function handelMessageError(){
    const amountValue = Number(amountInput.value.trim());
    const dateValue = dateInput.value;

    if(!descriptionInput.value.trim()) messageError.classList.remove("visually-hidden");
    else if(!amountValue) {
        messageError.classList.remove("visually-hidden");
        cartUp.style.cssText = "top:8.9rem; left: 4rem";
        errorTitle.style.cssText = "top:9.4rem; left: 2rem";
    }
    else if(amountValue < 0) {
        messageError.classList.remove("visually-hidden");
        cartUp.style.cssText = "top:8.9rem; left: 4rem";
        errorTitle.style.cssText = "top:9.4rem; left: 2rem";
        errorTitle.innerHTML = `<i class="fa-solid fa-exclamation bg-warning text-white p-1 rounded-1"></i> The Amount Must be Positive`;
    }
    else if(!dateValue) {
        messageError.classList.remove("visually-hidden");
        cartUp.style.cssText = "top:8.9rem; left: 34rem";
        errorTitle.style.cssText = "top:9.4rem; left: 32rem";
    }
    else messageError.classList.add("visually-hidden");
};
    // Reset Inputs and Buttons (btnCancelEdite,btnAddExpense)
function resetExpenseForm(){
    // Get Date this Day
    let date = Date.now();
    date = new Date(date).toISOString().split("T")[0];
    // reset buttons
    btnCancelEdite.classList.add("visually-hidden");
    btnAddExpense.innerHTML = "Add expense";
    // reset inputs
    descriptionInput.value = "";
    amountInput.value = "";
    categoryInput.value = "food";
    dateInput.value = date;
    // Update categoryExpense
    localStorage.setItem("categoryExpense","food");
    // reset checkEdite
    localStorage.setItem("checkEdite",false);
};
    // Render Expense
function renderExpense(boxExpense) {
    containerExpense.innerHTML = "";
    boxExpense.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        containerExpense.innerHTML += ` <div class="expense">
                                            <div class="transaction-header d-flex align-items-center justify-content-between">
                                                <div class="description">${expense.description}</div>
                                                <div class="action">
                                                    <button type="button" class="btn-edite" data-id="${expense.id}">
                                                        <i class="fa-solid fa-pen me-1"></i>
                                                    </button>
                                                    <button type="button" class="btn-delete" data-id="${expense.id}">
                                                        <i class="fa-solid fa-x"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="transaction-details d-flex align-items-center justify-content-between">
                                                <div class=" mt-2">
                                                    <div class="category ${expense.category} d-inline-block px-2 py-1 rounded-1">${expense.category}</div>
                                                    <strong class="amount"> $${expense.amount}</strong>
                                                </div>
                                                <time class="date mt-2">${date}</time>
                                            </div>
                                        </div>`
    });
};
    // Display Box Expense
function renderExpenseDashboard() {
    boxExpense = JSON.parse(localStorage.getItem("boxExpense"));
    filterExpense = localStorage.getItem("filterExpense");
    
    let copySave = [];
    const checkedSearching = localStorage.getItem("searching");
    let resultSearch = JSON.parse(localStorage.getItem("resultSearch"));
    // Swap between boxExpense and resultSearch
    if(checkedSearching === "true") {
        copySave = boxExpense;
        boxExpense = resultSearch;
    }
    // filter Category
    const foodExpense = boxExpense.filter(expense=> expense.category === "food");
    const funExpense = boxExpense.filter(expense=> expense.category === "fun");
    const transportExpense = boxExpense.filter(expense=> expense.category === "transport");
    const billsExpense = boxExpense.filter(expense=> expense.category === "bills");
    const otherExpense = boxExpense.filter(expense=> expense.category === "other");
    // Display Box Expense based on filter and Handel Empty State Expense
    if(filterExpense === "all") {
        sortingExpense(boxExpense);
        renderExpense(boxExpense);
        updateExpenseSummary(boxExpense);
        displayBreakdown();
        if(boxExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses yet. Add your first one above.</div>`;
    }
    else if(filterExpense === "food") {
        sortingExpense(foodExpense);
        renderExpense(foodExpense);
        updateExpenseSummary(foodExpense);
        displayBreakdown();
        if(foodExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses match your filters.</div>`;
    }
    else if(filterExpense === "fun") {
        sortingExpense(funExpense);
        renderExpense(funExpense);
        updateExpenseSummary(funExpense);
        displayBreakdown();
        if(funExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses match your filters.</div>`;
    }
    else if(filterExpense === "transport") {
        sortingExpense(transportExpense);
        renderExpense(transportExpense);
        updateExpenseSummary(transportExpense);
        displayBreakdown();
        if(transportExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses match your filters.</div>`;
    }
    else if(filterExpense === "bills") {
        sortingExpense(billsExpense);
        renderExpense(billsExpense);
        updateExpenseSummary(billsExpense);
        displayBreakdown();
        if(billsExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses match your filters.</div>`;
    }
    else if(filterExpense === "other") {
        sortingExpense(otherExpense);
        renderExpense(otherExpense);
        updateExpenseSummary(otherExpense);
        displayBreakdown();
        if(otherExpense.length === 0) containerExpense.innerHTML = `<div class="empty-state ">No expenses match your filters.</div>`;
    }
    // Display Breakdown 
    function displayBreakdown(){
        if(filterExpense === "all") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const foodPrecentValue = (foodExpense.length/boxExpense.length) * 100;
                const funPrecentValue = (funExpense.length/boxExpense.length) * 100;
                const transportPrecentValue = (transportExpense.length/boxExpense.length) * 100;
                const billsPrecentValue = (billsExpense.length/boxExpense.length) * 100;
                const otherPrecentValue = (otherExpense.length/boxExpense.length) * 100;

                if(foodPrecentValue > 0) {
                    breakdownFood.classList.remove("visually-hidden");
                    progressBarFood.style.cssText = `width: ${foodPrecentValue}%`;
                    precentFood.innerHTML = `${foodPrecentValue.toFixed(2)}%`;
                }
                if(funPrecentValue > 0) {
                    breakdownFun.classList.remove("visually-hidden");
                    progressBarFun.style.cssText = `width: ${funPrecentValue}%`;
                    precentFun.innerHTML = `${funPrecentValue.toFixed(2)}%`;
                }
                if(transportPrecentValue > 0) {
                    breakdownTransport.classList.remove("visually-hidden");
                    progressBarTransport.style.cssText = `width: ${transportPrecentValue}%`;
                    precentTransport.innerHTML = `${transportPrecentValue.toFixed(2)}%`;
                }
                if(billsPrecentValue > 0) {
                    breakdownBills.classList.remove("visually-hidden");
                    progressBarBills.style.cssText = `width: ${billsPrecentValue}%`;
                    precentBills.innerHTML = `${billsPrecentValue.toFixed(2)}%`;
                }
                if(otherPrecentValue > 0) {
                    breakdownOther.classList.remove("visually-hidden");
                    progressBarOther.style.cssText = `width: ${otherPrecentValue}%`;
                    precentOther.innerHTML = `${otherPrecentValue.toFixed(2)}%`;
                }
            }
        }
        else if(filterExpense === "food") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const foodPrecentValue = (foodExpense.length/boxExpense.length) * 100;

                if(foodPrecentValue > 0) {
                    breakdownFood.classList.remove("visually-hidden");
                    progressBarFood.style.cssText = `width: ${foodPrecentValue}%`;
                    precentFood.innerHTML = `${foodPrecentValue.toFixed(2)}%`;
                }
            }
        }
        else if(filterExpense === "fun") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const funPrecentValue = (funExpense.length/boxExpense.length) * 100;

                if(funPrecentValue > 0) {
                    breakdownFun.classList.remove("visually-hidden");
                    progressBarFun.style.cssText = `width: ${funPrecentValue}%`;
                    precentFun.innerHTML = `${funPrecentValue.toFixed(2)}%`;
                }
            }
        }
        else if(filterExpense === "transport") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const transportPrecentValue = (transportExpense.length/boxExpense.length) * 100;

                if(transportPrecentValue > 0) {
                    breakdownTransport.classList.remove("visually-hidden");
                    progressBarTransport.style.cssText = `width: ${transportPrecentValue}%`;
                    precentTransport.innerHTML = `${transportPrecentValue.toFixed(2)}%`;
                }
            }
        }
        else if(filterExpense === "bills") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const billsPrecentValue = (billsExpense.length/boxExpense.length) * 100;

                if(billsPrecentValue > 0) {
                    breakdownBills.classList.remove("visually-hidden");
                    progressBarBills.style.cssText = `width: ${billsPrecentValue}%`;
                    precentBills.innerHTML = `${billsPrecentValue.toFixed(2)}%`;
                }
            }
        }
        else if(filterExpense === "other") {
            if(boxExpense.length > 0) {
                hiddenBreakdown();
                const otherPrecentValue = (otherExpense.length/boxExpense.length) * 100;

                if(otherPrecentValue > 0) {
                    breakdownOther.classList.remove("visually-hidden");
                    progressBarOther.style.cssText = `width: ${otherPrecentValue}%`;
                    precentOther.innerHTML = `${otherPrecentValue.toFixed(2)}%`;
                }
            }
        }
    };
    // Reset data is Swaping
    if(checkedSearching === "true") localStorage.setItem("boxExpense",JSON.stringify(copySave));
};
    // Update Expense Summary
function updateExpenseSummary(expenseSummary){
    const totalAmount = expenseSummary.reduce((sum,expense)=> {return sum + expense.amount},0);
    const numOfTransaction = expenseSummary.length;
    const maxAmount = expenseSummary.reduce((max,expense)=>{return expense.amount > max ? expense.amount: max},0);
    let averageAmount;
    if(totalAmount === 0 || numOfTransaction === 0) averageAmount = "0.00";
    else if(totalAmount > 0 && numOfTransaction > 0) averageAmount = (totalAmount/numOfTransaction).toFixed(2);

    totalResult.innerHTML = `$${totalAmount.toFixed(2)}`;
    counterTransactions.innerHTML = `${numOfTransaction}`;
    averagePerTransacton.innerHTML = `$${averageAmount}`;
    largestAmount.innerHTML = `$${maxAmount.toFixed(2)}`;
};
    // Hidden Breakdown
function hiddenBreakdown() {
    allBreakdown.forEach(breakdown=> breakdown.classList.add("visually-hidden"));
};
    // Sorting Expense
function sortingExpense(sorting) {
    const sort = localStorage.getItem("sortingExpense");
    if(sort === "Newest first") sorting.sort((newest,old)=> old.date.localeCompare(newest.date) || old.amount - newest.amount);
    else if(sort === "Oldest first") sorting.sort((newest,old)=> newest.date.localeCompare(old.date) || old.amount - newest.amount);
    else if(sort === "Highest amount") sorting.sort((newest,old)=> old.amount - newest.amount);
    else if(sort === "Lowest amount") sorting.sort((newest,old)=> newest.amount - old.amount);
};