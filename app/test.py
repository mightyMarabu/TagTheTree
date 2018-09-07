import psycopg2

try:
    conn = psycopg2.connect(dbname="postgres", user="postgres", host="192.168.70.134", port="54322", password="postgres")
    print(conn)
    print ("\n sucess!")
except Exception as e:
    print ("\n no f**kin' connection! \n what else can i say?")
    print(e)