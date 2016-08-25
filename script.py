from flask import Flask, render_template #impot the flask object

app=Flask(__name__) #insantiate


@app.route('/') #
def home():
    return render_template("home.html")

@app.route('/about/') #
def about():
    return "Website content goes here"

if __name__=="__main__":
    app.run(debug=True)
