from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, SermonViewSet, MinistryViewSet, LiveStreamViewSet, 
    ServiceScheduleViewSet, GivingOptionViewSet, ValueViewSet, LeadershipViewSet,
    ChurchInfoViewSet, HomeFeatureViewSet, ContactMessageViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .auth_views import RegisterView
from .analytics_views import AnalyticsView

router = DefaultRouter()
# ... existing registrations ...
router.register(r'events', EventViewSet)
router.register(r'sermons', SermonViewSet)
router.register(r'ministries', MinistryViewSet)
router.register(r'livestream', LiveStreamViewSet)
router.register(r'schedule', ServiceScheduleViewSet)
router.register(r'giving-options', GivingOptionViewSet)
router.register(r'values', ValueViewSet)
router.register(r'leadership', LeadershipViewSet)
router.register(r'church-info', ChurchInfoViewSet)
router.register(r'home-features', HomeFeatureViewSet)
router.register(r'contact-messages', ContactMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
