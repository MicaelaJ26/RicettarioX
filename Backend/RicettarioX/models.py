from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email è obbligatoria")  

        email = self.normalize_email(email).lower()  
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("L'admin deve avere is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("L'admin deve avere is_superuser=True")

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 
    date_joined = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)  
    last_name = models.CharField(max_length=30, blank=True, null=True)  
    objects = CustomUserManager()

    USERNAME_FIELD = "email"  
    REQUIRED_FIELDS = ['first_name', 'last_name']  

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Utente"
        verbose_name_plural = "Utenti"

class Recipe(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recipes')  
    title = models.CharField(max_length=255)  
    description = models.TextField()  
    ingredients = models.JSONField(default=list)  
    steps = models.JSONField(default=list) 
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  
    
    def __str__(self):
        return self.title

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class Step(models.Model):
    description = models.TextField()

    def __str__(self):
        return f"Passaggio {self.id}"
    
class GeneratedRecipe(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)  
    ingredients = models.JSONField(default=list)  
    steps = models.JSONField(default=list)  
    created_at = models.DateTimeField(auto_now_add=True) 
    image = models.URLField(max_length=500, blank=True, null=True)
 
    def __str__(self):
        return f"Mix It Up: {self.title}"

class GeneratedIngredient(models.Model):  
    generated_recipe = models.ForeignKey(GeneratedRecipe, related_name='generated_ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class GeneratedStep(models.Model):
    generated_recipe = models.ForeignKey(GeneratedRecipe, related_name='generated_steps', on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"Passaggio per {self.generated_recipe.title}"
