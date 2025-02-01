from rest_framework import serializers
from datetime import datetime, timedelta
from .models import Post, Like, Hashtag


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    display_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()
    parent_post_owner = serializers.SerializerMethodField()
    parent_post_body = serializers.SerializerMethodField()
    parent_post_dname = serializers.SerializerMethodField()
    parent_post_image = serializers.SerializerMethodField()
    parent_post_avatar = serializers.SerializerMethodField()
    user_has_replied_to = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["view_count"]

    def validate(self, data):
        retainImage = self.context["request"].data.get(
            "retainImage", "false") == "true"
        if not data.get('body') and not data.get('image') and not retainImage:
            raise serializers.ValidationError(
                "A post must contain either text and/or an image."
            )
        return data

    def update(self, instance, validated_data):
        imageRemoved = self.context["request"].data.get(
            "imageRemoved", "false") == "true"
        if imageRemoved:
            instance.image.delete(save=False)
            instance.image = None
        return super().update(instance, validated_data)

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.owner.profile.avatar.url)
        else:
            return f"http://localhost:8000{obj.owner.profile.avatar.url}"

    def get_display_name(self, obj):
        return obj.owner.profile.display_name or obj.owner.username

    def get_updated(self, obj):
        if obj.date:
            return obj.date.strftime("%b %d %Y, %H:%M")
        return None

    def get_reply_count(self, obj):
        return Post.objects.filter(parent_post_id=obj.id).count()

    def get_parent_post_owner(self, obj):
        if obj.parent_post_id:
            return obj.parent_post_id.owner.username
        return None

    def get_parent_post_body(self, obj):
        if obj.parent_post_id:
            return obj.parent_post_id.body
        return None

    def get_parent_post_image(self, obj):
        if obj.parent_post_id:
            if obj.parent_post_id.image:
                request = self.context.get("request")
                if request:
                    return request.build_absolute_uri(obj.parent_post_id.image.url)
                else:
                    return f"http://localhost:8000{obj.parent_post_id.image.url}"
        return None

    def get_parent_post_avatar(self, obj):
        if obj.parent_post_id:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.parent_post_id.owner.profile.avatar.url)
            else:
                return f"http://localhost:8000{obj.parent_post_id.owner.profile.avatar.url}"

    def get_parent_post_dname(self, obj):
        if obj.parent_post_id:
            return obj.parent_post_id.owner.profile.display_name
        return None

    def get_like_count(self, obj):
        return Like.objects.filter(post=obj.id).count()

    def get_like_id(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            user = request.user
            like = Like.objects.filter(
                post=obj.id, owner=user.id).first()
            if like:
                return like.id
        return None

    def get_user_has_replied_to(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            if Post.objects.filter(parent_post_id=obj.id, owner=request.user).count():
                return True
            else:
                return False
        return False

    def get_date(self, obj):
        now = datetime.now()
        obj_date_naive = obj.date.replace(tzinfo=None)
        time_diff = now - obj_date_naive

        # Within the last 2 minutes
        if time_diff < timedelta(minutes=2):
            return "Just now"
        # Within the last hour
        if time_diff < timedelta(hours=1):
            minutes_ago = int(time_diff.total_seconds() / 60)
            return f"{minutes_ago} minutes ago"
        # Within the last 24 hours
        if time_diff < timedelta(days=1):
            return obj_date_naive.strftime("%I:%M %p").lstrip('0').lower()
        # Within the same year
        if obj_date_naive.year == now.year:
            return obj_date_naive.strftime("%b %-d") + self.get_day_suffix(obj_date_naive.day)
        # Different year
        return obj_date_naive.strftime("%b %-d, %Y") + self.get_day_suffix(obj_date_naive.day)

    def get_day_suffix(self, day):
        """
        Returns the appropriate suffix for a given day.
        """
        if 11 <= day <= 13:
            return "th"
        last_digit = day % 10
        if last_digit == 1:
            return "st"
        elif last_digit == 2:
            return "nd"
        elif last_digit == 3:
            return "rd"
        else:
            return "th"


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
        read_only_fields = ['owner']


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = "__all__"


class TrendingHashtagSerializer(serializers.ModelSerializer):
    score = serializers.FloatField()

    class Meta:
        model = Hashtag
        fields = ["tag", "score", "count"]
