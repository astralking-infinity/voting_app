from django.contrib.auth.models import User
from django.db import models


class Poll(models.Model):
    question = models.CharField(max_length=250)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='polls')
    pub_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pub_date']

    def __str__(self):
        return self.question


class Choice(models.Model):
    choice_text = models.CharField(max_length=250)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='choices')

    def __str__(self):
        return self.choice_text


class Vote(models.Model):
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name='votes')
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    voted_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('poll', 'voted_by')
