from flask import Flask, render_template, jsonify,request,abort,json #impot the flask object
import pandas as pd
import statsmodels.api as sm
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import warnings
from apiclient.discovery import build
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage
from oauth2client import tools
from google2pandas import *
from pandas.io.json import json_normalize
#import seaborn as sns
from sklearn.linear_model import LinearRegression
from pylab import rcParams
import httplib2
import argparse
#get_ipython().magic(u'matplotlib inline')
from google2pandas import *

app=Flask(__name__) #insantiate


@app.route('/') #
def home():
	return render_template("home.html")

@app.route('/about') #
def about():
    return render_template("about.html")

@app.route('/prog',methods=['GET','POST'])
def data():
	conn = GoogleAnalyticsQuery(secrets='./ga-creds/client_secrets.json', token_file_name='./ga-creds/analytics.dat')
	s=request.form['score']
	if request.method=='POST':
		query = {
		   'ids'           : 'ga:' + s,
		   'metrics'       : 'ga:sessions,ga:pageviews,ga:bounceRate,ga:uniquePageviews,ga:avgTimeOnPage,ga:users',
		   'dimensions'    : ['ga:pageTitle,ga:pagePath'],
		   'start_date'    : '2015-04-01',
		    'filters'    :'ga:sessions>50',
		         'end_date':'2015-06-30'
		}
		 
		df, metadata = conn.execute_query(**query)

		savg = round(np.mean(df['sessions']))
		pavg = round(np.mean(df['pageviews']))
		bravg = round(np.mean(df['bounceRate'].astype(float)))
		upavg = round(np.mean(df['uniquePageviews']))
		topavg = round(np.mean(df['avgTimeOnPage'].astype(float)))
		uavg = round(np.mean(df['users']))

		#print "Average of Sessions:", savg
		#print "Average of pageviews:", pavg
		#print "Average of Unique Pageviews:", upavg
		#print "Average of Users:", uavg
		#print "Average of Time on Page:", topavg
		#print "Average of Bounce Rate:", bravg


		#3) Calling the data of different timeline


		query = {
		   'ids'           : 'ga:' + s,
		   'metrics'       : 'ga:sessions,ga:pageviews,ga:bounceRate,ga:uniquePageviews,ga:avgTimeOnPage,ga:users',
		   'dimensions'    : ['ga:pageTitle,ga:pagePath'],
		   'start_date'    : '2015-07-01',
		    'filters'    :'ga:sessions>50',
		         'end_date':'2016-08-01'}
		 
		dt, metadata = conn.execute_query(**query)
		#print dt


		#data1=dt
		#4) Adding new columns that would calculate the performance against expecations

		dt['S.Avg']=(dt['sessions']/savg)*100
		dt['P.Avg']=(dt['pageviews']/pavg)*100
		dt['UP.Avg']=(dt['uniquePageviews']/upavg)*100
		dt['US.Avg']=(dt['users']/uavg)*100
		dt['TOP.Avg']=(dt['avgTimeOnPage'].astype(float)/topavg)*100
		dt['BR.Avg']=(dt['bounceRate'].astype(float)/bravg)*100


		#5) Sorting the data

		#data3=data1[['pageTitle','S.Avg','P.Avg','UP.Avg','US.Avg','TOP.Avg','BR.Avg']]

		#6) Adding the X value

		dt['X.avg']=(dt[['S.Avg','P.Avg','UP.Avg','US.Avg','TOP.Avg','BR.Avg']].mean(axis=1))/100
		#print data3

		#7) Adding the One Metric Score

		dt['One Metric Score']=(27*np.log(dt['X.avg']))+50
		#print data3

		#8) Sorting the data

		data4=dt[['pageTitle','One Metric Score']]

		result=data4.sort(['One Metric Score'],ascending=False)
		z=result.reset_index().to_json(orient='records')
		#response=make_template("about.html",message1=z)
		#return response(json.dumps(message1),mimetype='application/json')
		return render_template("about.html",message1=z)

		#return data()
		#return json.dumps({'page':pageTitle,'oms':One Metric Score}),200,{'Content-Type':'application/json'}
	#list = [{"index":0,"pageTitle":"Retirement income planning | ESUPERFUND","One Metric Score":101.8777074266},{"index":1,"pageTitle":"Setting up a super pension with ESUPERFUND","One Metric Score":90.149498988},{"index":2,"pageTitle":"Transition to retirement | ESUPERFUND","One Metric Score":89.0022635314},{"index":3,"pageTitle":"SMSF with your Partner | ESUPERFUND","One Metric Score":73.1380784711},{"index":4,"pageTitle":"How Much is Enough | ESUPERFUND","One Metric Score":70.3693085105},{"index":5,"pageTitle":"Spouse contribution splitting | ESUPERFUND","One Metric Score":67.8058985764},{"index":6,"pageTitle":"SMSF Deep Dive | ESUPERFUNDD","One Metric Score":56.7751521047},{"index":7,"pageTitle":"How to make your pension last longer | ESUPERFUND","One Metric Score":53.5992300729},{"index":8,"pageTitle":"Fast Track | ESUPERFUND","One Metric Score":51.9529818033},{"index":9,"pageTitle":"Must know rules about purchasing property with borrowing in an SMSF | ESUPERFUND","One Metric Score":44.1982412224},{"index":10,"pageTitle":"SMSF investment classes | ESUPERFUND","One Metric Score":43.8241313834},{"index":11,"pageTitle":"Changes and Updates to SMSF Rules | ESUPERFUND","One Metric Score":34.9053297622},{"index":12,"pageTitle":"3 Things to Look For | ESUPERFUND","One Metric Score":31.9694826743},{"index":13,"pageTitle":"Future Proofing | ESUPERFUND","One Metric Score":31.0390778945},{"index":14,"pageTitle":"How to find lost super | ESUPERFUND","One Metric Score":30.8593407057},{"index":15,"pageTitle":"Avoid the Pitfalls | ESUPERFUND","One Metric Score":30.7220673876},{"index":16,"pageTitle":"Why Self Managed Super Funds | ESUPERFUND","One Metric Score":30.5874896245},{"index":17,"pageTitle":"Buy Property With A SMSF | ESUPERFUND","One Metric Score":30.2211350961},{"index":18,"pageTitle":"DIY Revolution | ESUPERFUND","One Metric Score":30.116039113},{"index":19,"pageTitle":"FAQs about SMSFs and Property | ESUPERFUND","One Metric Score":25.2677418193},{"index":20,"pageTitle":"4 Things to Know | ESUPERFUND","One Metric Score":24.3695644595},{"index":21,"pageTitle":"How we keep your SMSF fees low | ESUPERFUND","One Metric Score":21.1010280195},{"index":22,"pageTitle":"Case Study - Buy Property with Borrowings | ESUPERFUND","One Metric Score":20.4868460756},{"index":23,"pageTitle":"Choosing the right super investment options | ESUPERFUND","One Metric Score":20.1484586771},{"index":24,"pageTitle":"The Rort - Percentage Fees in Super | ESUPERFUND","One Metric Score":20.0108559133},{"index":25,"pageTitle":"SMSF Playbook | ESUPERFUND","One Metric Score":18.6620120294}]

def prepare_credentials():
	CLIENT_SECRETS = 'client_secrets.json'
	FLOW = flow_from_clientsecrets(CLIENT_SECRETS,scope='https://www.googleapis.com/auth/analytics.readonly',message='%s is missing' % CLIENT_SECRETS)
 	TOKEN_FILE_NAME = 'credentials.dat'
 	parser = argparse.ArgumentParser(parents=[tools.argparser])
 	flags = parser.parse_args()
	storage = Storage(TOKEN_FILE_NAME)
	credentials = storage.get()
	if credentials is None or credentials.invalid:
		credentials = tools.run_flow(FLOW, storage, flags)
	return credentials
 
 
def initialize_service():
	http = httplib2.Http()
	credentials = prepare_credentials()
	http = credentials.authorize(http)
	return build('analytics', 'v3', http=http)
 
@app.route('/clients/')
def clients():
	service = initialize_service()
	accounts = service.management().accounts().list().execute()
	return jsonify(results=accounts)

@app.route('/profile', methods=['GET','POST'])
def profile():
	#service = initialize_service()
	#accounts = service.management().accounts().list().execute()
	#return jsonify(results=accounts)
	service = initialize_service()
	text=request.form['text']
	#webproperties = service.management().webproperties().list(accountId=text).execute()
	if request.method=='POST':
		webproperties = service.management().webproperties().list(accountId=text).execute()
		return render_template("about.html",message=webproperties)
      
	#profiles = service.management().profiles().list(accountId=52794826,webPropertyId='UA-52794826-1').execute()
	#return jsonify(results=webproperties)
	#return render_template("about.html",webproperties=message)
	#return profile.get()


if __name__=="__main__":
    app.run(port=8000,debug=True)
    app.run(threaded=True)
