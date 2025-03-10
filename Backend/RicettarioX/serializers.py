from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser, Recipe, GeneratedRecipe, Ingredient, Step, GeneratedIngredient, GeneratedStep

User = get_user_model()

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError({"error": "Email e password sono richiesti."})

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError({"error": "Credenziali non valide."})

        data = super().validate(attrs)

        data["user"] = {
            "id": user.id,
            "first_name": user.first_name,
            "email": user.email,
        }

        return data

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        user.set_password(validated_data["password"])  
        user.save()
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined')

class RecipeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Recipe
        fields = ['id', 'user', 'title', 'description', 'ingredients', 'steps', 'image', 'created_at', 'updated_at']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name', 'quantity']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['description']

class GeneratedIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedIngredient
        fields = ['name', 'quantity']

class GeneratedStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedStep
        fields = ['description']

class GeneratedRecipeSerializer(serializers.ModelSerializer):
    ingredients = GeneratedIngredientSerializer(many=True, read_only=True, source="generated_ingredients")
    steps = GeneratedStepSerializer(many=True, read_only=True, source="generated_steps")

    class Meta:
        model = GeneratedRecipe
        fields = ['user', 'title', 'ingredients', 'steps', 'created_at', 'image']
