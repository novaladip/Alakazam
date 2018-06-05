const name = document.getElementById("name");
const nameInfo = document.getElementById("nameInfo");
const email = document.getElementById("email");
const emailInfo = document.getElementById("emailInfo");
const role = document.getElementById("role");
const roleInfo = document.getElementById("roleInfo");
const password = document.getElementById("password");
const passwordInfo = document.getElementById("passwordInfo");
const password2 = document.getElementById("password2");
const password2Info = document.getElementById("password2Info");

const formValidation = () => {
  let isValid = true;
  if (name.value == "") {
    name.className = "form-control form-control-lg is-invalid";
    nameInfo.className = "invalid-feedback";
    isValid = false;
  } else if (name.value.length >= 2 && name.value.length <= 45) {
    name.className = "form-control form-control-lg is-valid";
    nameInfo.className = "valid-feedback";
    nameInfo.innerHTML = "What a beautiful name!";
  } else {
    name.className = "form-control form-control-lg is-invalid";
    nameInfo.className = "invalid-feedback";
    nameInfo.innerHTML = "Name length must be between 2 and 45";
    isValid = false;
  }

  if (email.value == "") {
    email.className = "form-control form-control-lg is-invalid";
    emailInfo.className = "invalid-feedback";
    isValid = false;
  } else {
    email.className = "form-control form-control-lg is-valid";
  }

  if (
    role.value === "Programmer" ||
    role.value === "Sales" ||
    role.value === "Admin"
  ) {
    role.className = "custom-select is-valid";
    roleInfo.className = "valid-feedback";
    roleInfo.innerHTML = "Awesome role";
  } else {
    role.className = "custom-select is-invalid";
    roleInfo.className = "invalid-feedback";
    roleInfo.innerHTML = "Unknown Role";
    isValid = false;
  }

  if (password.value == "") {
    password.className = "form-control form-control-lg is-invalid";
    passwordInfo.className = "invalid-feedback";
    passwordInfo.innerHTML = "Password field is required";
    isValid = false;
  } else if (password.value.length >= 6 && password.value.length <= 12) {
    password.className = "form-control form-control-lg is-valid";
    passwordInfo.className = "valid-feedback";
    passwordInfo.innerHTML = "Looks good";
  } else {
    password.className = "form-control form-control-lg is-invalid";
    passwordInfo.className = "invalid-feedback";
    passwordInfo.innerHTML = "Password length must be between 6 and 12";
    isValid = false;
  }

  if (password2.value === password.value) {
    password2.className = "form-control form-control-lg is-valid";
    password2Info.className = "valid-feedback";
    password2Info.innerHTML =
      "Password comfirmation field is match with Password field";
  } else {
    password2.className = "form-control form-control-lg is-invalid";
    password2Info.className = "invalid-feedback";
    password2Info.innerHTML = "Incorrect password comfirmation";
    isValid = false;
  }

  if (password2.value == "") {
    password2.className = "form-control form-control-lg is-invalid";
    password2Info.innerHTML = "Password comfirmation field is required";
    password2Info.className = "invalid-feedback";
    isValid = false;
  }

  if (!isValid) return false;
};
