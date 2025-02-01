from rest_framework.exceptions import ValidationError
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer


class MessageList(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user).exclude(sender_del=True) | Message.objects.filter(recipient=user).exclude(recipient_del=True)

    def perform_create(self, serializer):
        recipient_username = self.request.data.get('recipient')
        sender = self.request.user

        # Check if recipient exists
        try:
            recipient = User.objects.get(username=recipient_username)
        except User.DoesNotExist:
            raise ValidationError(
                {"recipient": ["Recipient user does not exist."]})

        # Prevent sending messages to self
        if recipient == sender:
            raise ValidationError(
                {"recipient": ["You cannot send a message to yourself."]})

        serializer.save(sender=sender, recipient=recipient)


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user).exclude(sender_del=True) | Message.objects.filter(recipient=user).exclude(recipient_del=True)

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user
        data = self.request.data
        update_fields = {}

        # Ensure only recipient can update 'read' field
        if "read" in data and user != instance.recipient:
            return Response(
                {"detail": "Only the recipient can mark the message as read."},
                status=status.HTTP_403_FORBIDDEN
            )

        # If recipient deletes the message, mark it as read too
        if "recipient_del" in data and data["recipient_del"] and user == instance.recipient:
            update_fields["recipient_del"] = True
            update_fields["read"] = True

        # If sender deletes the message
        if "sender_del" in data and data["sender_del"] and user == instance.sender:
            update_fields["sender_del"] = True

        # If both sender and recipient have deleted the message, permanently delete it
        if (update_fields.get("sender_del", instance.sender_del) and
                update_fields.get("recipient_del", instance.recipient_del)):
            instance.delete()
            return Response({"detail": "Message deleted."}, status=status.HTTP_204_NO_CONTENT)

        serializer.save(**update_fields)
        return Response({"detail": "Message updated."}, status=status.HTTP_200_OK)
