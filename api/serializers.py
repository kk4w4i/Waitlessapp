from rest_framework import serializers

class StoreSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    address = serializers.CharField()
    email = serializers.CharField()
    url = serializers.CharField()
    key = serializers.CharField()

class StoreProfileSerializer(serializers.Serializer):
    id = serializers.CharField()
    username = serializers.CharField()
    store_id = serializers.CharField()
    store_url = serializers.CharField()
    store_name = serializers.CharField()
    role = serializers.CharField()

class ProductSerializer(serializers.Serializer):
    id = serializers.CharField()
    price = serializers.CharField()
    category = serializers.ChoiceField(choices=["Sushi", "Main", "Small Dish", "Dessert", "Soup", "Share"])
    status = serializers.ChoiceField(choices=["Published", "Draft"])
    name = serializers.CharField()
    image = serializers.CharField()
    store_id = serializers.CharField()

    