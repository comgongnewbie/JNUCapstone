import db 
import text_classification as TC
import requests
import html
from bs4 import BeautifulSoup
from urllib import parse

def removeEnter(text):
    text = text.replace('\n',"")
    text = text.replace('\t',"")
    return text

def unescape(s):
    s = s.replace("&lt;", "<")
    s = s.replace("&gt;", ">")
    s = s.replace("&amp;", "&")
    return s

def geturls():          #본문을 가져올 링크들을 수집하는 함수입니다.
    hrefs = []      #링크들을 저장할 배열입니다.
    for i in range(9):  #처음부터 몇 페이지까지 수집할 지 정할 수 있습니다. 현재 10 
        url = "https://www.swuniv.kr/38/?page="+str(i+1)
        res = requests.get(url)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html5lib")  
        temp = soup.find_all("a",{"class" : "list_text_title"})
        for idx in range(len(temp)):
            href = "https://www.swuniv.kr/"+unescape(temp[idx].get('href'))
            hrefs.append(href)
    return hrefs



def getContent(url):                 #본문을 수집합니다.
    data = {}
    res = requests.get(url)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html5lib")
    data['title'] = removeEnter(soup.find("header",{"class" : "board-title"}).get_text())
    TC.getCategory(data['title'], data)
    data['writer'] = "관리자"
    if("시") in soup.find("div",{"class" : "date"}).text:
        data['write_date'] = "2021-05-28"
    else:
        data['write_date'] = soup.find("div",{"class" : "date"}).text
    data['SW'] = 1
    data['content'] = html.escape(str(soup.find("div",{"class" : "margin-top-xxl"})))
    data['originLink'] = url
    return data

def find_keys(dict, val):
    return list(key for key, value in dict.items() if value == val)

# "INSERT INTO teambuild(title, content, writer, write_date, notice_num, peopleNum, noticeLink, "+category+") VALUES(?,?,?,NOW(),?,?,?,?)";
def crawl():
    querydata = []
    urls = geturls()
    for i in range(len(urls)):
        querydata.append(getContent(urls[i]))
    for idx in range(len(querydata)):
        category = find_keys(querydata[idx], 1)
        sql = "INSERT INTO notice(title, writer, write_date,"
        for j in range(len(category)):
            sql+=category[j]+","
        sql +="originLink) VALUES(%s,%s,%s,"
        for k in range(len(category)):
            sql+="1,"
        sql += "%s)"
        val = [querydata[idx]['title'],querydata[idx]['writer'],querydata[idx]['write_date'],querydata[idx]['originLink']]
        db.curs.execute(sql, val)
    db.web.commit()   
    db.curs.close

crawl()