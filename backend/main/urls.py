from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import root_route


urlpatterns = [
    path('', root_route),
    path('', include('accounts.urls')),
    path('', include('posts.urls')),
    path('', include('dm.urls')),
    path('admin/', admin.site.urls),
    # dj-rest-auth
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]

# for serving media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
