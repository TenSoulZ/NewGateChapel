"""
Django REST Framework Serializers for New Gate Chapel API.

This module defines serializers for converting model instances to JSON
and vice versa. All serializers with image fields include automatic
absolute URL resolution for proper frontend display.

URL Resolution:
    Image URLs are converted to absolute URLs using the request context.
    Falls back to localhost:8000 for development if request unavailable.
"""

from rest_framework import serializers
from .models import (
    Event, Sermon, Ministry, LiveStream, ServiceSchedule,
    GivingOption, Value, Leadership, ChurchInfo, HomeFeature,
    ContactMessage
)


# =============================================================================
# CONTENT SERIALIZERS - Events, Sermons, Ministries
# =============================================================================

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for Event model.
    
    Automatically converts image field to absolute URL for frontend use.
    """
    class Meta:
        model = Event
        fields = '__all__'

    def to_representation(self, instance):
        """Convert image path to absolute URL if image exists."""
        ret = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                ret['image'] = request.build_absolute_uri(instance.image.url)
            else:
                # Fallback for development when request context missing
                ret['image'] = f"http://localhost:8000{instance.image.url}"
        return ret


class SermonSerializer(serializers.ModelSerializer):
    """
    Serializer for Sermon model.
    
    Automatically converts image field to absolute URL for frontend use.
    """
    class Meta:
        model = Sermon
        fields = '__all__'

    def to_representation(self, instance):
        """Convert image path to absolute URL if image exists."""
        ret = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                ret['image'] = request.build_absolute_uri(instance.image.url)
            else:
                ret['image'] = f"http://localhost:8000{instance.image.url}"
        return ret


class MinistrySerializer(serializers.ModelSerializer):
    """
    Serializer for Ministry model.
    
    Automatically converts image field to absolute URL for frontend use.
    """
    class Meta:
        model = Ministry
        fields = '__all__'

    def to_representation(self, instance):
        """Convert image path to absolute URL if image exists."""
        ret = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                ret['image'] = request.build_absolute_uri(instance.image.url)
            else:
                ret['image'] = f"http://localhost:8000{instance.image.url}"
        return ret


# =============================================================================
# CONFIGURATION SERIALIZERS - Live stream, schedules, giving
# =============================================================================

class LiveStreamSerializer(serializers.ModelSerializer):
    """Serializer for LiveStream model. No image processing needed."""
    class Meta:
        model = LiveStream
        fields = '__all__'


class ServiceScheduleSerializer(serializers.ModelSerializer):
    """Serializer for ServiceSchedule model. No image processing needed."""
    class Meta:
        model = ServiceSchedule
        fields = '__all__'


class GivingOptionSerializer(serializers.ModelSerializer):
    """Serializer for GivingOption model. No image processing needed."""
    class Meta:
        model = GivingOption
        fields = '__all__'


class ValueSerializer(serializers.ModelSerializer):
    """Serializer for church values. No image processing needed."""
    class Meta:
        model = Value
        fields = '__all__'


class LeadershipSerializer(serializers.ModelSerializer):
    """
    Serializer for Leadership model.
    
    Automatically converts image field to absolute URL for frontend use.
    Requires request in context (provided by ViewSet).
    """
    class Meta:
        model = Leadership
        fields = '__all__'
    
    def to_representation(self, instance):
        """Convert image path to absolute URL if image exists."""
        ret = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                ret['image'] = request.build_absolute_uri(instance.image.url)
            else:
                # Fallback for development if request context is missing
                ret['image'] = f"http://localhost:8000{instance.image.url}"
        return ret


# =============================================================================
# SITE CONFIGURATION SERIALIZERS
# =============================================================================

class ChurchInfoSerializer(serializers.ModelSerializer):
    """
    Serializer for global church information (singleton).
    
    Includes all text content, contact info, and social links.
    giving_verses field is JSON array of verse objects.
    """
    class Meta:
        model = ChurchInfo
        fields = '__all__'


class HomeFeatureSerializer(serializers.ModelSerializer):
    """Serializer for homepage features. No image processing needed."""
    class Meta:
        model = HomeFeature
        fields = '__all__'


# =============================================================================
# USER INTERACTION SERIALIZERS
# =============================================================================

class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for contact form submissions.
    
    Read-only fields:
        - created_at: Auto-set on creation
        - replied_at: Auto-set when reply added
    """
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('created_at', 'replied_at')
