from flask import Flask, request, redirect as rdr
from flask_cors import CORS 
import mysql.connector
from env import *
import json

mydb = mysql.connector.connect(
  host = DB_HOST,
  user = DB_USERNAME,
  password = DB_PASSWORD,
  database = DB_DATABASE
)
mycursor = mydb.cursor(buffered=True)

app = Flask(__name__)
CORS(app)

def sqlFetch (sqlReq):
    print(sqlReq)
    mycursor.execute(sqlReq)
    return mycursor.fetchall()

def SQLAddOnArgs(sqlReq, argCount, argsMax):
    if argCount < argsMax:
        sqlReq = sqlReq + " AND "
    return sqlReq

@app.route('/search', methods=['GET'])
def search():
    sqlReq = "SELECT * FROM listings WHERE "
    argCount = 0
    argsMax = len(request.args)
    for arg in request.args:
        argCount = argCount + 1
        value = request.args.get(arg)
        match arg:
            case "city" | "postal":
                sqlReq = sqlReq + f'{arg} = "{value.lower()}"'
                
            
            case "leasing" | "rooms" | "type":
                sqlReq = sqlReq + f"{arg} = {value}"
                

            case "minprice" | "minsurface":
                sqlReq = sqlReq + f"{arg[3:]} >= {value}"

            case "maxprice" | "maxsurface":
                sqlReq = sqlReq + f"{arg[3:]} <= {value}"
                

        sqlReq = SQLAddOnArgs(sqlReq, argCount, argsMax)

    result = sqlFetch(sqlReq)
    data = []
    for elt in result:
        data.append({
            "origin": elt[0],
            "id": elt[1],
            "type": bool(elt[2]),
            "leasing": bool(elt[3]),
            "city": elt[4],
            "postal": elt[5],
            "price": elt[6],
            "surface": elt[7],
            "rooms": elt[8],
            "description": elt[9],
            "images": json.loads(elt[10]),
            "contact": json.loads(elt[11]),
        })
    return json.dumps(data), 200


@app.route('/id', methods=['GET'])
def id():
    result = sqlFetch(f'SELECT * FROM listings WHERE origin="{request.args.get("origin")}" AND id={request.args.get("id")}')[0]
    data = {
        "origin": result[0],
        "id": result[1],
        "type": bool(result[2]),
        "leasing": bool(result[3]),
        "city": result[4],
        "postal": result[5],
        "price": result[6],
        "surface": result[7],
        "rooms": result[8],
        "description": result[9],
        "images": json.loads(result[10]),
        "contact": json.loads(result[11]),
    }
    return json.dumps(data), 200

@app.route('/cities', methods=['GET'])
def cities():
    result = sqlFetch("SELECT DISTINCT city FROM listings")
    return json.dumps(list(map(lambda x: x[0], result))), 200

@app.route('/geturl', methods=['GET'])
def geturl():
    result = sqlFetch(f'SELECT url FROM {request.args.get("origin")} WHERE id={request.args.get("id")}')[0]
    return json.dumps({"url": result[0]}), 200

@app.route('/redirect', methods=['GET'])
def redirect():
    result = sqlFetch(f'SELECT url FROM {request.args.get("origin")} WHERE id={request.args.get("id")}')[0]
    return rdr(result[0], code = 302)

if __name__ == '__main__':
    app.run(host=API_IP, port=API_PORT, threaded=True)