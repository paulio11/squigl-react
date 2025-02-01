from django.urls import path
from dm import views


urlpatterns = [
    path("messages/", views.MessageList.as_view()),
    path("messages/<int:pk>", views.MessageDetail.as_view()),
]
