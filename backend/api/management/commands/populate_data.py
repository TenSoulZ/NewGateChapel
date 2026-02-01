from django.core.management.base import BaseCommand
from api.models import Event, Sermon, Ministry, LiveStream, ServiceSchedule, Value, Leadership, ChurchInfo

class Command(BaseCommand):
    help = 'Populates the database with initial data from frontend'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating data...')

        # Events
        from datetime import datetime
        def parse_date(date_str):
            if '-' in date_str: # Range like June 10-14, 2026
                date_str = date_str.split('-')[0].strip() + ', ' + date_str.split(',')[-1].strip()
            return datetime.strptime(date_str, '%B %d, %Y').date()

        events_data = [
            {
                'title': 'Easter Sunday Celebration',
                'date': parse_date('April 20, 2026'),
                'time': '9:00 AM',
                'location': 'Main Sanctuary',
                'category': 'Special Service',
                'description': 'Join us for a special Easter celebration with worship, communion, and a powerful message of hope and resurrection.'
            },
            {
                'title': 'Community Outreach Day',
                'date': parse_date('May 15, 2026'),
                'time': '10:00 AM - 4:00 PM',
                'location': 'City Park',
                'category': 'Outreach',
                'description': 'Serving our community with free food, health screenings, and family activities.'
            },
            {
                'title': 'Youth Summer Camp',
                'date': parse_date('June 10-14, 2026'), # Logic handles the range start
                'time': 'All Day',
                'location': 'Mountain Retreat Center',
                'category': 'Youth',
                'description': 'A week of fun, fellowship, and spiritual growth for teens ages 13-18.'
            },
            {
                'title': 'Marriage Enrichment Workshop',
                'date': parse_date('July 8, 2026'),
                'time': '6:00 PM - 9:00 PM',
                'location': 'Fellowship Hall',
                'category': 'Workshop',
                'description': 'Strengthen your marriage with practical tools and biblical wisdom.'
            },
            {
                'title': 'Back to School Blessing',
                'date': parse_date('August 25, 2026'),
                'time': '10:00 AM',
                'location': 'Main Sanctuary',
                'category': 'Special Service',
                'description': 'Praying for students, teachers, and families as the new school year begins.'
            },
            {
                'title': 'Fall Festival',
                'date': parse_date('October 31, 2026'),
                'time': '5:00 PM - 8:00 PM',
                'location': 'Church Grounds',
                'category': 'Family Event',
                'description': 'A safe, fun alternative celebration with games, food, and activities for the whole family.'
            }
        ]

        for data in events_data:
            Event.objects.update_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'Created {len(events_data)} events')

        # Sermons
        sermons_data = [
            {
                'title': "Walking in Faith",
                'date': parse_date("December 10, 2023"),
                'speaker': "Pastor Erasmus Makarimayi",
                'description': "Exploring how faith guides us through life's challenges and uncertainties.",
                'series': "Living Faith Series",
                'category': "Faith",
                'video_url': "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
                'title': "The Power of Prayer",
                'date': parse_date("December 3, 2023"),
                'speaker': "Pastor Erasmus Makarimayi",
                'description': "Understanding prayer as our direct line of communication with God.",
                'series': "Living Faith Series",
                'category': "Spiritual Growth"
            },
            {
                'title': "Love in Action",
                'date': parse_date("November 26, 2023"),
                'speaker': "Pastor Erasmus Makarimayi",
                'description': "How we can demonstrate God's love through our daily actions and choices.",
                'series': "Living Faith Series",
                'category': "Christian Living"
            }
        ]

        for data in sermons_data:
            Sermon.objects.update_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'Created {len(sermons_data)} sermons')

        # Ministries
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

        for data in ministries_data:
            Ministry.objects.get_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'Created {len(ministries_data)} ministries')

        # Service Schedule
        schedule_data = [
            {
                'day': 'Sunday',
                'time': '10:00 AM',
                'timezone': 'America/New_York',
                'type': 'Sunday Morning Worship',
                'description': 'Join us for our weekly worship service with communion'
            },
            {
                'day': 'Wednesday',
                'time': '7:00 PM',
                'timezone': 'America/New_York',
                'type': 'Bible Study',
                'description': 'Mid-week scripture study and discussion'
            }
        ]

        for data in schedule_data:
            ServiceSchedule.objects.get_or_create(type=data['type'], day=data['day'], defaults=data)
        self.stdout.write(f'Created {len(schedule_data)} service schedules')

        # Live Stream Default
        if not LiveStream.objects.exists():
            LiveStream.objects.create(
                title="Sunday Service",
                status="offline",
                description="Join us live every Sunday at 10 AM",
                date="Next Sunday"
            )
            self.stdout.write('Created default Live Stream config')

        # Create Values
        self.stdout.write('Creating values...')
        values_data = [
            {'title': 'Faith', 'description': 'We believe in the power of faith to transform lives', 'icon_name': 'FaHeart', 'order': 1},
            {'title': 'Community', 'description': 'We value authentic relationships and fellowship', 'icon_name': 'FaUsers', 'order': 2},
            {'title': 'Service', 'description': 'We are committed to serving God and others', 'icon_name': 'FaHandsHelping', 'order': 3},
        ]
        for value_data in values_data:
            Value.objects.update_or_create(title=value_data['title'], defaults=value_data)
        
        # Create Leadership
        self.stdout.write('Creating leadership...')
        leadership_data = [
            {
                'name': 'Pastor Erasmus Makarimayi', 
                'role': 'Founder, Visionary', 
                'description': 'Leading our congregation with wisdom and compassion, proclaiming the Grace of God.', 
                'x_url': 'https://x.com/pemakarimayi?s=11',
                'order': 1
            },
        ]
        for leader_data in leadership_data:
            Leadership.objects.update_or_create(name=leader_data['name'], defaults=leader_data)

        # Create/Update Church Info
        self.stdout.write('Updating church info...')
        church_info, created = ChurchInfo.objects.get_or_create(id=1)
        church_info.facebook_url = "https://www.facebook.com/profile.php?id=61557353668205"
        church_info.twitter_url = "https://x.com/newgatechapel1?s=11"
        church_info.save()

        self.stdout.write(self.style.SUCCESS('Data population complete'))
