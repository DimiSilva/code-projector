const readline = require('readline')

const askQuestion = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(question, response => {
        rl.close();
        resolve(response);
    }))
}

module.exports = { askQuestion }