from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from .models import Profile
from dm.models import Message
from posts.models import Post


class CurrentUserSerializer(UserDetailsSerializer):
    avatar = serializers.SerializerMethodField()
    background = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="profile.id")
    bio = serializers.ReadOnlyField(source="profile.bio")
    verified = serializers.ReadOnlyField(source="profile.verified")
    is_staff = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    link = serializers.ReadOnlyField(source="profile.link")
    following = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    def get_unread_messages(self, obj):
        return Message.objects.filter(recipient=obj, read=False).count()

    def get_following(self, obj):
        return obj.profile.following.values_list("owner__profile", flat=True)

    def get_display_name(self, obj):
        return obj.profile.display_name if obj.profile.display_name else obj.username

    def get_is_staff(self, obj):
        return obj.is_staff

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.profile.avatar.url)
        else:
            return f"http://localhost:8000{obj.profile.avatar.url}"

    def get_background(self, obj):
        if obj.profile.background:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile.background.url)
            else:
                return f"http://localhost:8000{obj.profile.background.url}"
        else:
            return None

    class Meta(UserDetailsSerializer.Meta):
        fields = tuple(
            field for field in UserDetailsSerializer.Meta.fields
            # excluded fields
            if field not in ("email", "first_name", "last_name")
        ) + ("avatar", "profile_id", "is_staff", "bio", "verified",
             "display_name", "link", "background", "following", "unread_messages")


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="owner.username")
    post_count = serializers.SerializerMethodField()
    display_name = serializers.CharField(required=False, allow_blank=True)
    following_count = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.all(), many=True, required=False
    )

    def get_follower_count(self, obj):
        return Profile.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_post_count(self, obj):
        return Post.objects.filter(owner=obj.owner).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation.get("display_name"):
            representation["display_name"] = instance.owner.username
        return representation

    class Meta:
        model = Profile
        fields = "__all__"
