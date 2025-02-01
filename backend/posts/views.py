from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.db.models import F, Q, FloatField
from django.db.models.functions import Cast
from django.utils.timezone import now
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from main.permissions import IsOwnerOrReadOnly


class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all()
    filter_backends = [DjangoFilterBackend,
                       SearchFilter]
    filterset_fields = {
        'parent_post_id': ['exact'],
        'owner__username': ['exact'],
    }
    search_fields = ['body']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = F("view_count") + 1
        instance.save(update_fields=["view_count"])
        instance.refresh_from_db()
        return super().retrieve(request, *args, **kwargs)


class LikeList(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LikeDetail(generics.RetrieveDestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Like.objects.all()


class FeedPostList(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = self.request.user.profile
        following_users = profile.following.values_list("owner", flat=True)
        return Post.objects.filter(
            Q(owner__in=following_users) | Q(owner=self.request.user)
        ).order_by("-date")


class HashtagList(generics.ListAPIView):
    serializer_class = HashtagSerializer
    queryset = Hashtag.objects.all()


class TrendingHashtagList(generics.ListAPIView):
    serializer_class = TrendingHashtagSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        current_time = now()
        # Calculate time difference in hours as a float
        time_diff_in_hours = Cast(
            (current_time - F("last")) / timedelta(hours=1),
            output_field=FloatField()
        )
        # Annotate hashtags with a trending score
        return (
            Hashtag.objects.annotate(
                time_diff=time_diff_in_hours,
                score=F("count") / (F("time_diff") + 1) *
                0.5  # Adjust decay factor
            )
            .order_by("-score")[:10]  # Limit to top 10
        )
