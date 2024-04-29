from django.db import models
import uuid

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Sushi', 'Sushi'),
        ('Main', 'Main'),
        ('Small Dish', 'Small Dish'), 
        ('Dessert', 'Dessert'),
        ('Soup', 'Soup'),
        ('Share', 'Share'),
    ]

    STATUS_CHOICES = [
        ('Published', 'Published'),
        ('Draft', 'Draft'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return self.name
