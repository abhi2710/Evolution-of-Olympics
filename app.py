from flask import Flask, render_template
import json


# CREATE FLASK APP INSTANCE
app = Flask("Evolution-of-Olympics")  # creates the Flask instance
data = []


# LOAD DATA FROM CSV
def load_data():
    global data
    data = pandas.read_csv('Crime.csv', low_memory=False)
    print("-----------DATA LOADED--------------")


#########################
###### ROUTES ###########
#########################


# LANDING PAGE ROUTE
@app.route("/")
def landing_page():
    global data

    return render_template('index.html')

if __name__ == "__main__":
    app.run()
