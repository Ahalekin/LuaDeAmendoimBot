const fs = require('fs');

class FileManager{
    constructor(){}
    
    //método para gravar, atualizar ou registrar um novo usuário
    modfyVotes(usuario){
        const usersJSON = this.#updateJSON();
        const verify = this.findUserIndex(usuario);
        usersJSON[verify].votes++;        
        this.#storage(usersJSON);        
    };

    saveUser(tags){
        const usersJSON = this.#updateJSON();
        usersJSON.push({tags: tags, votes:0});
        this.#storage(usersJSON); 
    };
    
    findUser(nome){
        const usersJSON = this.#updateJSON();
        return usersJSON.find(({tags:{username}}) => username == nome);
    }

    findUserIndex(nome){
        const usersJSON = this.#updateJSON();
        return usersJSON.findIndex(({tags:{username}}) => username == nome);  
    }

    sortVotesByAscending(){
        const usersJSON = this.#updateJSON();
        return usersJSON.toSorted((a,b) => b.votes - a.votes);
    }

    #updateJSON(){
        const usersJSON = fs.readFileSync('file.json', 'utf8');
        return JSON.parse(usersJSON);
    };

    #storage(usersJSON){
        const usersJSONstring = JSON.stringify(usersJSON, null, 4);
        fs.writeFile("file.json", usersJSONstring, function(err, result) {
            if(err) console.log('error', err);
        });
    }
}
module.exports = FileManager;
