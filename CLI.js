// this var calls out to the basic constructor 
var BasicCard = require("./Basic");
// this var is for the cloze constructor
var ClozeCard = require("./ClozeCard");
// this is for the npm inquirer
var inquirer = require("inquirer");
// this is to read/write to other "pages"
var fs = require("fs");
// to keep track of your score
var correct = 0;
var wrong = 0;
// establishes a global array
var questionArray = [];
 
var flashcards = function() {
    // interacts with the user prompting which action they wanted
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

    ]).then(function(choice) {
    //This will call the appropriate functions and prompts 
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
}

// this function reads from either the Basic or Cloze .txt / .json
var readCards = function(fileLog) {
    // this global variable will capture the json data
    questionArray = [];
    // file system readFile (the particular page the script is coming from)
    fs.readFile(fileLog, "utf8", function(err, data) {
        // parse the data
        var jsonData = JSON.parse(data);
        // loop thru and fills the questionArray
        for (var i = 0; i < jsonData.length; i++) {
            questionArray.push(jsonData[i]);
        }
    });
};

// creating the cards we need with the correlating prompts and file
var createCards = function(promptThis, fileLog) {
    // calls inquirer and gives the promise 
    inquirer.prompt(promptThis).then(function(answers) {

        questionArray.push(answers);
        if (answers.makeMore) {
            createCards(promptThis, fileLog);
        } else {
            writeInLog(fileLog, JSON.stringify(questionArray));
            flashcards();
        }

    });
};

var quiz = function(fileLog, x) {

    fs.readFile(fileLog, "utf8", function(error, data) {

        var jsonData = JSON.parse(data);

        if (x < jsonData.length) {

            if (jsonData[x].hasOwnProperty("front")) {

                var gameCard = new BasicCard(jsonData[x].front, jsonData[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new ClozeCard(jsonData[x].text, jsonData[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }
                    return "Come on, at least take a guess!";
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log("Correct!");
                    correct++;
                    x++;
                    quiz(fileLog, x);
                } else {
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(fileLog, x);
                }

            })

        } else {
            console.log("Here's how you did: ");
            console.log("correct: " + correct);
            console.log("wrong: " + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};

var writeInLog = function(fileLog, info) {

    fs.writeFile(fileLog, info, function(err) {
        if (err)
            console.log(err);
    });
}

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

var clozePrompt = [{
    name: "text",
    message: "Enter a sentence with the word you want as the answer in parenthesis, like... "The (apple) never falls far from the tree."",
    validate: function(value) {
        // Been reading up on Regular expressions and fond them quite (perplexing) useful with this exercise
        //this is to verify the user is actualy using parentheses 
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

flashcards();
