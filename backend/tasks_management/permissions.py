from rest_framework.permissions import BasePermission
class IsProjectOwner(BasePermission):
    """
    Custom permission to only allow owners of a task to edit it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user