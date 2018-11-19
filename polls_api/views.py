from django.contrib.auth.models import User

from rest_framework import viewsets, status, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    CreateAPIView,
    get_object_or_404
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Poll, Choice
from .permissions import IsOwner
from .serializers import (
    PollSerializer, ChoiceSerializer, VoteSerializer, UserSerializer
)


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer


class ChoiceList(ListCreateAPIView):
    serializer_class = ChoiceSerializer

    def get_queryset(self):
        queryset = Choice.objects.filter(poll_id=self.kwargs['pk'])
        return queryset


class CreateVote(APIView):

    def post(self, request, pk, choice_pk):
        voted_by = request.data.get('voted_by')
        data = {'poll': pk, 'choice': choice_pk, 'voted_by': voted_by}
        serializer = VoteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateUser(CreateAPIView):
    serializer_class = UserSerializer
    authentication_classes = ()
    permission_classes = ()


class UserPollList(ListAPIView):
    serializer_class = PollSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def get_queryset(self):
        """List all polls created by the authenticated user passed in the URL"""
        user_requested = self.kwargs['user']
        self.check_object_permissions(self.request, user_requested)
        return Poll.objects.filter(created_by__username=user_requested)
