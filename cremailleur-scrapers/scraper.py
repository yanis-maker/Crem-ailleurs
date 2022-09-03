from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from fake_useragent import UserAgent
import re
import json
from env import *
import stem.process
from stem import Signal
from stem.control import Controller
import mysql.connector
import time 

import requests


REGEX_URL = r"https://www.paruvendu.fr/immobilier/*"
REGEX_PRICE = r"[0-9]*.?[0-9]+.?€"
REGEX_SURFACE = r"[0-9]*m<sup>"
REGEX_POSTAL = r"[0-9]{5}"
REGEX_CITY = r"[A-Z][A-zÀ-ÖØ-öø-ÿ\-\']+"

def most_common(lst):
    return max(set(lst), key=lst.count)
        
def GetValidHref(elt):
    href = elt.get_attribute('href')
    if re.match(REGEX_URL, href):
        return href

def ToInt(string):
    return int(re.sub("[^0-9]", "", string))

def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str)
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    if iteration == total:
        print(f'\r{prefix} |{bar}| {percent}% {suffix}')
        print("COMPLETED\n")
    else:
        print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
    # Print New Line on Complete

def SecToTime(seconds):
    hours = seconds//60//60
    seconds = seconds - hours*3600
    minutes = seconds//60
    seconds = seconds - minutes*60
    return f"{int(hours)}:{int(minutes)}:{int(seconds)}"

def switchIP():
    with Controller.from_port(port = 9051) as controller:
        controller.authenticate()
        controller.signal(Signal.NEWNYM)
    if ENABLE_DEBUG:
        print(requests.get(
            url="https://api.ipify.org/",
            proxies={
                'http': TOR_PROXY,
                'https': TOR_PROXY
            }).text)

mydb = mysql.connector.connect(
  host = DB_HOST,
  user = DB_USERNAME,
  password = DB_PASSWORD,
  database = DB_DATABASE
)
mycursor = mydb.cursor()

SOCKS_PORT = 9050
TOR_PATH = TOR_LOCATION
tor_process = stem.process.launch_tor_with_config(
  config = {
    'SocksPort': str(SOCKS_PORT),
    'ControlPort': '9051'
  },
  init_msg_handler = lambda line: print(line) if re.search('Bootstrapped', line) else False,
  tor_cmd = TOR_PATH
)

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('--headless')
chromeOptions.add_argument("user-agent=" + UserAgent().random)
chromeOptions.add_argument('--proxy-server='+TOR_PROXY)
chromeOptions.add_argument("--log-level=3")
chromeOptions.add_argument("enable-automation")
chromeOptions.add_argument("--window-size=1920,1080")
chromeOptions.add_argument("--no-sandbox")
chromeOptions.add_argument("--disable-extensions")
chromeOptions.add_argument("--dns-prefetch-disable")
chromeOptions.add_argument("--disable-gpu")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chromeOptions)


listings = {}

LIST_URL_LEASING_APPART = "https://www.paruvendu.fr/immobilier/annonceimmofo/liste/listeAnnonces?nbp=0&tt=5&tbApp=1&tbDup=1&tbChb=1&tbLof=1&tbAtl=1&tbPla=1&at=1&nbp0=99&pa=FR&ddlFiltres=nofilter"
LIST_URL_LEASING_MAISON = "https://www.paruvendu.fr/immobilier/annonceimmofo/liste/listeAnnonces?nbp=0&tt=5&tbMai=1&tbVil=1&tbCha=1&tbPro=1&tbHot=1&tbMou=1&tbFer=1&at=1&nbp0=99&pa=FR&ddlFiltres=nofilter"
LIST_URL_VENTES_APPART = "https://www.paruvendu.fr/immobilier/annonceimmofo/liste/listeAnnonces?nbp=0&tt=1&tbApp=1&tbDup=1&tbChb=1&tbLof=1&tbAtl=1&tbPla=1&at=1&nbp0=99&pa=FR&ddlFiltres=nofilter"
LIST_URL_VENTES_MAISON = "https://www.paruvendu.fr/immobilier/annonceimmofo/liste/listeAnnonces?nbp=0&tt=1&tbMai=1&tbVil=1&tbCha=1&tbPro=1&tbHot=1&tbMou=1&tbFer=1&at=1&nbp0=99&pa=FR&ddlFiltres=nofilter"

page_nb = 1

print("-----------------------------------------------------------")
qlTime = time.perf_counter()
print("Query List")

while True :
    if page_nb%5 == 0:
        switchIP()

    driver.get(LIST_URL_LEASING_APPART+f"&p={page_nb}")

    if page_nb != 1 and LIST_URL_LEASING_APPART == driver.current_url:
        break

    elements = driver.find_elements(by=By.CSS_SELECTOR, value="#bloc_liste a.voirann")
    for elt in elements:
        link = GetValidHref(elt)
        if link:
            listings[link] = [True, True]

    driver.get(LIST_URL_LEASING_MAISON+f"&p={page_nb}")
    elements = driver.find_elements(by=By.CSS_SELECTOR, value="#bloc_liste a.voirann")
    for elt in elements:
        link = GetValidHref(elt)
        if link:
            listings[link] = [True, False]

    driver.get(LIST_URL_VENTES_APPART+f"&p={page_nb}")
    elements = driver.find_elements(by=By.CSS_SELECTOR, value="#bloc_liste a.voirann")
    for elt in elements:
        link = GetValidHref(elt)
        if link:
            listings[link] = [False, True]

    driver.get(LIST_URL_VENTES_MAISON+f"&p={page_nb}")
    elements = driver.find_elements(by=By.CSS_SELECTOR, value="#bloc_liste a.voirann")
    for elt in elements:
        link = GetValidHref(elt)
        if link:
            listings[link] = [False, False]

    printProgressBar(page_nb, 500)
    page_nb = page_nb + 1

print(f"Query List took {SecToTime(time.perf_counter()-qlTime)}")

print("-----------------------------------------------------------")
ciTime = time.perf_counter()
print("Checking Index")

mycursor.execute("SELECT MAX(id) FROM paru_vendu_index")
maxId = mycursor.fetchall()[0][0] or 0
maxId = maxId + 1

mycursor.execute("SELECT * FROM paru_vendu_index")
index = mycursor.fetchall()

def CheckIndex(link, D):
    try:
        return D[link]
    except:
        return False

for elt in index:
    
    if CheckIndex(elt[1], listings):
        listings.pop(elt[1])
    else:
        mycursor.execute("DELETE FROM paru_vendu_index WHERE id = %s", [elt[0]])
        mydb.commit()
        mycursor.execute('DELETE FROM listings WHERE id = %s AND origin = "paru_vendu_index"', [elt[0]])
        mydb.commit()

def GetPictureFromImg(html):
    url = re.search(r"(?<=attr\('src',')(.*)(?='\);\$\('#pic)", html)
    return url.group(0)


def Scrap(i, url, listing):
    annonce = ["paru_vendu_index", maxId + i, listing[0], listing[1]] #origin, id, leasing, type
    driver.get(url)

    # CITY & POSTAL
    cities = driver.find_elements(By.CSS_SELECTOR, "#detail_loc")
    if cities:
        city = cities[0].get_attribute("innerText")
        city_to_find = re.sub(r"\ \([0-9]{5}\)", "", city)
        if city == "()":
            return None
        else:
            annonce.append(city_to_find)
            annonce.append(re.search(REGEX_POSTAL, city).group(0))
    else:
        return None

    # PRICE
    best_price = [0, 999999999999999999999999999]
    p_source = driver.page_source
    for iter in re.finditer(REGEX_PRICE, p_source):
        for p in re.finditer(r"[Pp][Rr][Ii][Xx]", p_source):
            dist = abs(p.start()-iter.start())
            if dist < best_price[1]:
                best_price[1] = dist
                best_price[0] = ToInt(p_source[iter.start():iter.end()])
    annonce.append(best_price[0])


    # SURFACE
    surface = re.search(REGEX_SURFACE, driver.page_source)
    if surface:
        annonce.append(ToInt(surface.group(0)))
    else:
        annonce.append(0)
    
    # ROOMS
    rooms = driver.find_elements(By.CSS_SELECTOR, ".nbp")
    if rooms:
        annonce.append(ToInt(rooms[0].get_attribute("innerText")))
    else:
        return None

    # DESCRIPTION
    desc = driver.find_elements(By.CSS_SELECTOR, "#txtAnnonceTrunc")
    if desc:
        desc = desc[0].get_attribute("innerText")
    else:
        desc = ""
    annonce.append(desc)

    # IMAGES
    imgs = driver.find_elements(By.CSS_SELECTOR, ".autodet15-zone img")
    if imgs:
        annonce.append(json.dumps(list(map(lambda x: GetPictureFromImg(x.get_attribute('outerHTML')), imgs))))
    else:
        return None

    # CONTACT
    contact = {}
    agency = driver.find_elements(By.CSS_SELECTOR, "#detail_infosvendeur p")
    if agency:
        contact["agency"] = agency[0].get_attribute("innerText")
    annonce.append(json.dumps(contact))

    return annonce

print(f"Cheking Index took {SecToTime(time.perf_counter()-ciTime)}")

print("-----------------------------------------------------------")
qdTime = time.perf_counter()
print("Query Data")

for i, (k, v) in enumerate(listings.items()):
    if i%50 == 0:
        switchIP()

    data = []

    try:
        data = Scrap(i, k, v)
        if data:
            # DATABASE
            mycursor.execute("INSERT INTO paru_vendu_index (id, url) VALUES (%s, %s)", (maxId+i, k))
            mydb.commit()
            mycursor.execute("INSERT INTO listings (origin, id, leasing, type, city, postal, price, surface, rooms, description, images, contact) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", data)
            mydb.commit()
        else:
            if ENABLE_DEBUG:
                print("Missing data at "+k)
    except:
        pass

    printProgressBar(i+1,len(listings))
    
print(f"Query Data took {SecToTime(time.perf_counter()-qdTime)}")

mycursor.close()
mydb.close()
driver.close()
