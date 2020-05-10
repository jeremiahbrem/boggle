from flask import Flask, request, render_template, session, jsonify, json
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "43546d5fg6a8d4g"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def generate_gameboard():
    """Return board page with Boggle game board"""

    board = boggle_game.make_board()
    session["board"] = board  

    return render_template("board.html", board=board)

@app.route("/handle_guess")    
def is_valid_word():
    """Return response to user's word guess"""

    guess = request.args["guess"]
    
    board = session["board"]
    result = boggle_game.check_valid_word(board, guess)

    return jsonify({"result" : result})

@app.route("/score", methods=["POST"])    
def update_high_score():
    """Evaluates submitted score and returns updated high score,
       also updates and returns number of games played"""
    
    result = request.get_json()
    score = int(result["score"])
    if session.get("games_played", None):
        if result["updateGames"] == True:
            games = session["games_played"]
            games += 1
            session["games_played"] = games
    else:
        session["games_played"] = 0
        if result["updateGames"] == True:
            games = session["games_played"]
            games += 1
            session["games_played"] = games

    if session.get("high_score", None):
        if score > session["high_score"]:
            session["high_score"] = score
    else:
        session["high_score"] = score        

    return jsonify({"high_score" : session["high_score"], "games_played" : session["games_played"]})

    


   