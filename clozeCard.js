var ClozeCard = function(text, cloze) {

	this.text = text;  
	/*look for parentheses \(----\), capture (--), anything within that isn't the parentheses itself [^)]+, with everything in the bracket 'captured' in group 1, therefore we must use [1] to access the results*/
	this.cloze = this.text.match(/\(([^)]+)\)/)[1];
	
	this.printCloze = function() {
		console.log(this.cloze);
	}
	
	this.printText = function() {
		console.log(this.text);
	}
	/*prints the question in the cloze format replace whats within the parentheses (including themselves) with the underline*/
	this.message = this.text.replace('(' + this.cloze + ')', '________');
}

ClozeCard.prototype.printAnswer = function() {
	/*If the user gets the answer incorrect, we publish the .text replacing the parentheses content with just the contant */
	console.log('Incorrect. Here is the full sentence: \n' + this.text.replace(/[{()}]/g, ''));
}                     

module.exports = ClozeCard;