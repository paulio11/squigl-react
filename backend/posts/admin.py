from django.contrib import admin
from .models import Post, Like, Hashtag


admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Hashtag)
