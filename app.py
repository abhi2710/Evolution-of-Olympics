from flask import Flask, render_template
import pandas as pd
import json

# CREATE FLASK APP INSTANCE
app = Flask(__name__)  # creates the Flask instance
data = []


# LOAD DATA FROM CSV
def load_data():
    global data
    data = pd.read_csv('olympics.csv', low_memory=False)
    print("-----------DATA LOADED--------------")


#########################
#        ROUTES         #
#########################


# LANDING PAGE ROUTE
@app.route("/")
def landing_page():
    return render_template('index.html')


@app.route("/env/vloki")
def env_vloki():
    return render_template('vloki.html')


@app.route("/scatter/bmi", defaults={"year": None})
@app.route("/scatter/bmi/<int:year>")
def scatter_bmi(year):
    df = pd.read_csv("static/data/bmi_scatter.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
        except Exception:
            pass
    return df[['Age', 'bmi']].to_json(orient='table')


@app.route("/participation/all", defaults={"year": None})
@app.route("/participation/all/<string:year>")
def participation_all(year):
    df = pd.read_csv("static/data/participation_all.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
        except Exception:
            pass
    return df.to_json(orient='table')


@app.route("/participation/<string:country>", defaults={"year": None})
@app.route("/participation/<string:country>/<string:year>")
def participation_country(country, year):
    df = pd.read_csv("static/data/participation_all.csv")
    df = df[df.NOC == country]
    if year:
        try:
            df = df[df.Year == int(year)]
        except Exception:
            pass
    return df.to_json(orient='table')


@app.route("/medals/all", defaults={"year": None})
@app.route("/medals/all/<string:year>")
def medals_all(year):
    df = pd.read_csv("static/data/medals_all.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
            pass
        except Exception:
            pass
    data = {}
    for index, row in df.iterrows():
        data[row['NOC']] = row['Count']
        data[row['Region']] = row['Count']
    return json.dumps(data)


@app.route("/medals/<string:country>", defaults={"year": "all"})
@app.route("/medals/<string:country>/<string:year>")
def medals_country(country, year):
    df = pd.read_csv("static/data/medals_all.csv")
    df = df[df.NOC == country]
    if year:
        try:
            # df = df[df.Year == int(year)]
            pass
        except Exception:
            pass
    return df.to_json(orient='table')


if __name__ == "__main__":
    # load_data()
    app.run(debug=True)
