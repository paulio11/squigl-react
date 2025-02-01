from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    sender = serializers.CharField(source='sender.username', read_only=True)
    recipient = serializers.CharField(source='recipient.username')

    def get_date(self, obj):
        # Format the date with suffix (e.g. 1st, 2nd, 3rd, 4th, etc.)
        day = obj.date.day
        suffix = 'th' if 4 <= day <= 20 or day % 10 > 3 else {
            1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')

        # Format the date as "Jan 28th 2025, 5:23 pm"
        formatted_date = obj.date.strftime(
            f"%b {day}{suffix} %Y, %I:%M %p")

        return formatted_date

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["sender", "date", "recipient_del", "sender_del"]
