from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from django.contrib.auth.models import User, Group

from .models import (
    Usuarios, Intereses, InteresesUsuarios, Users_Usuarios, Ofertas, Empresas, Users_Empresas,
    OfertasEmpresas, Postulaciones, AuditoriaOfertas
)
from .serializers import (
    UsuariosSerializer, UsersSerializer, InteresesSerializer, InteresesUsuariosSerializer, Users_UsuariosSerializer,
    user_groupsSerializer, EmpresasSerializer, Users_EmpresasSerializer, OfertasSerializer, OfertasEmpresasSerializer,
    PostulacionesSerializer, AuditoriaOfertasSerializer
)


# ------------------- Registro de Usuario -------------------
class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]

# ------------------- Obtener Datos del Usuario Autenticado -------------------
class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "username": request.user.username,
            "date_joined": request.user.date_joined,
        })


# ------------------- ViewSets para gestión de modelos -------------------
class UsuariosViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated]

class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]

class InteresesViewSet(viewsets.ModelViewSet):
    queryset = Intereses.objects.all()
    serializer_class = InteresesSerializer
    permission_classes = [AllowAny]

class InteresesUsuariosViewSet(viewsets.ModelViewSet):
    queryset = InteresesUsuarios.objects.all()
    serializer_class = InteresesUsuariosSerializer
    permission_classes = [AllowAny]


class Users_UsuariosViewSet(viewsets.ModelViewSet):
    queryset = Users_Usuarios.objects.all()
    serializer_class = Users_UsuariosSerializer
    permission_classes = [AllowAny]


class auth_user_groups(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = user_groupsSerializer
    permission_classes = [AllowAny]




class EmpresasViewSet(viewsets.ModelViewSet):
    queryset = Empresas.objects.all()
    serializer_class = EmpresasSerializer
    permission_classes = [AllowAny]


class Users_EmpresasViewSet(viewsets.ModelViewSet):
    queryset = Users_Empresas.objects.all()
    serializer_class = Users_EmpresasSerializer
    permission_classes = [AllowAny]




class OfertasViewSet(viewsets.ModelViewSet):
    queryset = Ofertas.objects.all()
    serializer_class = OfertasSerializer
    permission_classes = [AllowAny]


class OfertasEmpresasViewSet(viewsets.ModelViewSet):
    queryset = OfertasEmpresas.objects.all()
    serializer_class = OfertasEmpresasSerializer

class PostulacionesViewSet(viewsets.ModelViewSet):
    queryset = Postulaciones.objects.all()
    serializer_class = PostulacionesSerializer

class AuditoriaOfertasViewSet(viewsets.ModelViewSet):
    queryset = AuditoriaOfertas.objects.all()
    serializer_class = AuditoriaOfertasSerializer
