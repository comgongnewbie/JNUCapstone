import requests
import csv
from urllib.request import urlopen
from urllib.parse import quote_plus
from bs4 import BeautifulSoup

pageNum = 1

search = input('파일제목 :')
p = input('크롤링할 페이지 수 :')

lastPage = int(p)
while pageNum < lastPage +1:
    url = f'https://justice.jejunu.ac.kr/justice/index/community/notice.htm?page={pageNum}'

    html = urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')

    notice_title = soup.select('div.board-list-wrap > table > tbody > tr > td.title > a')
    notice_date = soup.select('div.board-list-wrap > table > tbody > tr > td.nowrap')
    searchList = []

    for title in notice_title:
        temp = []
        temp.append(title.get('title'))
        temp.append('https://justice.jejunu.ac.kr'+title.get('href'))
        searchList.append(temp)

    for date in notice_date:
        temp = []
        temp.append(date.text)
        searchList.append(temp)
     
    f = open(f'{search}.csv', 'a', encoding='utf-8', newline='')
    csvWriter = csv.writer(f)
    for title in searchList:
        csvWriter.writerow(title)
    for date in searchList:
        csvWriter.writerow(date)

    f.close()

    print('완료되었습니다.')

    pageNum += 1