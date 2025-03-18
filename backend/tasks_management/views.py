from django.shortcuts import render
from .serializers import *

@api_view(['GET'])
def get_all_accounts(req):
    