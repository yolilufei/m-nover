const commandList = require("./commandList");

const hasCommand = (command, commandArgs = []) => {
    const matched = commandArgs.filter(c => c.includes(command));
    if(matched.length) {
        if (matched[0] === '-t') {
            const ret = commandArgs.indexOf(command) + 1;
            return commandArgs[ret];
        }
        return matched[0].split('=')[1];
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