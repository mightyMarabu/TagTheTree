from flask import Flask, render_template, Response, jsonify
from db_conn import insert_into_db, reset_map, select_table
import json

app = Flask(__name__)
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/save/")
def submit():
    sub = {"id":"2"}
    sub = ["What am", "I doing?"]
    sub = insert_into_db()
    return Response(json.dumps(sub), mimetype = "application/json")

@app.route("/save/<lat>/<lng>/<radius>")
def savePoint(lat, lng, radius):
    sub = insert_into_db("ttt.insert_data", (lat,lng,radius))
    return jsonify("data submitted!")

@app.route("/getData/")
def getData():
    dat = select_table()
    return Response(json.dumps(dat), mimetype = "application/json")
    return "data loaded!"

@app.route("/reset/")
def reset():
    res = {"id":"3"}
    res = reset_map()
    return jsonify("map reseted!")
#    return Response(json.dumps(res), mimetype = "application/json")

if __name__ == "__main__":
 #   app.run(debug = True)
    app.run(host='0.0.0.0', port=80)