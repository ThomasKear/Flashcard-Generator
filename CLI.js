var Basic = require("./Basic.js");
var inquirer = require("inquirer");

inquirer.prompt([

    {
        type: "input",
        name: "name",
        message: "What is your name?"
    }
]).then(function(user) {

    if (user.name === "admin") {

        console.log("====================================");
        console.log("");
        console.log("Welcome to the administrator side.")
        console.log("I will publish the user log for you.")
        console.log("Enjot the rest of your day.")
        console.log("");
        console.log("====================================");

    } else {
        console.log("");
        console.log("Welcome " + user.name);

        inquirer.prompt([{
            type: "list",
            name: "gameChoice",
            message: "Which version of the falsh card game would you like to play?",
            choices: ["Basic", "ClozeCard"]

        }]).then(function(choice) {
            if (choice.gameChoice === "Basic") {

                console.log("Enjoy the Basic game!")
                basicGame();
            }

            if (choice.gameChoice === "ClozeCard") {
                console.log("Enjoy the ClozeCard game!")
                clozeCardGame();
            }
        });
    }
});
