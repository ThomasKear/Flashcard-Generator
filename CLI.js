var BasicCard = require("./Basic.js");
var inquirer = require("inquirer");
var fs = require("fs");
var correct = 0;
var wrong = 0;
var questionArray = [];


var flashcards = function() {

    inquirer.prompt([

        {
            type: "list",
            name: "gameChoice",
            message: "What would you like to do?",
            choices: ["Play with the flashcards.", "Create the flashcards.", "I'm done, thanks."]
        }

    ]).then(function(choice) {

        if (choice.gameChoice === "Play with the flashcards.") {
            quiz("log.txt", 0);
        } else if (choice.gameChoice === "Create the flashcards.") {
        		readCards("log.txt");
        		createCards(createPrompt, 'log.txt');
        } else if (choice.gameChoice === "I'm done, thanks.") {
            console.log("Have a great rest of your day")
        }
    })

}



var readCards = function(fileLog) {
    questionArray + [];
    fs.readFile(fileLog, "utf8", function(err, data) {
        var jsonData = JSON.parse(data);

        for (var i = 0; i < jsonData.length; i++) {
            questionArray.push(jsonData[i]);
        }
    });
};

var createCards = function(promptThis, fileLog) {
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
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }
                    return 'Come on, at least take a guess!';
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct!');
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
            console.log('Here\'s how you did: ');
            console.log('correct: ' + correct);
            console.log('wrong: ' + wrong);
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

var createPrompt = [{
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

var makeMore = {
	type: "confirm",
	name: "makeMore",
	message: "Create another card?",
	default: true
}

flashcards();
