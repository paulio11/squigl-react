from django.urls import path
from posts import views


urlpatterns = [
    path("posts/", views.PostList.as_view()),
    path("posts/<int:pk>", views.PostDetail.as_view()),
    path("likes/", views.LikeList.as_view()),
    path("likes/<int:pk>", views.LikeDetail.as_view()),
    path("feed/", views.FeedPostList.as_view()),
    path("hashtags/", views.HashtagList.as_view()),
    path("hashtags/trending", views.TrendingHashtagList.as_view())
]
