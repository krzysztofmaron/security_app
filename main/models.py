from django.db import models
from django.contrib.auth.models import User

class District(models.Model):
    id = models.AutoField(primary_key=True)                             # AUTOMATIC
    name = models.CharField(max_length=20)                              # MANUAL
    manager = models.ForeignKey(User, on_delete=models.CASCADE)         # MANUAL

    def __str__(self):
        return f'{self.name}'

class Facility(models.Model):
    id = models.AutoField(primary_key=True)                             # AUTOMATIC
    district = models.ForeignKey(District, on_delete=models.CASCADE)    # MANUAL
    numerical_name = models.IntegerField()                              # MANUAL

    def __str__(self):
        return f'{self.numerical_name}'

class Incident(models.Model):
    id = models.AutoField(primary_key=True)                             # AUTOMATIC
    
    typeChoices = (
        ('capture', 'Capture'),
        ('reveal', 'Reveal'),
        ('pass', 'Cashier Pass'),
        ('prevention', 'Prevention'),
    )

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)    # MANUAL
    type = models.CharField(max_length=10, choices=typeChoices)         # MANUAL

    start_hour = models.TimeField()                                     # MANUAL
    end_hour = models.TimeField()                                       # MANUAL
    date = models.DateField()                                           # MANUAL

    cameras = models.CharField(max_length=200)                          # MANUAL ('please enter cameras separated with commas')

    description = models.CharField(max_length=200)                      # MANUAL

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)      # AUTOMATIC
    created_at = models.DateTimeField()                                 # AUTOMATIC

    def __str__(self):
        return f'Incident ID: {self.id}'

class Shift(models.Model):
    id = models.AutoField(primary_key=True)                             # AUTOMATIC

    user = models.ForeignKey(User, on_delete=models.CASCADE)            # AUTOMATIC OR MANUAL

    date = models.DateField()                                           # MANUAL

    start_hour = models.TimeField()                                     # MANUAL
    end_hour = models.TimeField()                                       # MANUAL

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)    # MANUAL

    def __str__(self):
        return f'Shift ID: {self.id}'

class ShiftGiveawayRequest(models.Model):
    id = models.AutoField(primary_key=True)                             # AUTOMATIC

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)      # AUTOMATIC
    created_at = models.DateTimeField()                                 # AUTOMATIC

    date = models.DateField()                                           # AUTOMATIC
    start_hour = models.TimeField()                                     # AUTOMATIC
    end_hour = models.TimeField()                                       # AUTOMATIC

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)    # AUTOMATIC

    taken = models.BooleanField()                                       # AUTOMATIC *(default = False)*

    def __str__(self):
        return f'ShiftGiveawayRequest ID: {self.id}'