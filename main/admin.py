from django.contrib import admin
from .models import District, Facility, Incident, Shift, ShiftGiveawayRequest

class DistrictAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'manager_full_name')
    search_fields = ['name', 'manager__first_name', 'manager__last_name']

    def manager_full_name(self, obj):
        if obj.manager:
            return f'{obj.manager.first_name} {obj.manager.last_name}'
        return None
    
    manager_full_name.short_description = 'Manager'

class FacilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'district', 'manager_name', 'numerical_name')
    search_fields = ['district__name', 'numerical_name']

    def manager_name(self, obj):
        return f'{obj.district.manager.first_name} {obj.district.manager.last_name}'
    
    manager_name.short_description = 'Manager'

class IncidentAdmin(admin.ModelAdmin):
    list_display = ('id', 'facility', 'type', 'date', 'combined_hours', 'created_by', 'created_at')
    search_fields = ['facility__numerical_name', 'type', 'created_by__first_name', 'created_by__last_name']

    def combined_hours(self, obj):
        return f'{obj.start_hour.strftime("%H:%M")} - {obj.end_hour.strftime("%H:%M")}'
    
    combined_hours.short_description = 'Hours'

class ShiftAdmin(admin.ModelAdmin):
    list_display = ('id', 'facility', 'date', 'combined_hours', 'user_full_name')
    search_fields = ['facility__numerical_name', 'user__first_name', 'user__last_name']

    def user_full_name(self, obj):
        if obj.user:
            return f'{obj.user.first_name} {obj.user.last_name}'
        return None
    
    user_full_name.short_description = 'Worker'

    def combined_hours(self, obj):
        return f'{obj.start_hour.strftime("%H:%M")} - {obj.end_hour.strftime("%H:%M")}'
    
    combined_hours.short_description = 'Hours'

class ShiftGiveawayRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'facility', 'date', 'combined_hours', 'created_by', 'created_at', 'taken')
    search_fields = ['facility__numerical_name', 'created_by__first_name', 'created_by__last_name']

    def combined_hours(self, obj):
        return f'{obj.start_hour.strftime("%H:%M")} - {obj.end_hour.strftime("%H:%M")}'
    
    combined_hours.short_description = 'Hours'

admin.site.register(District, DistrictAdmin)
admin.site.register(Facility, FacilityAdmin)
admin.site.register(Incident, IncidentAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(ShiftGiveawayRequest, ShiftGiveawayRequestAdmin)