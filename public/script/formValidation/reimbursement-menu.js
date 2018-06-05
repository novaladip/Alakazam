const name = document.getElementById("name");
const description = document.getElementById("description");
const descriptionInfo = document.getElementById("descriptionInfo");
const expense = document.getElementById("expense");
const expenseInfo = document.getElementById("expenseInfo");
const date = document.getElementById("date");
const dateInfo = document.getElementById("dateInfo");
const image = document.getElementById("inputFoto");
const imageInfo = document.getElementById("imageInfo");
const submitBtn = document.getElementById("submitBtn");

const formatExpense = amount => amount.toLocaleString("INA");

console.log("in to kiss u");

image.addEventListener("change", e => {
  if (!event.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    image.className = "form-control form-control-lg is-invalid";
    imageInfo.className = "invalid-feedback";
    imageInfo.innerHTML = "Only image file is accepted!";
    submitBtn.disabled = true;
  } else {
    image.className = "form-control form-control-lg is-valid";
    imageInfo.className = "valid-feedback";
    imageInfo.innerHTML = "Seems Good";
    submitBtn.disabled = false;
  }
});

function formValidation() {
  let isValid = true;

  name.className = "form-control form-control-lg is-valid";

  if (description.value == "") {
    description.className = "form-control form-control-lg is-invalid";
    descriptionInfo.className = "invalid-feedback";
    descriptionInfo.innerHTML = "Description field is required";
    isValid = false;
  } else {
    description.className = "form-control form-control-lg is-valid";
    descriptionInfo.className = "valid-feedback";
    descriptionInfo.innerHTML = "Awesome!";
  }

  if (expense.value < 1) {
    expense.className = "form-control form-control-lg is-invalid";
    expenseInfo.className = "invalid-feedback";
    expenseInfo.innerHTML = "Expense field is required";
    isValid = false;
  }
  if (expense.value > 0 && expense.value < 1000) {
    expense.className = "form-control form-control-lg is-invalid";
    expenseInfo.className = "invalid-feedback";
    expenseInfo.innerHTML = "Expense amount is too low ;( min is 1K";
    isValid = false;
  } else if (expense.value > 1000) {
    expense.className = "form-control form-control-lg is-valid";
    expenseInfo.className = "valid-feedback";
    expenseInfo.innerHTML = "Looks nice";
  }

  if (date.value == "") {
    date.className = "form-control form-control-lg is-invalid";
    dateInfo.className = "invalid-feedback";
    dateInfo.innerHTML = "Date field is required";
    isValid = false;
  } else {
    date.className = "form-control form-control-lg is-valid";
    dateInfo.className = "valid-feedback";
    dateInfo.innerHTML = "Seems good";
  }

  if (image.files.length == 0) {
    image.className = "form-control form-control-lg is-invalid";
    imageInfo.className = "invalid-feedback";
    imageInfo.innerHTML = "You should select an image";
    isValid = false;
  }

  if (!isValid) {
    return false;
  }
}
