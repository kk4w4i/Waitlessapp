from django.db import models
import uuid

class Store(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)
    key = models.UUIDField(default=uuid.uuid4)

    def __str__(self):
        return self.name

class StoreProfile(models.Model):
    ROLE_CHOICES = [
        ('Manager', 'Manager'),
        ('Staff', 'Staff'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.CharField(max_length=100)
    store_url = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    username = models.CharField(max_length=100)
    store_name = models.CharField(max_length=100)

    def __str__(self):
        return self.store_name
    
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
    store_id = models.CharField(max_length=100)
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return self.name
    
class Layout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    store_id = models.CharField(max_length=100)

class Table(models.Model):
    layout = models.ForeignKey(Layout, on_delete=models.CASCADE, related_name='tables')
    store_id = models.CharField(max_length=100) 
    table_number = models.IntegerField()
    position_x = models.DecimalField(max_digits=10, decimal_places=5)
    position_y = models.DecimalField(max_digits=10, decimal_places=5)
    width = models.DecimalField(max_digits=10, decimal_places=5)
    height = models.DecimalField(max_digits=10, decimal_places=5)