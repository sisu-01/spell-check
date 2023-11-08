from django.shortcuts import render
from datetime import datetime

def spell_loby(request):
    mess = ''
    room_id = request.GET.get('c', None)
    if room_id == 'sisu':
        context = {}
        response = render(request, 'spell/spell_loby.html', context)
        tomorrow = datetime.replace(datetime.now(), hour=14, minute=59, second=59)
        expires = datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S UTC")
        response.set_cookie('CID',0,expires=expires)
        return response
    if room_id:
        try:
            now = int(datetime.now().strftime('%H%M%S%f')[:-3])
            temp = '0x'+room_id
            cint = int(temp, 16)
            if 0 < now-cint and now-cint < 10000000:
                context = {'room_id':room_id}
                response = render(request, 'spell/spell_invite.html', context)
                tomorrow = datetime.replace(datetime.now(), hour=14, minute=59, second=59)
                expires = datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S UTC")
                response.set_cookie('CID',0,expires=expires)
                return response
            else:
                mess = '만료된 입장코드입니다.'
        except:
            mess = '올바르지 않은 입장코드입니다.'
    else:
        mess = '추천인만 이용 가능합니다.'
    context = {'mess':mess}
    response = render(request, 'spell/spell_404.html', context)
    tomorrow = datetime.replace(datetime.now(), hour=14, minute=59, second=59)
    expires = datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S UTC")
    response.set_cookie('CID',0,expires=expires)
    return response

def spell_room(request):
    if request.method == 'POST':
        if int(request.COOKIES.get('CID')) == 0:
            #참가
            if request.POST.get('room_id'):
                room_id = request.POST.get('room_id')
                context = {
                    'room_id': room_id,
                }
                response = render(request, 'spell/spell_room.html', context)
                tomorrow = datetime.replace(datetime.now(), hour=14, minute=59, second=59)
                expires = datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S UTC")
                response.set_cookie('CID',1,expires=expires)
                return response
            #생성
            else:
                now = int(datetime.now().strftime('%H%M%S%f')[:-3])
                room_id = hex(now)[2:]
                context = {
                    'room_id': room_id,
                }
                response = render(request, 'spell/spell_room.html', context)
                tomorrow = datetime.replace(datetime.now(), hour=14, minute=59, second=59)
                expires = datetime.strftime(tomorrow, "%a, %d-%b-%Y %H:%M:%S UTC")
                response.set_cookie('CID',1,expires=expires)
                return response
    context = {'mess':'올바르지 않은 접근'}
    return render(request, 'spell/spell_404.html', context)