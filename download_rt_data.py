#!/bin/python3

import requests
import time

def download_file(url):
    local_filename = "./data/" + str(int(time.time()))
    # NOTE the stream=True parameter below
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
    print("Downloaded: {}".format(local_filename))
    return local_filename

while True:
    try:
        download_file("https://sncb-opendata.hafas.de/gtfs/realtime/c21ac6758dd25af84cca5b707f3cb3de")
        time.sleep(30)
    except Exception as error:
        print(error)
