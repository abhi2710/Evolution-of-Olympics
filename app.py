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


@app.route("/timeline/<string:season>")
def list_season_years(season):
    df = pd.read_csv("static/data/participation_all.csv")
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    return pd.DataFrame(df.Year.unique()).to_json(orient="table")


@app.route("/scatter/bmi", defaults={"year": None, "season": None})
@app.route("/scatter/bmi/<int:year>/<string:season>")
def scatter_bmi(year, season):
    df = pd.read_csv("static/data/bmi_scatter.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
        except Exception:
            pass
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    return df[['Age', 'bmi','Name','Event']].to_json(orient='table')


@app.route("/scatter/bmi", defaults={"region": None, "season": None})
@app.route("/scatter/bmi/<string:region>/<string:season>")
def scatter_bmi_region(region, season):
    df = pd.read_csv("static/data/bmi_scatter.csv")
    if region:
        try:
            df = df[df.region == region]
        except Exception:
            pass
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    return df[['Age', 'bmi','Name','Event']].to_json(orient='table')


@app.route("/participation/all", defaults={"year": None, "season": None})
@app.route("/participation/all/<string:year>/<string:season>")
def participation_all(year, season):
    df = pd.read_csv("static/data/participation_all.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
        except Exception:
            pass
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    return df[["Region", "NOC", "Year", "Count"]].to_json(orient='table')


@app.route(
        "/participation/<string:noc>/<string:country>/<string:season>",
        defaults={"year": None})
def participation_country(noc, country, season, year):
    df = pd.read_csv("static/data/participation_all.csv")
    df = df[df['Season'] == season]
    df = df.ix[(df['NOC'] == noc) | (df['Region'] == country)]
    df = df.groupby(['Region', 'Year']).sum()
    return df.to_json(orient='table')

    df[df.NOC == country]
    if year:
        try:
            df = df[df.Year == int(year)]
        except Exception:
            pass
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    return df.to_json(orient='table')


@app.route("/medals/all", defaults={"year": None, "season": None})
@app.route("/medals/all/<string:year>/<string:season>")
def medals_all(year, season):
    df = pd.read_csv("static/data/medals_all.csv")
    if year:
        try:
            year = int(year)
            df = df[df.Year == year]
        except Exception:
            pass
    if season:
        try:
            df = df[df.Season == season]
        except Exception:
            pass
    data = {}
    for index, row in df.iterrows():
        data[row['NOC']] = row['Count']
        data[row['Region']] = row['Count']
    return json.dumps(data)


@app.route(
        "/medals/<string:country>/<string:season>",
        defaults={"region": None})
@app.route("/medals/<string:country>/regions/<string:region>/<string:season>")
def medals_country(country, region, season):
    df = pd.read_csv("static/data/medals_all.csv")
    df = df[df['Season'] == season]
    df = df.ix[(df['NOC'] == country) | (df['Region'] == region)]
    df = df.groupby(['Region', 'Year']).sum()
    return df.to_json(orient='table')


@app.route(
        "/gender/<string:year>/regions/<string:region>/seasons/<string:season>"
        )
def gender_year_country(year, region, season):
    limit = False
    allowed_countries = []
    df = pd.read_csv("static/data/sex_scatter.csv")
    if year != "all":
        try:
            year = int(year)
            df = df[df.Year == year]
            allowed_countries = df.groupby('Region')['Count'].sum()
            allowed_countries = allowed_countries.sort_values(ascending=False)
            allowed_countries = list(allowed_countries.index)[:40]
            limit = True
        except Exception as e:
            print(e)
            pass
    else:
        df = df[df.Region == region]

    if season:
        df = df[df.Season == season]

    df = df.groupby(['Region', 'Year', 'Sex'])['Count'].mean().reset_index()
    if limit:
        df = df[df.Region.isin(allowed_countries)]
    return df.to_json(orient='table')


@app.route("/medals/games/<string:region>")
def medals_games(region):
    df = pd.read_csv("static/data/medals_games.csv")
    if region:
        try:
            df = df[df.Region == region]
            pass
        except Exception:
            pass
    data = {}
    for index, row in df.iterrows():
        if row['Sport'] not in data:
            data[row['Sport']]={}
        else:
            data[row['Sport']][row['Event']] = row['Count']

    result = {
        "name":region,
        "children":[]
        }
    for sport in data:
        obj={
            "name":sport,
            "children":[]
        }
        for event in data[sport]:
            obj["children"].append({
                "name":event,
                "size":data[sport][event]
            })
        result["children"].append(obj)
    print(result)
    return json.dumps(result);

if __name__ == "__main__":
    # load_data()
    app.run(debug=True)
