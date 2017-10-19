$(document).ready(function() {
  console.log("member js loaded");
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $(".chat-button").hide();

  $.get("/api/user_data").then(function(user) {
    $(".member-name").html(user.name);
    console.log("found user");
    console.log(user);
    userData = user;
  });
  var matchButton = $(".match-button");
  var userData;
  var chatButton = $(".chat-button");

  matchButton.on("click", function(event) {
    event.preventDefault();
    if (!userData.matchID == null) {
      console.log("button clicked");
      $.post("api/display").then(function(data) {
        console.log("matches run");
        console.log(data);
      }).done(function(data) {
        console.log("inside .done of match button");
        $(".match-button").hide();
        $(".match-info").text("You have been matched with " + data.name + "!");
        $(".chat-box").text("Click here to enter a chat with " + data.name);
        console.log("ran if statement");
      });
    } else {
      $.post("api/matches").then(function(match) {
        console.log("running matches");
        $.post("api/display").then(function(data) {
          console.log("running display");
          $(".match-button").hide();
          $(".match-info").text("You have been matched with " + data.name + "!");
          $(".chat-box").text("Click here to enter a chat with " + data.name)
          $(".chat-button").show();
        })
      })
    };
  });

  chatButton.on("click", function(event){
    event.preventDefault();
    window.location.replace("/chat")
  })

});
