from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event, Sermon, Ministry, Leadership, ContactMessage
import random
from datetime import datetime, timedelta

import traceback
import sys

class AnalyticsView(APIView):
    def get(self, request):
        # Real statistics
        total_events = Event.objects.count()
        total_sermons = Sermon.objects.count()
        total_ministries = Ministry.objects.count()
        total_leadership = Leadership.objects.count()
        total_inquiries = ContactMessage.objects.count()
        unread_inquiries = ContactMessage.objects.filter(is_read=False).count()

        # Simulated trend data (for demonstration)
        months = []
        for i in range(5, -1, -1):
            date = datetime.now() - timedelta(days=i*30)
            months.append(date.strftime('%b'))

        visitor_trends = [
            {'name': month, 'visits': random.randint(1500, 3000)}
            for month in months
        ]

        data = {
            'stats': [
                { 'label': 'Total Events', 'value': str(total_events), 'change': '+2%', 'isPositive': True, 'type': 'event' },
                { 'label': 'Total Sermons', 'value': str(total_sermons), 'change': '+5%', 'isPositive': True, 'type': 'sermon' },
                { 'label': 'Ministries', 'value': str(total_ministries), 'change': '0%', 'isPositive': True, 'type': 'ministry' },
                { 'label': 'New Inquiries', 'value': str(unread_inquiries), 'change': f'/{total_inquiries} total', 'isPositive': unread_inquiries > 0, 'type': 'message' },
            ],
            'visitorTrends': visitor_trends,
            'contentDistribution': [
                {'name': 'Events', 'value': total_events},
                {'name': 'Sermons', 'value': total_sermons},
                {'name': 'Ministries', 'value': total_ministries},
                {'name': 'Inquiries', 'value': total_inquiries},
            ]
        }

        return Response(data)
