from django.urls import path

from rest_framework.routers import DefaultRouter
# from rest_auth import views as auth

from . import views

router = DefaultRouter()
router.register('polls', views.PollViewSet, base_name='polls')

urlpatterns = router.urls
urlpatterns += [
    # path(
    #     'polls/',
    #     views.PollViewSet.as_view({'get': 'list',
    #                                'post': 'create'}),
    #     name='polls'
    # ),
    # path(
    #     'polls/<int:pk>/',
    #     views.PollViewSet.as_view({'get': 'retrieve',
    #                                'delete': 'destroy'}),
    #     name='poll-detail'
    # ),
    path('polls/<int:pk>/choices/', views.ChoiceList.as_view(), name='choice-list'),
    path('polls/<int:pk>/choices/<int:choice_pk>/vote/', views.CreateVote.as_view(), name='create-vote'),

    # User creation
    path('create-user/', views.CreateUser.as_view(), name='create-user'),

    path('<slug:user>/polls/', views.UserPollList.as_view(), name='user-polls'),
]
