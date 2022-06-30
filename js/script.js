window.onload = function () {
  RenderListContact();
};

const SubmitData = (event) => {
  const name = document.getElementById("input-name").value;
  const phone = document.getElementById("input-phone").value;
  const email = document.getElementById("input-email").value;
  const id = document.getElementById("button-submit").value;
  if (!InputValidation(name, phone, email)) {
    return false;
  }
  const isNew = id.length == 0;
  let inputData = {
    id: Math.random().toString(),
    name: name,
    phone: phone,
    email: email,
    date: new Date().toLocaleString("en-GB"),
  };
  if (isNew) {
    SaveContact(inputData);
  } else {
    inputData.id = id;
    UpdateContact(inputData);
  }
  document.getElementById("input-name").value = null;
  document.getElementById("input-phone").value = null;
  document.getElementById("input-email").value = null;
  RenderListContact();
  event.preventDefault();
};

const SaveContact = (inputData) => {
  const inputDatas = [inputData, ...GetDataObjectFromStorage()];
  localStorage.setItem("inputDatas", JSON.stringify(inputDatas));
};

const UpdateContact = (inputData) => {
  let contacts = GetDataObjectFromStorage();
  let contactsUpdated = contacts.map((contact) => {
    if (contact.id == inputData.id) {
      return inputData;
    }

    return contact;
  });
  localStorage.setItem("inputDatas", JSON.stringify(contactsUpdated));
  RenderListContact();
};

const RemoveContact = (event) => {
  let id = event.target.value;
  let contacts = GetDataObjectFromStorage();
  let contacstAfterRemove = contacts.filter((contact) => {
    return contact.id !== id;
  });

  localStorage.setItem("inputDatas", JSON.stringify(contacstAfterRemove));
  RenderListContact();
};

const RenderListContact = () => {
  let contacts = GetDataObjectFromStorage();
  let tbody = document
    .getElementById("list-contact")
    .getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  contacts.forEach((contact, key) => {
    tbody.insertRow().innerHTML =
      "<th scope='row'>" +
      (key + 1).toString() +
      "</th>" +
      "<td>" +
      contact.name +
      "</td>" +
      "<td>" +
      contact.phone +
      "</td>" +
      "<td>" +
      contact.email +
      "</td>" +
      "<td>" +
      contact.date +
      "</td>" +
      "<td>" +
      "<button value='" +
      JSON.stringify(contact) +
      "' class='btn btn-success' type='button'  onClick='GetEditData(event)'>Edit</button> " +
      "<button class='btn btn-danger' value='" +
      contact.id +
      "' type='button' onClick='RemoveContact(event)'> Delete </button>";
    ("</td>");
  });
};

const GetEditData = (event) => {
  let contact = JSON.parse(event.target.value);
  document.getElementById("input-name").value = contact.name;
  document.getElementById("input-phone").value = contact.phone;
  document.getElementById("input-email").value = contact.email;
  document.getElementById("button-submit").value = contact.id;
};

const GetDataObjectFromStorage = () => {
  let inputObjectString = localStorage.getItem("inputDatas");
  if (inputObjectString == null) {
    inputObjectString = "[]";
  }

  return JSON.parse(inputObjectString);
};

const InputValidation = (name, phone, email) => {
  const error = document.getElementById("error-message");
  if (error) {
    error.remove();
  }
  let isFormIempty = true;
  let isInvalidEmail = true;
  let isInvalidPhone = true;
  let error_message = "";
  if (name.length == 0 || phone.length == 0 || email == 0) {
    error_message = "Input is require!";
    isFormIempty = true;
  } else {
    isFormIempty = false;
  }

  if (email.length > 0 && !IsEmailValid(email)) {
    error_message = "Email invalid!";
    isInvalidEmail = true;
  } else {
    isInvalidEmail = false;
  }

  if (phone.length > 0 && !IsPhoneValid(phone)) {
    error_message = "Phone invalid!";
    isInvalidPhone = true;
  } else {
    isInvalidPhone = false;
  }

  if (isFormIempty || isInvalidEmail || isInvalidPhone) {
    ShowErrorMessage(error_message);

    return false;
  }

  return true;
};

const ShowErrorMessage = (message) => {
  const form = document.getElementById("contact-form");
  const error_div = document.createElement("div");
  error_div.id = "error-message";
  error_div.classList.add("alert", "alert-danger");
  error_div.innerHTML = message;
  form.prepend(error_div);
};

const IsEmailValid = (email) => {
  const req =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return email.match(req);
};

const IsPhoneValid = (phone) => {
  const re =
    /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

  return re.test(phone);
};

form = document.getElementById("contact-form");
form.addEventListener("submit", SubmitData);
