var BasicCard = require("./Basic");
var ClozeCard = require("./ClozeCard");
var inquirer = require("inquirer");
var fs = require("fs");
var correct = 0;
var wrong = 0;
var questionArray = [];
 
var start = function() {
    /* First we find out what the user wants to do*/
    inquirer.prompt([{

            type: "list",
            name: "gameChoice",
            message: "What would you like to do?",
            choices: ["Play with the basic flashcards.",
                "Create basic flashcards.",
                "Play with user created basic flashcards.",
                "Play with cloze flashcards.",
                "Create cloze flashcards",
                "Play with user created cloze cards.",
                "I'm done, thanks."
            ]
        }
        /* Then we assign the appropriate pages and functions to correlate with the user's commands*/
    ]).then(function(choice) {
    
        if (choice.gameChoice === "Play with the basic flashcards.") {
            quiz("log.txt", 0);
        } else if (choice.gameChoice === "Create basic flashcards.") {
            readCards("userLog.json");
            createCards(basicPrompt, "userLog.json");
        } else if (choice.gameChoice === "Play with user created basic flashcards.") {
            quiz("userLog.json", 0);
        } else if (choice.gameChoice === "Play with cloze flashcards.") {
            quiz("clozeLog.txt", 0);
        } else if (choice.gameChoice === "Create cloze flashcards") {
            readCards("userClozeLog.json");
            createCards(clozePrompt, "userClozeLog.json");
        } else if (choice.gameChoice === "Play with user created cloze cards.") {
            quiz("userClozeLog.json", 0);
        } else if (choice.gameChoice === "I'm done, thanks.") {
            console.log("Have a great rest of your day");
        }
    });
};

/* We read the card from the appropiate file*/
var readCards = function(fileLog) {
    
    questionArray = [];
    
    fs.readFile(fileLog, "utf8", function(err, data) {
        var jsonData = JSON.parse(data);
        for (var i = 0; i < jsonData.length; i++) {
            questionArray.push(jsonData[i]);
        }
    });
};

/* Here the user can create their own flashcards with both a question and answer in either format*/
var createCards = function(thisPrompt, fileLog) {
     
    inquirer.prompt(thisPrompt).then(function(answers) {

        questionArray.push(answers);
        if (answers.makeMore) {
            createCards(thisPrompt, fileLog);
        } else {
            writeInLog(fileLog, JSON.stringify(questionArray));
            start();
        }

    });
};

/* here we are asking the questions from the falshcards and capturing and comparing answers*/
var quiz = function(fileLog, x) {

    fs.readFile(fileLog, "utf8", function(error, data) {

        var jsonData = JSON.parse(data);

        if (x < jsonData.length) {

            /* if the data has front as the question*/
            if (jsonData[x].hasOwnProperty("front")) {
                /*then reference the BasicCard functions*/
                var gameCard = new BasicCard(jsonData[x].front, jsonData[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else { /*if not, then we are going with the ClozeCard features*/
                var gameCard = new ClozeCard(jsonData[x].text, jsonData[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            /*asking the real questions here*/
            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {
                   /*making sure the user has entered something*/
                    if (value.length > 0) {
                        return true;
                    } /*else we insist the user participates*/
                    return "Come on, at least take a guess!";
                }

            }]).then(function(answers) {
                /*if the user gets the answer correct*/
                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log("Correct!");
                    correct++;
                    x++;
                    quiz(fileLog, x);
                } else { /*if not, we tell them the correct answer in the selected format*/
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(fileLog, x);
                }

            })

        } else {/*when they are done with the quiz, we give them their total score*/
            console.log("Here's how you did: ");
            console.log("correct: " + correct);
            console.log("wrong: " + wrong);
            correct = 0;
            wrong = 0;
            start();
        }
    });
};
/*writes the information from createCards to the file with the info being the json string*/
var writeInLog = function(fileLog, info) {

    fs.writeFile(fileLog, info, function(err) {
        if (err)
            console.log(err);
    });
}

/*prompts to fill in the BasicCard question and answers*/ 
var basicPrompt = [{
    name: "front",
    message: "Enter your question. "
}, {
    name: "back",
    message: "Enter the answer. "
}, {
    type: "confirm",
    name: "makeMore",
    message: "Create another card?",
    default: true
}]

/*promts for the ClozeCard statements*/
var clozePrompt = [{
    name: "text",
    message: "Enter a sentence with the word you want as the answer in parenthesis, like... ' The (apple) never falls far from the tree. '",
    validate: function(value) {
        /* Been reading up on Regular expressions and found them quite (perplexing) useful with this exercise
        this is to verify the user is actualy using parentheses and has alphanumeric within it*/
        var parentheses = /\(\w.+\)/;
        if (value.search(parentheses) > -1) {
            return true;
        }
        return "Please put a word in your sentence in parentheses"
    }
}, {
    type: "confirm",
    name: "makeMore",
    message: "Create another card?",
    default: true
}]

var makeMore = {
    type: "confirm",
    name: "makeMore",
    message: "Create another card?",
    default: true
}

start();
