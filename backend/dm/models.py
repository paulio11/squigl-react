from django.db import models
from django.contrib.auth.models import User


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_message")
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_message")
    message = models.TextField(max_length=400)
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    recipient_del = models.BooleanField(default=False)
    sender_del = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient}"
