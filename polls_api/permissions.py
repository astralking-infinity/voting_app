from rest_framework import permissions


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        """User can only view and edit their own poll"""
        return obj == request.user.username
