import psycopg2
from psycopg2.extras import RealDictCursor


lat = 50
lng = 1
radius = 0.5

#conn_str = psycopg2.connect(dbname='postgres', user='postgres', host='192.168.70.134', port='54322', password='postgres')"

def insert_into_db(function = "ttt.insert_data", params=(lat, lng, radius)):
    connect = psycopg2.connect(dbname='wupperForst', user='postgres', host='163.172.133.143', port='54321', password='postgres')
    cur = connect.cursor()
    cur.execute("select ttt.insert_data(%s,%s,%s)", params)
    connect.commit()
    connect.close()
    print ("processing.... refresh map.")

def reset_map(function = "ttt.reset_rawdata"):
    connect = psycopg2.connect(dbname='wupperForst', user='postgres', host='163.172.133.143', port='54321', password='postgres')
    cur = connect.cursor()
    cur.execute("select ttt.reset_rawdata()")
    connect.commit()
    connect.close()
    print ("start by zero")

def select_table():
    connect = psycopg2.connect(dbname='wupperForst', user='postgres', host='163.172.133.143', port='54321', password='postgres')
    cur = connect.cursor(cursor_factory = RealDictCursor)
    cur.execute("select id, description from ttt.raw_data")
   # cur.execute("select row_to_json(data) from (select startid, agg_cost, probability from belgium.gravitationresult) as data")
    data = cur.fetchall()
    connect.commit()
    connect.close()
    return data
    print ("Data loaded!")