"""
Django REST Framework ViewSets for the New Gate Chapel API.

This module defines all API viewsets with:
- Pagination for list endpoints
- Caching for performance optimization
- Search and filtering capabilities
- Permission-based access control (public read, authenticated write)

API Endpoints:
    /api/events/ - Church events
    /api/sermons/ - Sermon recordings
    /api/ministries/ - Ministry information
    /api/livestream/ - Live stream configuration
    /api/schedules/ - Service schedules
    /api/giving-options/ - Giving methods
    /api/church-info/ - Global church information
    /api/contact/ - Contact form submissions
"""

from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Event, Sermon, Ministry, LiveStream, ServiceSchedule, GivingOption, Value, Leadership, ChurchInfo, HomeFeature, ContactMessage
from .serializers import (
    EventSerializer, SermonSerializer, MinistrySerializer, LiveStreamSerializer, 
    ServiceScheduleSerializer, GivingOptionSerializer, ValueSerializer, LeadershipSerializer,
    ChurchInfoSerializer, HomeFeatureSerializer, ContactMessageSerializer
)


# =============================================================================
# PAGINATION CONFIGURATION
# =============================================================================

class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination for list endpoints.
    
    Configuration:
        - Default page size: 20 items
        - Client can request custom page size via ?page_size=N
        - Maximum page size: 100 items
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# =============================================================================
# CONTENT VIEWSETS - Public read, authenticated write
# =============================================================================

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for church events.
    
    Provides full CRUD operations for events with:
    - Public read access (list, retrieve)
    - Authenticated write access (create, update, delete)
    - Search by title, description, category, location
    - Ordering by date, title, or created_at
    - 5-minute response caching for list view
    - Pagination (20 items per page)
    
    Example queries:
        GET /api/events/?search=christmas
        GET /api/events/?ordering=-date
        GET /api/events/?page=2&page_size=10
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'location']
    ordering_fields = ['date', 'title', 'created_at']
    ordering = ['-date']

    def get_permissions(self):
        """Public read access, authenticated write access."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def list(self, request, *args, **kwargs):
        """Cache list responses for 5 minutes to reduce database load."""
        return super().list(request, *args, **kwargs)


class SermonViewSet(viewsets.ModelViewSet):
    """
    API endpoint for sermon recordings.
    
    Provides full CRUD operations for sermons with:
    - Public read access (list, retrieve)
    - Authenticated write access (create, update, delete)
    - Search by title, speaker, description, series
    - Ordering by date, title, or speaker
    - 5-minute response caching for list view
    - Pagination (20 items per page)
    
    Example queries:
        GET /api/sermons/?search=faith
        GET /api/sermons/?ordering=-date&search=Pastor John
    """
    queryset = Sermon.objects.all()
    serializer_class = SermonSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'speaker', 'description', 'series']
    ordering_fields = ['date', 'title', 'speaker']
    ordering = ['-date']

    def get_permissions(self):
        """Public read access, authenticated write access."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def list(self, request, *args, **kwargs):
        """Cache list responses for 5 minutes to reduce database load."""
        return super().list(request, *args, **kwargs)

class MinistryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for church ministries.
    
    Provides full CRUD operations for ministries with:
    - Public read access (list, retrieve)
    - Authenticated write access (create, update, delete)
    - Only active ministries shown in list (is_active=True)
    - Search by title and description
    - Manual ordering by 'order' field
    - 2-minute response caching (shorter for quicker updates)
    
    Note: Inactive ministries are filtered out from public view.
    """
    queryset = Ministry.objects.filter(is_active=True)
    serializer_class = MinistrySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'title']
    ordering = ['order', 'title']

    def get_permissions(self):
        """Public read access, authenticated write access."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @method_decorator(cache_page(60 * 2))  # Cache for 2 minutes (reduced for faster updates)
    def list(self, request, *args, **kwargs):
        """Cache list responses for 2 minutes to balance performance and freshness."""
        return super().list(request, *args, **kwargs)


# =============================================================================
# CONFIGURATION VIEWSETS - Live stream and schedules
# =============================================================================

class LiveStreamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for live stream configuration.
    
    Manages live stream settings and status. Typically only one
    instance exists. Auto-creates default config if none exists.
    
    Behavior:
        - Returns all stream configurations
        - Auto-creates default "Sunday Service" if empty
        - No caching (needs real-time status updates)
    """
    queryset = LiveStream.objects.all()
    serializer_class = LiveStreamSerializer

    def list(self, request, *args, **kwargs):
        """
        Get stream configuration, creating default if none exists.
        
        Returns:
            List of stream configurations (typically one item)
        """
        if not LiveStream.objects.exists():
            LiveStream.objects.create(title="Sunday Service", status="offline")
        return super().list(request, *args, **kwargs)

class ServiceScheduleViewSet(viewsets.ModelViewSet):
    """
    API endpoint for service schedules.
    
    Manages regular service times and schedules with:
    - Public read access (list, retrieve)
    - Authenticated write access (create, update, delete)
    - Only active schedules shown (is_active=True)
    - 30-minute caching (schedules rarely change)
    - Ordered by manual 'order' field then day
    """
    queryset = ServiceSchedule.objects.filter(is_active=True)
    serializer_class = ServiceScheduleSerializer
    pagination_class = StandardResultsSetPagination
    ordering = ['order', 'day']

    def get_permissions(self):
        """Public read access, authenticated write access."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def list(self, request, *args, **kwargs):
        """Cache list responses for 30 minutes (schedules change infrequently)."""
        return super().list(request, *args, **kwargs)


# =============================================================================
# CONTENT MANAGEMENT VIEWSETS - Site content and configuration
# =============================================================================

class GivingOptionViewSet(viewsets.ModelViewSet):
    """API endpoint for giving/donation methods. Full CRUD with authentication."""
    queryset = GivingOption.objects.all()
    serializer_class = GivingOptionSerializer


class ValueViewSet(viewsets.ModelViewSet):
    """API endpoint for church core values. Full CRUD with authentication."""
    queryset = Value.objects.all()
    serializer_class = ValueSerializer


class LeadershipViewSet(viewsets.ModelViewSet):
    """
    API endpoint for church leadership/staff.
    
    Provides full CRUD with image URL resolution in serializer context.
    """
    queryset = Leadership.objects.all()
    serializer_class = LeadershipSerializer
    
    def get_serializer_context(self):
        """Add request to context for absolute URL building in serializer."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ChurchInfoViewSet(viewsets.ModelViewSet):
    """
    API endpoint for global church information (singleton).
    
    Manages centralized church content including hero text, about
    sections, contact info, and social links. Auto-creates default
    instance if none exists.
    
    Behavior:
        - Always returns exactly one item in list
        - Auto-creates with defaults if empty
    """
    queryset = ChurchInfo.objects.all()
    serializer_class = ChurchInfoSerializer

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def list(self, request, *args, **kwargs):
        """
        Get singleton church info, creating default if none exists.
        
        Returns:
            List containing single ChurchInfo instance
        """
        if not ChurchInfo.objects.exists():
            ChurchInfo.objects.create()
        
        instance = ChurchInfo.objects.first()
        serializer = self.get_serializer(instance)
        return Response([serializer.data])


class HomeFeatureViewSet(viewsets.ModelViewSet):
    """API endpoint for homepage features. Full CRUD with authentication."""
    queryset = HomeFeature.objects.all()
    serializer_class = HomeFeatureSerializer

    @method_decorator(cache_page(60 * 30))  # Cache for 30 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# =============================================================================
# USER INTERACTION VIEWSETS - Contact forms and submissions
# =============================================================================

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for contact form submissions.
    
    Permissions:
        - Anyone can submit (create) a contact message
        - Only authenticated users can view/manage messages
    
    Usage:
        POST /api/contact/ - Submit contact form (public)
        GET /api/contact/ - View all messages (admin only)
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        """Allow public creation, require authentication for everything else."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
