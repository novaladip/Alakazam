const clientName = document.getElementById("clientName");
const clientNameInfo = document.getElementById("clientNameInfo");
const projectName = document.getElementById("projectName");
const projectNameInfo = document.getElementById("projectNameInfo");
const category = document.getElementById("category");

const formValidation = () => {
  let isValid = true;

  if (clientName.value.length < 1) {
    clientName.className = "form-control form-control is-invalid";
    clientNameInfo.className = "invalid-feedback";
    clientNameInfo.innerHTML = "Client Name field can not be blank";
    isValid = false;
  } else {
    clientName.className = "form-control form-control is-valid";
    clientNameInfo.className = "valid-feedback";
    clientNameInfo.innerHTML = "Looks good";
    isValid = true;
  }

  if (projectName.value.length < 1) {
    projectName.className = "form-control form-control is-invalid";
    projectNameInfo.className = "invalid-feedback";
    projectNameInfo.innerHTML =
      "Project or Prospect Name field is can not be blank";
    isValid = false;
  } else {
    projectName.className = "form-control form-control is-valid";
    projectNameInfo.className = "valid-feedback";
    projectNameInfo.innerHTML = "Seems good";
  }

  category.className = "custom-select is-valid";

  if (!isValid) {
    return false;
  }
};
