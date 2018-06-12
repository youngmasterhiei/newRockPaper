
$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB06Ffq3_DLPvs5ZXnFgVnlbs3zMfVJ6uM",
        authDomain: "rockpaperscissors-dbffa.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-dbffa.firebaseio.com",
        projectId: "rockpaperscissors-dbffa",
        storageBucket: "",
        messagingSenderId: "710075389000"
    };
    firebase.initializeApp(config);
    // player 1 and 2 objects
    var players = {
        playerOne: {
            name: "name",
            choice: "",
            wins: 0,
            losses: 0,

        },
        playerTwo: {
            name: "name",
            choice: "",
            wins: 0,
            losses: 0,
        }
    };
    // link firebase
    var database = firebase.database();
    //reference to the second player
    var refP2 = database.ref("players/playerTwo/name");

    var rock = "rock";
    var paper = "paper";
    var scissors = "scissors";
    //switches for playing the game 
    var firstPlayerChosen = false;
    var secondPlayerChosen = false;
    //locks buttons until players are chosen
    var buttonLockOn = true;
    //locks username so player 1 or 2 must be chosen first
    var usernameLock = true;
    //switches for game turns to function
    var firstPlayerTurn = true;
    var secondPlayerTurn = false;
    //switch to display waiting for players while players are choosing names and positions
    var waitingForPlayers = true;
    //switch to display when player won and both user choices
    var playerHasWon = false;

    // used for stats and messaging 
    var winner = "";
    // reference for firebase, holds wins and losses
    var statsP1 = "";
    var statsP2 = "";
    // reference for messaging app
    var userName = "";
    // reference for player choice to display
    var p1Choice = "";
    var p2Choice = "";


//function for choosing player, continuning game.
    function firebaseUpdatePlayer(playerChosen, selector) {
        usernameLock = false;
        selector.hide();
        database.ref().update({ playerChosen: playerChosen });
    };

    //updates stats to firebase based after the evaluateChoices function runs
    function firebaseUpdatePlayerStats() {
        statsP1 = "Wins: " + players.playerOne.wins + "Losses: " + players.playerOne.losses;
        statsP2 = "Wins: " + players.playerTwo.wins + "Losses: " + players.playerTwo.losses;
        database.ref().update({
            winner: winner,
            statsP1: statsP1,
            statsP2: statsP2,
            playerHasWon: playerHasWon,
            p1Choice: p1Choice,
            p2Choice: p2Choice
        });

        database.ref("players/playerOne").update({
            wins: players.playerOne.wins,
            losses: players.playerOne.losses
        });
        database.ref("players/playerTwo").update({
            wins: players.playerTwo.wins,
            losses: players.playerTwo.losses

        });
    };
// selects which char won and attributes wins/losses
    function selectWinner(player, winningPlayer, losingPlayer) {
        winner = player + " wins";
        winningPlayer;
        losingPlayer;
        playerHasWon = true;
        setTimeout(function () {
            playerHasWon = false;
            firstPlayerTurn = true;
            database.ref().update({
                firstPlayerTurn: firstPlayerTurn,
                playerHasWon: playerHasWon,

            });
        }, 3000);

    };
    // tie version of the display winner function
    function displayTie() {
        winner = players.playerOne.name + " and " + players.playerTwo.name + " have tied";
        setTimeout(function () {
            playerHasWon = false;
            firstPlayerTurn = true;
            database.ref().update({
                firstPlayerTurn: firstPlayerTurn,
                playerHasWon: playerHasWon,

            });
        }, 3000);

    };
    //main game control function, evaluates what each char chose.
    function evaluateChoices() {

        if (players.playerOne.choice === rock && players.playerTwo.choice === scissors) {
            selectWinner(players.playerOne.name, players.playerOne.wins++, players.playerTwo.losses++);
            firebaseUpdatePlayerStats();
        }
        else if (players.playerOne.choice === paper && players.playerTwo.choice === rock) {
            selectWinner(players.playerOne.name, players.playerOne.wins++, players.playerTwo.losses++);
            firebaseUpdatePlayerStats();
        }
        else if (players.playerOne.choice === scissors && players.playerTwo.choice === paper) {
            selectWinner(players.playerOne.name, players.playerOne.wins++, players.playerTwo.losses++);
            firebaseUpdatePlayerStats();
        }
        else if (players.playerOne.choice === players.playerTwo.choice) {
            displayTie();
            firebaseUpdatePlayerStats();
        }
        else {
            selectWinner(players.playerTwo.name, players.playerTwo.wins++, players.playerOne.losses++);
            firebaseUpdatePlayerStats();
        }
    };

    // select player 1
    $("#selectPlayerOne").on("click", function () {
        var select = $("#selectPlayerTwo");
        firstPlayerChosen ? alert("Player One is already chosen") : firstPlayerChosen = true; firebaseUpdatePlayer(firstPlayerChosen, select);

    });
    // select player 2
    $("#selectPlayerTwo").on("click", function () {
        var select = $("#selectPlayerOne");
        secondPlayerChosen ? alert("Player Two is already chosen") : secondPlayerChosen = true; firebaseUpdatePlayer(secondPlayerChosen, select);

    });

    // choose name for player 1 or 2
    $("#playerSubmit").on("click", function () {

        event.preventDefault();
        if (usernameLock) {
            alert("Please select a player");
        }
        else if (secondPlayerChosen) {
            players.playerTwo.name = $("#player").val().trim();
            var name = $("#player").val().trim();
            userName = name.bold();
            console.log(players.playerTwo.name);
            $("#player").val("");
            refP2.set(players.playerTwo.name);
            buttonLockOn = false;
            $("#playerOneButtons").hide();
            var displayTurn = $("#displayTurn").text(players.playerOne.name + "'s turn");
            waitingForPlayers = false;

            database.ref().update({ buttonLockOn: buttonLockOn, waitingForPlayers: waitingForPlayers });

        }
        else if (firstPlayerChosen) {
            players.playerOne.name = $("#player").val().trim();
            var name = $("#player").val().trim();
            userName = name.bold();

            console.log(players.playerOne.name);
            $("#player").val("");

            database.ref().update({
                players: players
            });
            $("#playerTwoButtons").hide();
        }
    });
    //onclick listener for what player one chooses, rock/paper/scissors
    $(".playerOneChoice").on("click", function () {
        if (buttonLockOn) {
            alert("players must be chosen first");
        }
        else if (!firstPlayerTurn) {
            alert("waiting on player 2");
        }
        else {
            players.playerOne.choice = $(this).text().trim();
            p1Choice = $(this).text().trim();
            database.ref("players/playerOne").update({
                choice: players.playerOne.choice
            });
            firstPlayerTurn = false;
            secondPlayerTurn = true;
            database.ref().update({
                firstPlayerTurn: firstPlayerTurn,
                secondPlayerTurn: secondPlayerTurn,
                p1Choice: p1Choice
            });
        }
    });
    //onclick listener for what player two chooses, rock/paper/scissors
    $(".playerTwoChoice").on("click", function () {
        if (buttonLockOn) {
            alert("players must be chosen first")
        }
        else if (!secondPlayerTurn) {
            alert("waiting on player 1");
        }
        else {
            players.playerTwo.choice = $(this).text().trim();
            p2Choice = $(this).text().trim();
            evaluateChoices();
            database.ref("players/playerTwo").update({

                choice: players.playerTwo.choice
            });
            secondPlayerTurn = false;
            database.ref().update({
                secondPlayerTurn: secondPlayerTurn,
                p2Choice: p2Choice
            });
        }

    });
    //messaging application 
    $(document).on("click", "#messageSubmit", function () {
        event.preventDefault();
        var message = userName + ": ".bold() + $("#playerMessage").val();
        $("#playerMessage").val("");

        database.ref("message").push({
            message: message
        });

    });

    database.ref("message").on("child_added", function (snapshot) {
        $("#messageArea").append(snapshot.val().message + "<br>");

    });
    // reset game
    $("#nameReset").on("click", function () {
        players.playerOne.name = "";
        players.playerTwo.name = "";
        players.playerOne.choice = "";
        players.playerTwo.choice = "";
        firstPlayerChosen = false;
        secondPlayerChosen = false;
        buttonLockOn = true;
        firstPlayerTurn = true;
        secondPlayerTurn = false;
        waitingForPlayers = true;
        winner = "";
        var statsP1 = "";
        var statsP2 = "";
        message = "";
        location.reload();

        database.ref().update({

            buttonLockOn: buttonLockOn,
            firstPlayerChosen: firstPlayerChosen,
            secondPlayerChosen: secondPlayerChosen,
            firstPlayerTurn: firstPlayerTurn,
            secondPlayerTurn: secondPlayerTurn,
            players: players,
            statsP1: statsP1,
            statsP2: statsP2,
            winner: winner,
            message: message,
            waitingForPlayers: waitingForPlayers

        });

    });



    database.ref().on("value", function (snapshot) {
        // Change the HTML
        $("#playerOneStats").text(snapshot.val().statsP1);
        $("#playerTwoStats").text(snapshot.val().statsP2);

        buttonLockOn = snapshot.val().buttonLockOn;
        firstPlayerChosen = snapshot.val().firstPlayerChosen;
        firstPlayerTurn = snapshot.val().firstPlayerTurn;
        secondPlayerTurn = snapshot.val().secondPlayerTurn;
        waitingForPlayers = snapshot.val().waitingForPlayers;
        playerHasWon = snapshot.val().playerHasWon;
        p1Choice = snapshot.val().p1Choice;
        p2Choice = snapshot.val().p2Choice;
        if (waitingForPlayers) {
            var displayTurn = $("#displayTurn").text("waiting for players...");
            $(displayTurn).addClass("displayStyle");
        }
        else if (firstPlayerTurn) {
            displayTurn = $("#displayTurn").text(players.playerOne.name + "'s turn");
            $(displayTurn).addClass("displayStyle");
        }
        else if (secondPlayerTurn) {
            displayTurn = $("#displayTurn").text(players.playerTwo.name + "'s turn");
            $(displayTurn).addClass("displayStyle");

        }
        else if (playerHasWon) {
            debugger;
            displayTurn = $("#displayTurn").text(snapshot.val().winner);
            $(displayTurn).addClass("displayStyle");
            var displayChoice1 = $("#displayTurn").append("<br>" + players.playerOne.name + ": " + snapshot.val().p1Choice + "<br>");

            var displayChoice2 = $("#displayTurn").append(players.playerTwo.name + ": " + snapshot.val().p2Choice);
            $(displayChoice1).addClass("displayStyle");
            $(displayChoice2).addClass("displayStyle");

        }
        else {
            displayTurn = $("#displayTurn").text(snapshot.val().winner);
            $(displayTurn).addClass("displayStyle");
            var displayChoice1 = $("#displayTurn").append("<br>" + players.playerOne.name + ": " + snapshot.val().p1Choice + "<br>");

            var displayChoice2 = $("#displayTurn").append(players.playerTwo.name + ": " + snapshot.val().p2Choice);
            $(displayChoice1).addClass("displayStyle");
            $(displayChoice2).addClass("displayStyle");

        }

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref("players/playerOne").on("value", function (snapshot) {
        players.playerOne.name = snapshot.val().name;
        players.playerOne.choice = snapshot.val().choice;

        $("#playerOneName").text(snapshot.val().name);
        $("#displayPlayerOneChoice").text(snapshot.val().choice);

    });

    database.ref("players/playerTwo").on("value", function (snapshot) {
        players.playerTwo.name = snapshot.val().name;
        players.playerTwo.choice = snapshot.val().choice;

        $("#playerTwoName").text(snapshot.val().name);
        $("#displayPlayerTwoChoice").text(snapshot.val().choice);

    });

});