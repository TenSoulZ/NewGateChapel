from django.contrib import admin
from .models import (
    Event, Sermon, Ministry, LiveStream, ServiceSchedule,
    GivingOption, Value, Leadership, ContactMessage
)
from django.contrib import messages
from django.utils.translation import ngettext

@admin.action(description='Archive selected streams as Sermons')
def archive_stream_as_sermon(modeladmin, request, queryset):
    count = 0
    for stream in queryset:
        if stream.embed_url:
            Sermon.objects.create(
                title=stream.title or "Archived Live Stream",
                date=stream.date or "Unknown Date",
                speaker="Unknown Speaker", # Default, can be edited later
                description=stream.description or "Archived from Live Stream",
                video_url=stream.embed_url,
                category="Sunday Service", # Default category
                series="Live Stream Archive"
            )
            count += 1
    
    modeladmin.message_user(request, ngettext(
        '%d sermon was successfully created from stream.',
        '%d sermons were successfully created from streams.',
        count,
    ) % count, messages.SUCCESS)

class LiveStreamAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'is_live', 'date')
    actions = [archive_stream_as_sermon]

class SermonAdmin(admin.ModelAdmin):
    list_display = ('title', 'speaker', 'date', 'category')
    search_fields = ('title', 'speaker', 'description')

class GivingOptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    search_fields = ('title', 'description')

admin.site.register(Event)
admin.site.register(Sermon, SermonAdmin)
admin.site.register(Ministry)
admin.site.register(LiveStream, LiveStreamAdmin)
admin.site.register(ServiceSchedule)
admin.site.register(GivingOption, GivingOptionAdmin)
admin.site.register(Value)
admin.site.register(Leadership)

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)

admin.site.register(ContactMessage, ContactMessageAdmin)
