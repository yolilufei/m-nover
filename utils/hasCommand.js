const commandList = require("./commandList");

const hasCommand = (command, commandArgs = []) => {
    const matched = commandArgs.filter(c => c === command);
    if(matched.length) {
        return matched[0].split('=');
    }
    return false;
}

const validCommandArgument = (command, commandArg) => {
    let valid = false;
    switch(command) {
        case commandList["enable-pm-verify"]:
            if (commandArg === 'true' || commandArg === 'false') {
                valid = true;
            }
            break;
    }
    return valid;
}

module.exports.hasCommand = hasCommand;
module.exports.validCommandArgument = validCommandArgument;