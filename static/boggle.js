class BoggleGame {
    constructor() {
        this.submittedWords = []
        this.score = 0;
        this.timer;
    }

    // sends word check request to determine if word is valid and returns message response
    static async checkWord(word) {
        const response = await axios.get("http://localhost:5000/handle_guess", {params: {guess : word}})
        const wordResult = response.data.result;
        return wordResult;
    }

    // submits score to api and returns result of updated high score and games played
    // if updateGames = true, updates games played (only happens at end of game)
    async updateHighScore(score, updateGames) {
        const response = await axios.post("http://localhost:5000/score", {score, updateGames})
        const result = response.data
        return result;
    }
}