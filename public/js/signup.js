$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var nameInput = $("input#name-input");
  var ageInput = $("input#age-input");
  var genderInput = $("input[name=gender]:checked");
  var personScoreInput = "0";

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    console.log(personScoreInput);
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      name: nameInput.val().trim(),
      age: ageInput.val(),
      gender: genderInput.val().trim(),
      personScore: personScoreInput
    };
    console.log(userData);

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.name, userData.age, userData.gender, userData.personScore);
    emailInput.val("");
    passwordInput.val("");
    nameInput.val("");
    ageInput.val();
    genderInput.val();
  });

  // Does a post to the signup route. If succesful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, name, age, gender, personScore) {
    $.post("/api/signup", {
      email: email,
      password: password,
      name: name,
      age: age,
      gender: gender,
      personScore: personScore
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
