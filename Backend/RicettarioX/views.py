from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from RicettarioX.models import Recipe, GeneratedRecipe, GeneratedIngredient, GeneratedStep
from RicettarioX.serializers import (
    RecipeSerializer, GeneratedRecipeSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
)
from django.conf import settings
import requests
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RecipeListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)

class PublicRecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

class CreateRecipeView(generics.CreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UpdateRecipeView(generics.UpdateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

class DeleteRecipeView(generics.DestroyAPIView):
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticated]

class GeneratedRecipeView(generics.ListAPIView):
    serializer_class = GeneratedRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GeneratedRecipe.objects.filter(user=self.request.user)

class MixItUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a recipe using the Spoonacular API"""
        user_ingredients = request.data.get("ingredients", [])

        if not user_ingredients:
            return Response({"message": "Nessun ingrediente fornito"}, status=status.HTTP_400_BAD_REQUEST)

        api_key = settings.SPOONACULAR_API_KEY
        url = f"https://api.spoonacular.com/recipes/findByIngredients?apiKey={api_key}&ingredients={','.join(user_ingredients)}&number=1"

        try:
            response = requests.get(url)
            if response.status_code != 200:
                return Response({"message": "Errore con Spoonacular API"}, status=response.status_code)

            data = response.json()
            if not data:
                return Response({"message": "Nessuna ricetta trovata con questi ingredienti."}, status=status.HTTP_404_NOT_FOUND)

            recipe_id = data[0]["id"]
            recipe_details_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?apiKey={api_key}"
            recipe_details = requests.get(recipe_details_url).json()

            generated_recipe = GeneratedRecipe.objects.create(
                title=recipe_details.get("title", "Ricetta senza titolo"),
                user=request.user,
                image=recipe_details.get("image", "")
            )

            for ingredient in recipe_details.get("extendedIngredients", []):
                GeneratedIngredient.objects.create(
                    generated_recipe=generated_recipe,
                    name=ingredient.get("name", "Ingrediente sconosciuto"),
                    quantity=f"{ingredient.get('amount', 1)} {ingredient.get('unit', '')}"
                )

            steps = recipe_details.get("analyzedInstructions", [])
            if steps:
                for step in steps[0].get("steps", []):
                    GeneratedStep.objects.create(
                        generated_recipe=generated_recipe,
                        description=step.get("step", "")
                    )
            generated_recipe.refresh_from_db()
            return Response(GeneratedRecipeSerializer(generated_recipe).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return Response({"message": "Errore interno del server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)