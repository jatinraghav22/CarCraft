from django.db import models


class Customer(models.Model):

    full_name = models.CharField(max_length=150)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20)

    address = models.TextField()

    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name