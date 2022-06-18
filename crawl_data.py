import requests
import re
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
import csv


def main():
    html = requests.get("https://www.worldometers.info/coronavirus/")
    soup = BeautifulSoup(html.text, "html.parser")
    print(crawling(soup))

# Crawl data


def crawling(soup):
    result_list = soup.find("tbody").find_all("tr")
    covid = []
    for res in result_list:
        cnt = 0
        for r in res.find_all("td"):
            if cnt == 1 or cnt == 2 or cnt == 4 or cnt == 6:
                temp = r.get_text().replace(",", "").replace("\n", "").replace("\t", "")
                if cnt == 1:
                    covid.append(temp)
                else:
                    if temp == 'N/A':
                        covid.append(temp)
                    elif temp == ' ' or temp == '':
                        covid.append('N/A')
                    else:
                        covid.append(int(temp))
            cnt += 1

    # World
    covid = covid[28:]

    # Change the dimensions
    covid2 = []
    temp = []
    cnt = 1
    for h in covid:
        if cnt != 4:
            temp.append(h)
        else:
            temp.append(h)
            covid2.append(temp)
            temp = []
            cnt = 0
        cnt += 1

    data = dict()
    # print(np.shape(covid2)) => (222,4)
    # get data (country,confired,deaths,recovered)

    for i in range(222):
        data[covid2[i][0]] = {"confired": covid2[i][1],
                              "deaths": covid2[i][2], "recovered": covid2[i][3]}
    df = pd.DataFrame({"Covid_Data": data})
    df.to_csv("Covid_Data.csv")

    return data


if __name__ == "__main__":
    main()
