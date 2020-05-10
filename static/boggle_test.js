describe("testing functions in boggle app", () => {

    it ("should return message response from API using Game.checkWord with isWordValid", async function() {
        const response = await isWordValid("at");
        const areWords = ["ok", "not-on-board"];
        expect(areWords).toContain(response);
        const response2 = await isWordValid("adsfdsfs")
        expect(response2).toEqual("not-word") 
    })

    it("should return user friendly message with userMessage", () => {
        expect(userMessage("ok")).toEqual("Good job!");
        expect(userMessage("not-word")).toEqual("Invalid word: not a word!")
        expect(userMessage("not-on-board")).toEqual("Invalid word: not on board!")
    })

    it("should update score according to word length with updateScore", () => {
        game.score = 0;
        updateScore("happy");
        expect(game.score).toEqual(5);
    })

    it("should return updated high score from api with updateHighScore", async function() {
        let scoreGames = await game.updateHighScore(20);
        expect(scoreGames.high_score).toEqual(20);
        expect(scoreGames.games_played).toEqual(1);
        highScore = await game.updateHighScore(30);
        expect(scoreGames.high_score).toEqual(30);
        expect(scoreGames.games_played).toEqual(2);
        highScore = await game.updateHighScore(25);
        expect(scoreGames.high_score).toEqual(30);
        expect(scoreGames.games_played).toEqual(2);
    })

    afterEach(() => {
        game.score = 0;
        game.submittedWords = [];
    })
})