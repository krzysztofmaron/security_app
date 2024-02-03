from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group

from datetime import datetime, timedelta

from .models import District, Incident, Facility



def base(request):
    user = request.user
    is_manager = False

    if user.is_authenticated:
        if user.groups.filter(name='manager').exists():
            is_manager = True

    context = {
        'is_manager': is_manager,
    }
    return redirect('incidents')
    return render(request, 'main/base.html', context)

@login_required
def incidents(request):


    def get_last_monday():
        today = datetime.today()
        days_since_monday = today.weekday()
        days_to_subtract = (days_since_monday + 6) % 7
        last_monday = today - timedelta(days=days_to_subtract)
        return last_monday
    
    
    user = request.user
    is_manager = False

    if user.is_authenticated:
        if user.groups.filter(name='manager').exists():
            is_manager = True

    districts = District.objects.all

    last_monday = get_last_monday()
    end_date = last_monday + timedelta(days=6)

    weeklyCaptures = Incident.objects.filter(date__range=[last_monday, end_date], type='capture')
    weeklyReveals = Incident.objects.filter(date__range=[last_monday, end_date], type='reveal')
    weeklyPasses = Incident.objects.filter(date__range=[last_monday, end_date], type='pass')
    weeklyPreventions = Incident.objects.filter(date__range=[last_monday, end_date], type='prevention')

    labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    facilities = Facility.objects.all

    context = {
        'districts' : districts,
        'is_manager' : is_manager,
        'facilities' : facilities,
        'weeklyCaptures': weeklyCaptures,
        'weeklyReveals': weeklyReveals,
        'weeklyPasses': weeklyPasses,
        'weeklyPreventions': weeklyPreventions,
        'labels': labels,
    }

    return render(request, 'main/incidents.html', context)

def statistics(request):
    return render(request, 'main/statistics.html')

def calendar(request):
    return render(request, 'main/calendar.html')
    
def documents(request):
    return render(request, 'main/documents.html')


from .serializers import IncidentSerializer
from django.http import JsonResponse

def incidents_list(request):
    if request.method == 'GET':
        queryset = Incident.objects.all()
        serializer = IncidentSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)