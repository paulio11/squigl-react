from django.urls import path
from .views import *


urlpatterns = [
    path("dj-rest-auth/user/", CustomUserDetailsView.as_view()),
    path("profiles/", ProfileList.as_view()),
    path("profiles/<str:username>", ProfileDetail.as_view()),
    path("delete/", DeleteAccount.as_view()),
    path("profiles/tofollow/", ProfilesToFollowList.as_view())
]
