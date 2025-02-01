from django.shortcuts import get_object_or_404
from dj_rest_auth.views import UserDetailsView
from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from main.permissions import IsOwnerOrReadOnly
from .serializers import CurrentUserSerializer, ProfileSerializer
from .models import Profile


class CustomUserDetailsView(UserDetailsView):
    serializer_class = CurrentUserSerializer


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ["owner__username", "display_name"]


class ProfilesToFollowList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # If the user is authenticated, exclude their own profile and profiles they are following
        if self.request.user.is_authenticated:
            user_profile = self.request.user.profile
            # Exclude the user's own profile and profiles the user is following
            queryset = Profile.objects.exclude(
                id=user_profile.id
            ).exclude(
                id__in=user_profile.following.values('id')
            )
        else:
            # If the user is not authenticated, return all profiles
            queryset = Profile.objects.all()

        # Order the profiles randomly and limit to 10 results
        return queryset.order_by('?')[:10]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = "owner__username"
    lookup_url_kwarg = "username"

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {
            self.lookup_field: self.kwargs.get(self.lookup_url_kwarg)}
        return get_object_or_404(queryset, **filter_kwargs)

    def perform_update(self, serializer):
        instance = serializer.save()
        action = self.request.data.get('action')
        profile_id = self.request.data.get('id')

        if action and profile_id:
            if action == 'add':
                instance.following.add(profile_id)
            elif action == 'remove':
                instance.following.remove(profile_id)
            instance.save()

        return Response(serializer.data)


class DeleteAccount(APIView):
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({"detail:" "Account deleted successfully."})
