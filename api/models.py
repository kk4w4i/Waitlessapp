from django.db import models
import uuid

from django.utils import timezone

class Store(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)
    key = models.UUIDField(default=uuid.uuid4)

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

class Order(models.Model):

    STATUS_CHOICES = [
        ('Cooking', 'Cooking'),
        ('Ready to serve', 'Ready to serve'),
    ]

    ORDER_TYPE = [
        ('Dine in', 'Dine in'),
        ('Takeaway', 'Takeaway'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_id = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    ordered_at = models.DateTimeField(auto_now_add=True)
    table_number = models.IntegerField()
    product_count = models.IntegerField()
    order_number = models.IntegerField(default=1)
    completed_order_count = models.IntegerField()
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE)

    def save(self, *args, **kwargs):
        if self._state.adding:
            last_order = Order.objects.filter(store_id=self.store_id).order_by('-ordered_at').first()
            if last_order:
                # Check if the last order was created on a different day
                if last_order.ordered_at.date() < timezone.now().date():
                    self.order_number = 1
                else:
                    self.order_number = last_order.order_number + 1
            else:
                self.order_number = 1
        super(Order, self).save(*args, **kwargs)

class OrderItem(models.Model):
    count = models.IntegerField()
    menu_name = models.CharField(max_length=100)
    menu_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    menu_image = models.ImageField()
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')