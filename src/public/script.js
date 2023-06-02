document.addEventListener("DOMContentLoaded", function () {
  // submittion with new message in field with id 'm'
  const form = document.querySelector("form");
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageToSend = document.querySelector("#m").value;
    document.querySelector("#m").value = "";
    // other actions needed with messageToSend
  });
});
