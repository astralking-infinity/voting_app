"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter

# from api_polls import views

# router = DefaultRouter()
# router.register('polls', views.PollViewSet)
# router.register('choices', views.ChoiceViewSet)

urlpatterns = [
    path('', RedirectView.as_view(url='polls/')),
    path('api/', include('polls_api.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('docs/', include_docs_urls(title='Polls Api')),
    path('admin/', admin.site.urls),
]
