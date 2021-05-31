import db 
import text_classification as TC
import re
import requests
from bs4 import BeautifulSoup

def geturls():          #본문을 가져올 링크들을 수집하는 함수입니다.
    hrefs = []      #링크들을 저장할 배열입니다.
    for i in range(1):  #처음부터 몇 페이지까지 수집할 지 정할 수 있습니다. 현재 10 
        url = "http://www.jejunu.ac.kr/ara/notice?page="+str(i+1)
        res = requests.get(url)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html5lib")  
        table = soup.select('#board > table')   
        trs = table[0].find_all('tr')
        for idx, tr in enumerate(trs):
            if idx > 1:
                tds = tr.find_all('td')
                hrefs.append(tds[1].a.attrs['href'])
    return hrefs

def getContent(url):                 #본문을 수집합니다.
    data = {}
    res = requests.get(url)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html5lib")
    table = soup.find_all('td')
    data['title'] = table[0].text
    TC.getCategory(table[0].text, data)
    data['writer'] = table[1].text
    data['write_date'] = table[2].text
    if(table[4].img):           #이미지 태그가 소스를 있으면 긁어옵니다.
        data['src'] = "http://www.jejunu.ac.kr"+table[4].img.get('src')     #이미지 주소를 설정해줍니다.
        data['content'] = removeEnter(removeHtmlTag(table[4].get_text()))
    else:
        data['content'] = removeEnter(removeHtmlTag(table[4].get_text()))
    data['originLink'] = url
    if(len(table)==6):              #다운로드할 파일이 있는 지 확인합니다.
        data['downloadtag'] = removeBlank(removeEnter(table[5].div.get_text()))
        data['download'] = table[5].a.get('href')
    return data


def removeHtmlTag(text):
    pattern = '<[^>]*>'
    text = re.sub(pattern=pattern, repl='', string=text)
    text = text.replace('\xa0',"")
    return text

def removeEnter(text):
    text = text.replace('\n',"")
    text = text.replace('\t',"")
    return text

def removeBlank(text):
    text = text.replace(" ", "")
    return text


def crawl():
    querydata = []
    urls = geturls()
    print(urls)
    # for i in range(len(urls)):
    #     querydata.append(getContent(urls[i]))
    # return querydata

print(crawl())