import pandas as pd
import statsmodels.api as sm
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import warnings
#import seaborn as sns
from sklearn.linear_model import LinearRegression
from pylab import rcParams
#get_ipython().magic(u'matplotlib inline')
from google2pandas import *
 
warnings.filterwarnings('ignore')


#1) Calling data from GA


conn = GoogleAnalyticsQuery(secrets='./ga-creds/client_secrets.json', token_file_name='./ga-creds/analytics.dat')
 
query = {
   'ids'           : '1215574',
   'metrics'       : 'ga:sessions,ga:pageviews,ga:bounceRate,ga:uniquePageviews,ga:avgTimeOnPage,ga:users',
   'dimensions'    : ['ga:pageTitle,ga:pagePath'],
   'start_date'    : '2015-04-01',
    'filters'    :'ga:pagePath=~\Q.html\E$;ga:pagePath=@/articles/;ga:sessions>50',
         'end-date':'2015-06-30'
}
 
df, metadata = conn.execute_query(**query)
#print df


data=df

#2) Performing the average of all the metrics


savg = round(np.mean(data['sessions']))
pavg = round(np.mean(data['pageviews']))
bravg = round(np.mean(data['bounceRate'].astype(float)))
upavg = round(np.mean(data['uniquePageviews']))
topavg = round(np.mean(data['avgTimeOnPage'].astype(float)))
uavg = round(np.mean(data['users']))

print "Average of Sessions:", savg
print "Average of pageviews:", pavg
print "Average of Unique Pageviews:", upavg
print "Average of Users:", uavg
print "Average of Time on Page:", topavg
print "Average of Bounce Rate:", bravg


#3) Calling the data of different timeline


query = {
   'ids'           : '1215574',
   'metrics'       : 'ga:sessions,ga:pageviews,ga:bounceRate,ga:uniquePageviews,ga:avgTimeOnPage,ga:users',
   'dimensions'    : ['ga:pageTitle,ga:pagePath'],
   'start_date'    : '2015-07-01',
    'filters'    :'ga:pagePath=~\Q.html\E$;ga:pagePath=@/articles/;ga:sessions>50',
         'end-date':'2016-08-01'}
 
dt, metadata = conn.execute_query(**query)
#print dt


data1=dt
#4) Adding new columns that would calculate the performance against expecations

data1['S.Avg']=(data1['sessions']/savg)*100
data1['P.Avg']=(data1['pageviews']/pavg)*100
data1['UP.Avg']=(data1['uniquePageviews']/upavg)*100
data1['US.Avg']=(data1['users']/uavg)*100
data1['TOP.Avg']=(data1['avgTimeOnPage'].astype(float)/topavg)*100
data1['BR.Avg']=(data1['bounceRate'].astype(float)/bravg)*100


#5) Sorting the data

data3=data1[['pageTitle','S.Avg','P.Avg','UP.Avg','US.Avg','TOP.Avg','BR.Avg']]

#6) Adding the X value

data3['X.avg']=(data3[['S.Avg','P.Avg','UP.Avg','US.Avg','TOP.Avg','BR.Avg']].mean(axis=1))/100
print data3

#7) Adding the One Metric Score

data3['One Metric Score']=(27*np.log(data3['X.avg']))+50
print data3

#8) Sorting the data

data4=data3[['pageTitle','One Metric Score']]

result=data4.sort(['One Metric Score'],ascending=False)
result
print result

ax = result[['One Metric Score']].plot(kind='bar', title ="One Metric Score",figsize=(15,10),legend=True, fontsize=12)
ax.set_xlabel(data4['pageTitle'])


#ax = sns.barplot("size", y=result[['One Metric Score']], data=result,color="salmon", saturation=.5)

plt.show()






