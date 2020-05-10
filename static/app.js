$form = $("#guess_form")
$display = $("#message")
const game = new BoggleGame()
let time = 60;

//starts game timer, shows input form, and updates user high score
async function startGame() {
    $form.show();
    $("#start").hide();
    $("#new").hide();
    $form.on("submit", handleForm)
    game.timer = setInterval(showTimer, 1000)
    let scoreGames = await game.updateHighScore(0, false);
    $("#high_score").text(`High Score: ${scoreGames.high_score}`)
    $("#games").text(`Games Played: ${scoreGames.games_played}`)
}

//shows timer on page 
async function showTimer() {
    $("#timer").text(`Time: ${time}`);
    time--;
    if (time < 0) {
        await endGame();
    }
}    

$("#start").on("click", startGame)

// handles user word input and displays a user friendly return message regarding the validity of the word
async function handleForm(evt) {
    evt.preventDefault();
    const input = $("#guess").val();
    if (!game.submittedWords.includes(input)) {
        const response = await isWordValid(input);
        const message = userMessage(response);
        $display.text(message);
        if (message === "Good job!") {
            let score = updateScore(input);
            $("#score").text(`Score: ${score}`)
        }
    }    
    else {
        $display.text("Already submitted word!")
    }    
    game.submittedWords.push(input);
    $("#guess").val("");
}

//takes response message and returns a user friendly message
function userMessage(response) {
    let message = "";
    if (response == "ok") {
        message = "Good job!";
    }
    else if (response == "not-word") {
        message = "Invalid word: not a word!"
    }
    else if (response == "not-on-board") {
        message = "Invalid word: not on board!"
    }
    return message;
}

//calls on Game.checkWord to determine if word is valid
async function isWordValid(word) {
    const response = await BoggleGame.checkWord(word);
    return response;
}

//updates page score, with each word worth its char length in points
function updateScore(word) {
    game.score += word.length;
    return game.score;
}

/* when timer runs out, updates high score and games played, hides input form,
   and replaces start button with new game button */
async function endGame() {
    let scoreGames = await game.updateHighScore(0, true);
    $("#high_score").text(`High Score: ${scoreGames.high_score}`)
    $("#games").text(`Games Played: ${scoreGames.games_played}`)
    $form.hide();
    $("#start").hide()
    $("#new").show()
    $("#new").on("click", () => {
        location.reload();
    })
    clearInterval(game.timer);
}