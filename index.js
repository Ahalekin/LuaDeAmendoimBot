//==========Instantiations and Globals Area============//

require('dotenv').config();
const fm = require('./filemanager');
const fileManager = new fm();
const tmi = require('tmi.js');
const theboss = fileManager.findUser('<NAME>');

//===============================================//



//======================Regex Area=========================//

const regexComand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
//!<comand> <argument>

const regexDice = new RegExp (/^!([0-9]+)([d])(([0-9])+)/);
//!<quantity> d <sides>

//==============================================================//




//==========================================Comands Area==================================================//

//list of commands for the bot and their replyes
const comands = {
    insta: {
      reply: '<link>'
    },
    theboss:{
        reply:`CLEARLY THE @${theboss.tags.username}`
    },
    giveaway:{
        reply:'<message> <link>'
    },
    //function returns to the user the success or failure of the vote along with the user who was voted
    vote:{
        //finds the space where the user who was voted on is
        //if there is no error it will be sent to chat
        //if it exists, it checks whether the voter voted for himself
        //if these 2 requirements are met, then it will record the vote update
        //and return a success message
        reply: function vote (voted, elector) { 
            const userVoted = fileManager.findUser(vote.toLowerCase());
            if(userVoted !== undefined){
                if(elector.username != userVoted.tags.username){
                    fileManager.modfyVotes(voted);
                    return `You voted for: ${userVoted.tags.username}`;
                }
                return`Im not dumb, you can't vote for yourself`;
            }
            else{
                return 'User not found try again';
            }
        }
    },
    //function returns to the user the number of votes he has
    myvote:{
        //finds the space where the user who was voted on is
        //after finding returns the message with the value
        reply: function myVote(blank, tags){
            const username = fileManager.findUser(tags.username.toLowerCase());
            return `You have: ${username.votes}votes stay on the track =D`;
        }
    },
    //function returns the top 5 in the voting rank
    rank:{
        //copies the list of users and adjusts it incrementally for each user without changing the main bank
        //then returns a message with each name of the 5 largest
        reply: function rank(blank, tags){
            var rankList = fileManager.sortVotesByAscending();
            return `Rank of the top 5: 1º@${rankList[0].tags.username}
                                        2º@${rankList[1].tags.username}
                                        3º@${rankList[2].tags.username}
                                        4º@${rankList[3].tags.username}
                                        5º@${rankList[4].tags.username}`
        }
    }
}

//===============================================================================================================//





//============================================Área TMI.JS========================================================//

//tmi.js settings for connecting to the channel, and logging in with the bot account
const client = new tmi.Client({
    connection:{
        reconect: true
    },
	channels: [ process.env.TWITCH_CHANELNAME ],
    identity:{
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_OAUTH
    },
});

//making the conection
client.connect();


//every message that is sent the event will be triggered
client.on('message', (channel, tags, message, self) => {
    const userNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;
    if ( !userNotBot ) return;

    //if there is no name matching the user, the find function will return undefined
    const userExists = fileManager.findUser(tags.username.toLowerCase());

    //if userExists does not exist (undefined), create one with the initial number of votes, and save it in the bank
    if(userExists === undefined){
        console.log(`New User saved ${tags.username}`);
        fileManager.saveUser(tags);
    }


    //checks if the message has the regex structure for a command
    if(message.match(regexComand)){

        //separating the message in each regex argument into variables
        const [raw, comand, argument] = message.match(regexComand);

        //if there is a command within commands, it will storage, if not, will storage blank array
        const { reply } = comands[comand] || {};

        let messagereply = reply;
        
        //checks if reply is a function, then executing it
        if ( typeof messagereply === 'function' ){
            messagereply = reply(argument, tags);
        }
        //if there is a reply, then it will be replied in the chat
        if ( messagereply ) {
        console.log(`Answering comand !${comand}`);
        client.say(channel, messagereply);
        }

        //function for launching dice compares a regex structure
        if(message.match(regexDice)){

            //saves the regex segments, the first and third arguments are discarded
            const [ ,quantity, ,sides] = message.match(regexDice);

            //starts sum to 0 avoiding problems
            var sum = 0;

            //loop to sum the dice, saving the random number and then adding it to the total
            //until the specified quantity is reached and then send it in chat
            for(let i = 0; i < quantity; i++){
                var dice = Math.floor(Math.random() * sides + 1);
                sum += dice;
            }
            client.say(channel,`You roled ${quantity}d${sides}: ${sum}`);
        }
    }
});
//===========================================================================================================//
			