import os
import re
from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django_resized import ResizedImageField
from django.db.models.signals import post_delete, pre_delete
from django.dispatch import receiver


class Post(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posts"
    )
    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    body = models.TextField(max_length=140, blank=True)
    image = ResizedImageField(
        blank=True,
        upload_to="post-images/",
        size=[600, None],
        force_format="JPEG"
    )
    parent_post_id = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies"
    )
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        if self.parent_post_id:
            return f"Reply {self.id}"
        else:
            return f"Post {self.id}"

    def save(self, *args, **kwargs):
        if self.pk:
            old_image = Post.objects.filter(pk=self.pk).first().image
            if old_image and old_image != self.image:
                if os.path.isfile(old_image.path):
                    os.remove(old_image.path)

            old_body = Post.objects.get(pk=self.pk).body
            old_hashtags = set(re.findall(r"#(\w+)", old_body))

        else:
            old_hashtags = set()

        super().save(*args, **kwargs)

        # Extract new hashtags from the updated body
        new_hashtags = set(re.findall(r"#(\w+)", self.body))

        # Decrement count for removed hashtags
        for tag in old_hashtags - new_hashtags:
            hashtag = Hashtag.objects.filter(tag=tag).first()
            if hashtag:
                hashtag.count -= 1
                if hashtag.count == 0:
                    hashtag.delete()
                else:
                    hashtag.save()

        # Increment count or create new hashtags
        for tag in new_hashtags - old_hashtags:
            hashtag, created = Hashtag.objects.get_or_create(tag=tag)
            if created:
                hashtag.count = 1
            else:
                hashtag.count += 1
            hashtag.last = now()
            hashtag.save()


def handle_hashtags_on_post_delete(sender, instance, **kwargs):
    hashtags = re.findall(r"#(\w+)", instance.body)
    for tag in hashtags:
        hashtag = Hashtag.objects.filter(tag=tag).first()
        if hashtag:
            hashtag.count -= 1
            if hashtag.count == 0:
                hashtag.delete()
            else:
                hashtag.save()


post_delete.connect(handle_hashtags_on_post_delete, sender=Post)


def delete_post_image_file(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


post_delete.connect(delete_post_image_file, sender=Post)


class Like(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes"
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="likes"
    )
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ('post', 'owner')

    def __str__(self):
        return f"Like by {self.owner} for {self.post}"


class Hashtag(models.Model):
    tag = models.CharField(max_length=50, unique=True)
    count = models.PositiveIntegerField(default=0)
    last = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"#{self.tag}"
