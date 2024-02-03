from rest_framework import serializers
from .models import District, Facility, Incident
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'manager']

class FacilitySerializer(serializers.ModelSerializer):
    district = DistrictSerializer()

    class Meta:
        model = Facility
        fields = ['id', 'district', 'numerical_name']


class IncidentSerializer(serializers.ModelSerializer):
    facility = FacilitySerializer()
    created_by = UserSerializer()
    
    class Meta:
        model = Incident
        fields = ['id',
                'facility',
                'type',
                'start_hour',
                'end_hour',
                'date',
                'cameras',
                'description',
                'created_by',
                'created_at']
        