from django.db import models

class SentimentAnalysis(models.Model):
    text_input = models.TextField()
    sentiment_result = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.text_input[:50]} - {self.sentiment_result}"