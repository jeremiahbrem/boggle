from unittest import TestCase
from app import app
from flask import Flask, session, json
from boggle import Boggle
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):
    """testing view functions in app.py"""

    def test_generate_gameboard(self):
        """Testing whether game board shows up properly on page load"""
        
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>BOGGLE</h1>", html)
            self.assertIn("<table>", html)
            for row in session["board"]:
                for letter in row:
                    self.assertIn(letter, html)

    def test_is_valid_word(self):
        """Testing if correct response is given to user word submission"""
     
        with app.test_client() as client:
            board = [["A","T","E","G","Z"],
                     ["X","S","J","R","S"],
                     ["E","D","X","E","D"],
                     ["S","W","Q","Z","E"],
                     ["S","A","X","N","Z"]]
            with client.session_transaction() as change_session:    
                change_session["board"] = board     
            resp = client.get("/handle_guess?guess=ate")
            result = resp.get_json()
            self.assertEqual(result["result"], "ok")     
            resp = client.get("/handle_guess?guess=apple")
            result = resp.get_json()
            self.assertEqual(result["result"], "not-on-board")     
            resp = client.get("/handle_guess?guess=dsfhsadj")
            result = resp.get_json()
            self.assertEqual(result["result"], "not-word")     

    def test_update_high_score(self):
        """Testing if high score and games_played are correctly updated"""
        
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["high_score"] = 20
                change_session["games_played"] = 0
            resp = client.post("/score", json={"score" : "30", "updateGames" : True})
            result = resp.get_json()
            self.assertEqual(result["high_score"], 30)
            self.assertEqual(session["high_score"], 30)
            self.assertEqual(session["games_played"], 1)
            resp = client.post("/score", json={"score" : "25", "updateGames" : True})
            result = resp.get_json()
            self.assertEqual(result["high_score"], 30)
            self.assertEqual(session["high_score"], 30)
            self.assertEqual(session["games_played"], 2)
    




           


