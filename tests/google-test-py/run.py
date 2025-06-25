from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os

selenium_url = os.getenv("SELENIUM_REMOTE_URL", "http://selenium:4444/wd/hub")
options = webdriver.ChromeOptions()

driver = webdriver.Remote(command_executor=selenium_url, options=options)

driver.get("https://www.google.com.au")
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Hi world!!")
search_box.send_keys(Keys.RETURN)

print("✅ Python test complete")
driver.quit()