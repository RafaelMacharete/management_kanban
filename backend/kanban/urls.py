from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import re_path
from django.views.static import serve as media_serve


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tasks_management.urls'))
]
urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', media_serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]