from django.core.management.base import BaseCommand
from api.models import Ministry

class Command(BaseCommand):
    help = 'Seeds the initial ministries data'

    def handle(self, *args, **options):
        ministries_data = [
            {
                'icon_name': 'FaUserTie',
                'title': 'Grace Board of Elders',
                'description': 'Providing spiritual oversight and guidance for our church family.',
                'color': '#002855'
            },
            {
                'icon_name': 'FaPray',
                'title': 'Grace Pastoral Assembly',
                'description': 'Leading the congregation with biblical teaching and pastoral care.',
                'color': '#003D7A'
            },
            {
                'icon_name': 'FaBullhorn',
                'title': 'Grace Evangelistic & Outreach Ministry',
                'description': 'Spreading the Gospel and reaching our community with God\'s love.',
                'color': '#0088BF'
            },
            {
                'icon_name': 'FaMale',
                'title': 'Grace Men\'s Fellowship',
                'description': 'Building strong, godly men through fellowship and discipleship.',
                'color': '#00B8E6'
            },
            {
                'icon_name': 'FaFemale',
                'title': 'Grace Women\'s Union',
                'description': 'United in prayer, service, and supporting one another.',
                'color': '#C8102E'
            },
            {
                'icon_name': 'FaUsers',
                'title': 'Grace Youth Fellowship',
                'description': 'Inspiring the next generation to live boldly for Christ.',
                'color': '#A0025C'
            },
            {
                'icon_name': 'FaChild',
                'title': 'Grace Children\'s Ministry',
                'description': 'Nurturing young hearts to know and love Jesus.',
                'color': '#6B1B7F'
            },
            {
                'icon_name': 'FaHeart',
                'title': 'Grace Compassionate & Outreach Ministry',
                'description': 'Showing Christ\'s love through acts of compassion and service.',
                'color': '#00D4FF'
            },
            {
                'icon_name': 'FaMusic',
                'title': 'Grace Music Ministry',
                'description': 'Leading worship and glorifying God through music.',
                'color': '#3C1053'
            },
            {
                'icon_name': 'FaHandsHelping',
                'title': 'Grace Hospitality & Protocol',
                'description': 'Creating a welcoming environment for all who enter our doors.',
                'color': '#00A0D1'
            }
        ]

        for item in ministries_data:
            Ministry.objects.get_or_create(
                title=item['title'],
                defaults={
                    'description': item['description'],
                    'icon_name': item['icon_name'],
                    'color': item['color']
                }
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded ministries'))
