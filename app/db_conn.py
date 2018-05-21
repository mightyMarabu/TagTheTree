import psycopg2

#try:
#    conn = psycopg2.connect(dbname="postgres", user="postgres", host="192.168.70.134", port="54322", password="postgres")
#    print(conn)
#except Exception as e:
#    print ("\n no f**kin' connection! \n what else can i say?")
#    print(e)

lat = 50
lng = 1
radius = 0.5

#conn_str = psycopg2.connect(dbname='postgres', user='postgres', host='192.168.70.134', port='54322', password='postgres')"

def insert_into_db(function = "landbook.insert_data", params=(lat, lng, radius)):
    connect = psycopg2.connect(dbname='postgres', user='postgres', host='163.172.133.143', port='32779', password='postgres')
    cur = connect.cursor()
    cur.execute("select landbook.insert_data(%s,%s,%s)", params)
    connect.commit()
    connect.close()
    print ("processing.... refresh map.")

def resetMap(function = "landbook.reset_rawdata"):
    connect = psycopg2.connect(dbname='postgres', user='postgres', host='163.172.133.143', port='32779', password='postgres')
    cur = connect.cursor()
    cur.execute("select landbook.reset_rawdata()")
    connect.commit()
    connect.close()
    print ("start by zero")



