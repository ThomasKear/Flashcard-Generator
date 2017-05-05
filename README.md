# Flashcard
This flashcard generator is designed to be user-friendly. Open with node CLI.js in the command line, and it will guide you through through the process of playing with the pre-made question, or createing your own.  It can be designed with a question/answer format or where a statement is made, but with the answer omitted (cloze).  Pre-made flashcards are saved in Log.txt for the Basic gameplay, and clozeLog.txt for the Cloze game.  When a user creates cards, they are saved in userLog.json for the Basic and userClozeLog.json for the cloze game.

Table of Contents

- Create and Gameplay with Basic Flashcards
- Create and Gameplay with Cloze Flashcards
- Quiz
- Dependencies
- Next Steps

# Create and Gameplay with Basic Flashcards
To create a basic flaschcard displaying the question on the front and its answers on the back, use the arrow keys to highlight the option "Create basic flashcards." from the command line menu.  Follow the promps to create the front and back of the card.  You will be prompted if you want to make more.  The user can play with either pre-made cards or user created cards through the CLI "Play with the basic flashcards." or "Play with user created basic flashcards.", respectively.

# Create and Gameplay with Cloze Flashcards
Creating the cloze flashcards, where the flashcard is displayed with the answer omitted and the user enters their guess, is prompted in the CLI by "Create cloze flashcards".  The prompts guide you to write the sentence with the answer in parentheses any where in its structure. For example:

The (golden retriever) is the most popular breed in the United States.

# Quiz
Start by choosing one of the "Play ..." options.  The basic quiz, choosen by either "Play with the basic flashcards." or "Play with user created basic flashcards.", will display the front (question) of the card and allow you to type your answer.  The cloze quiz, accessed by "Play with cloze flashcards." or "Play with user created cloze cards.", will present your cloze card with an underline replacing the hidden word/s. With both games, the program will let you know the answer is and at the end give you a total score.

#Dependencies
This app was created using inquirer.js and node.js File System (fs).  Flashcards.js serves as the entry point for the app.  Constructors and methods for the two types of cards are exported from the files simple.js and cloze.js.  Each of the constructor modules provides methods not only for creating the cards, but also for displaying information during the quiz.

#Next Steps
I would like to add utility to this app by having a way to save and access seperate decks of cards, and an edit and delete existing card interface.  Also, incorporate a web based interface and a database.