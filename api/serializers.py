from rest_framework import serializers

class ProductSerializer(serializers.Serializer):
    id = serializers.CharField()
    price = serializers.CharField()
    category = serializers.ChoiceField(choices=["Sushi", "Main", "Small Dish", "Dessert", "Soup", "Share"])
    status = serializers.ChoiceField(choices=["Published", "Draft"])
    name = serializers.CharField()
    image = serializers.CharField()