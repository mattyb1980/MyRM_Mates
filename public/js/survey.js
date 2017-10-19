$(document).ready(function() {

  var city;
  var rent;
  var personScore = [];

  function initialScreen() {
    startScreen = "<p class='text-center main-button-container'><a class='btn btn-primary btn-lg btn-block start-button' href='#' role='button'>Start Quiz</a></p>";
    $(".mainArea").html(startScreen);
  };

  initialScreen();

  $("body").on("click", ".start-button", function(event) {
    event.preventDefault();
    generateHTML();
  });

  $("body").on("click", ".answer", function(event) {
    selectedAnswer = $(this).attr("data-score");
    answerArray.push(parseInt(selectedAnswer));
    //console.log($(this).data());
    //console.log(selectedAnswer);
    console.log(answerArray);
    wait();
  });

  $("body").on("click", ".final-button", function(event) {
    resetGame();
  });

  $("body").on("click", ".submit", function(event) {
    event.preventDefault();
    city = $('#city').find(":selected").val();
    rent = $('input[type=radio]:checked').val();
    var eScore = (answerArray[0] + answerArray[5]) / 2;
    var aScore = (answerArray[1] + answerArray[6]) / 2;
    var cScore = (answerArray[2] + answerArray[7]) / 2;
    var nScore = (answerArray[3] + answerArray[8]) / 2;
    var iScore = (answerArray[4] + answerArray[9]) / 2;
    personScore.push(aScore, cScore, eScore, iScore, nScore);
    personScore = personScore.toString();
    console.log(personScore);
    updateUser(city, rent, personScore);
  });

  $("body").on("click", ".reset-button", function(event) {
    event.preventDefault();
    locationScreen();
  });

  function updateUser(city, rent, personScore) {
    $.post("/api/survey", {
      city: city,
      rent: rent,
      personScore: personScore
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, log the error
    })
      // If there's an error, handle it by throwing up a boostrap alert
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  function generateHTML() {
    gameHTML = "<p class='text-center timer-p'>Personality Questions</p><p class='text-center'>" + questionArray[questionCounter] + "</p><p data-score=1 class='btn btn-primary first-answer answer'>Strongly Disagree</p><p data-score=2 class='btn btn-primary answer'>Moderately Disagree</p><p data-score=3 class='btn btn-primary answer'>Neither Agree nor Disagree </p><p data-score=4 class='btn btn-primary answer'>Moderately Agree</p><p data-score=5 class='btn btn-primary answer'>Strongly Agree</p>";
    $(".mainArea").html(gameHTML);
  }

  function wait() {
    if (questionCounter < 9) {
      questionCounter++;
      generateHTML();
    } else {
      locationScreen();
    }
  }

  function locationScreen() {
    gameHTML = "<p class='text-center'>Now let's find out more about where you would like to live!</p>" +
      "<p class='text-center'>Choose your city from the options below.</p>" +
      "<div class='form-group'><label for='availableCities'>Available Cities</label><select class='form-control' id='city'><option>New York</option><option>Los Angeles</option><option>Chicago</option><option>Boston</option><option>San Fransisco</option></select></div>" + "<div class='form-check'><label class='form-check-label'><div><label for='form-check'>Choose your budget</label></div><input class='form-check-input' type='radio' name='rentRadio' value='1'> $500 and under</label></div><div class='form-check'><label class='form-check-label'><input class='form-check-input' type='radio' name='rentRadio' value='2'> $500 to $1000</label></div><div class='form-check'><label class='form-check-label'><input class='form-check-input' type='radio' name='rentRadio' value='3'> $1000 to $1500</label></div><div class='form-check'><label class='form-check-label'><input class='form-check-input' type='radio' name='rentRadio' value='4'> $1500 to $2000</label></div><div><button type='button' class='btn btn-secondary btn-lg submit'>Submit!</button></div>";
    $(".mainArea").html(gameHTML);
  }

  function finalScreen() {

  }


  var startScreen;
  var gameHTML;
  var questionArray = [
    "I am the life of the party.",
    "I am very interested in other's lives",
    "I get chores done right away",
    "I have frequent mood swings",
    "I have a vivid imagination",
    "I talk a lot",
    "I am interested in other's problems",
    "I like order",
    "I get upset easily",
    "I like thinking about abstract concepts"
  ];
  var answerArray = []
  var questionCounter = 0;
  var selectedAnswer;

  var matchUser;


});
