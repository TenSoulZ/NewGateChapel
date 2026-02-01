"""
Django models for the New Gate Chapel church management system.

This module defines all database models including:
- Content models (Events, Sermons, Ministries)
- Configuration models (ChurchInfo, LiveStream, ServiceSchedule)
- User interaction models (ContactMessage, GivingOption)
- Static content models (Values, Leadership, HomeFeature)

All models include optimized database indexes for improved query performance.
"""

from django.db import models


# =============================================================================
# CONTENT MODELS - User-facing dynamic content
# =============================================================================

class Event(models.Model):
    """
    Represents church events (services, gatherings, activities).
    
    Events are displayed on the Events page and filtered by category.
    Database indexes optimize queries by date and category.
    
    Fields:
        title: Event name
        date: Event date (indexed for sorting)
        time: Event time (separate from date for flexibility)
        location: Event venue
        category: Event type (indexed for filtering)
        description: Full event details
        image: Optional event image
        created_at: Auto-set on creation
        updated_at: Auto-updated on modification
    """
    title = models.CharField(max_length=200, db_index=True)
    date = models.DateField(db_index=True)  # Changed to DateField
    time = models.CharField(max_length=100, null=True, blank=True)  # Changed to CharField for flexibility (e.g. "All Day")
    location = models.CharField(max_length=200)
    category = models.CharField(max_length=100, db_index=True)
    description = models.TextField()
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['-date', 'category']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title

class Sermon(models.Model):
    """
    Represents sermon recordings and details.
    
    Sermons can be organized by speaker and series, with video URLs
    for playback. Optimized for queries by date, speaker, and series.
    
    Fields:
        title: Sermon title
        date: Date delivered (indexed)
        speaker: Name of speaker (indexed)
        description: Sermon summary/notes
        series: Optional sermon series name (indexed)
        category: Sermon category/topic (indexed)
        video_url: YouTube or other video platform URL
        image: Optional sermon thumbnail
    """
    title = models.CharField(max_length=200, db_index=True)
    date = models.DateField(db_index=True)  # Changed to DateField
    speaker = models.CharField(max_length=100, db_index=True)
    description = models.TextField()
    series = models.CharField(max_length=200, blank=True, null=True, db_index=True)
    category = models.CharField(max_length=100, db_index=True)
    video_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='sermons/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['-date', 'speaker']),
            models.Index(fields=['series', '-date']),
        ]

    def __str__(self):
        return self.title

class Ministry(models.Model):
    """
    Represents church ministries and departments.
    
    Ministries are displayed on the Ministries page with icons and colors.
    Can be ordered manually and activated/deactivated.
    
    Fields:
        title: Ministry name
        description: Ministry purpose and details
        color: Hex color code for UI theming
        icon_name: FontAwesome icon identifier (e.g., 'FaUserTie')
        image: Optional ministry image
        order: Manual sort order (lower numbers first)
        is_active: Whether to display on frontend
    """
    title = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    color = models.CharField(max_length=50)
    icon_name = models.CharField(max_length=100, help_text="FontAwesome icon name e.g. FaUserTie")
    image = models.ImageField(upload_to='ministries/', blank=True, null=True)
    order = models.IntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name_plural = "Ministries"

    def __str__(self):
        return self.title


# =============================================================================
# CONFIGURATION MODELS - System configuration and settings
# =============================================================================

class LiveStream(models.Model):
    """
    Manages live stream configuration and status.
    
    Typically only one active instance. Controls the Live page display
    showing current stream status and embed URL.
    
    Fields:
        title: Stream title (e.g., 'Sunday Service')
        description: Stream description
        embed_url: YouTube or other platform embed URL
        is_live: Boolean flag for live status
        status: Current status (live/offline/error)
        date: Display string for broadcast date/time
    """
    STATUS_CHOICES = [
        ('live', 'Live'),
        ('offline', 'Offline'),
        ('error', 'Error'),
    ]
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    embed_url = models.CharField(max_length=1000, blank=True, null=True)
    is_live = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='offline')
    date = models.CharField(max_length=100, blank=True) # For "Broadcast Date" display

    def __str__(self):
        return f"Live Stream ({self.status})"

class ServiceSchedule(models.Model):
    """
    Defines regular service schedules.
    
    Used to display recurring service times on the website
    (e.g., 'Sunday Morning Service 10:00 AM').
    
    Fields:
        day: Day of week or special designation
        time: Service time
        timezone: Timezone identifier (e.g., 'America/New_York')
        type: Service type (e.g., 'Morning Worship')
        description: Additional service details
        is_active: Whether to display on frontend
        order: Manual sort order
    """
    day = models.CharField(max_length=50, db_index=True)
    time = models.CharField(max_length=100)  # Changed to CharField for "10:00 AM" format support
    timezone = models.CharField(max_length=50, default='America/New_York')
    type = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'day']
        indexes = [
            models.Index(fields=['day', 'time']),
        ]

    def __str__(self):
        return f"{self.day} - {self.type}"

class GivingOption(models.Model):
    """
    Defines donation/giving methods for the Giving page.
    
    Each option represents a way to give (bank transfer, mobile money, etc.)
    with corresponding details and icons.
    
    Fields:
        title: Method name (e.g., 'Bank Transfer')
        description: Method details
        color: Hex color code for UI theming
        icon_name: FontAwesome icon identifier
        account_name: Bank account name (if applicable)
        account_number: Bank account number (if applicable)
        bank_name: Bank name (if applicable)
        mobile_number: Mobile money number (if applicable)
        is_active: Whether to display on frontend
        order: Manual sort order
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    color = models.CharField(max_length=50, default="#3b82f6")
    icon_name = models.CharField(max_length=100, help_text="FontAwesome icon name e.g. FaMoneyBillWave")
    account_name = models.CharField(max_length=200, blank=True)
    account_number = models.CharField(max_length=200, blank=True)
    bank_name = models.CharField(max_length=200, blank=True)
    mobile_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title

class Value(models.Model):
    """
    Represents church core values.
    
    Displayed on the About page to communicate the church's
    foundational principles and beliefs.
    
    Fields:
        title: Value name
        description: Value explanation
        icon_name: FontAwesome icon identifier
        order: Manual sort order
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_name = models.CharField(max_length=100, default='FaHeart', help_text="FontAwesome icon name")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Leadership(models.Model):
    """
    Represents church leadership and staff members.
    
    Displayed on the About page with photos and social links.
    
    Fields:
        name: Leader's full name
        role: Position/title (e.g., 'Senior Pastor')
        description: Biography and background
        image: Profile photo
        x_url: X (Twitter) profile URL
        order: Manual sort order for display
    """
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='leadership/', blank=True, null=True)
    x_url = models.URLField(blank=True, null=True, help_text="X (Twitter) profile URL")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Leadership"

    def __str__(self):
        return f"{self.name} - {self.role}"


# =============================================================================
# SITE CONFIGURATION - Global church information and content
# =============================================================================

class ChurchInfo(models.Model):
    """
    Global church information and content (singleton model).
    
    Stores centralized content displayed across multiple pages including
    hero sections, about content, contact information, and social links.
    Typically only one instance exists.
    
    Fields:
        name: Church name
        
        Hero Section:
            hero_subtitle: Hero tagline
            hero_title: Hero main heading
            hero_description: Hero description text
        
        About Section:
            about_story: Church history/story
            about_mission: Mission statement
            about_vision: Vision statement
        
        Contact Info:
            address: Physical address
            phone: Contact phone number
            email: Contact email address
        
        Social Links:
            facebook_url, instagram_url, youtube_url, twitter_url
        
        Giving Content:
            giving_intro: Introduction text for Giving page
            giving_verses: JSON array of inspirational scripture verses
    """
    name = models.CharField(max_length=200, default="New Gate Chapel")
    # Hero Section
    hero_subtitle = models.CharField(max_length=200, default="Welcome Home")
    hero_title = models.CharField(max_length=500, default="Welcome to New Gate Chapel")
    hero_description = models.TextField(default="A place of worship, community, and spiritual growth. Join us as we journey together in faith and discover God's purpose for our lives.")
    
    # About Section
    about_story = models.TextField(default="New Gate Chapel was founded with a vision...")
    about_mission = models.TextField(default="To glorify God by making disciples of Jesus Christ who love God, love others, and serve the world.")
    about_vision = models.TextField(default="A community where every person experiences the transforming love of Christ and discovers their God-given purpose.")
    
    # Contact Info
    address = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    email = models.CharField(max_length=200, blank=True)
    
    # Social Links
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    
    # Giving Content (Global)
    giving_intro = models.TextField(default="Your generosity enables us to reach our community, support missions, and continue the work of God in our city.")
    giving_verses = models.JSONField(default=list, blank=True, help_text="List of inspirational verses for the giving page")

    class Meta:
        verbose_name = "Church Information"
        verbose_name_plural = "Church Information"

    def __str__(self):
        return self.name

class HomeFeature(models.Model):
    """
    Features displayed on the home page.
    
    Highlights key aspects of the church or special messages
    shown on the homepage with icons.
    
    Fields:
        title: Feature title
        description: Feature description
        icon_name: FontAwesome icon identifier
        order: Manual sort order
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_name = models.CharField(max_length=100, default='FaHeart', help_text="FontAwesome icon name")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


# =============================================================================
# USER INTERACTION MODELS - User-submitted data
# =============================================================================

class ContactMessage(models.Model):
    """
    Contact form submissions from website visitors.
    
    Stores messages submitted via the Contact page. Admins can
    mark messages as read and optionally add reply text.
    
    Fields:
        name: Sender's name (indexed)
        email: Sender's email (indexed)
        subject: Message subject
        message: Message content
        created_at: Submission timestamp (indexed)
        is_read: Whether admin has read the message (indexed)
        reply_text: Optional admin reply
        replied_at: Reply timestamp
    """
    name = models.CharField(max_length=200, db_index=True)
    email = models.EmailField(db_index=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_read = models.BooleanField(default=False, db_index=True)
    reply_text = models.TextField(blank=True, null=True)
    replied_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at', 'is_read']),
            models.Index(fields=['email', '-created_at']),
        ]

    def __str__(self):
        return f"{self.subject} - {self.name}"
