from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('', views.home_page, name='freightflo_home'),
    path('df_chart_init', views.df_chart_init, name='df_chart_init'),
    path('fi_chart_init', views.fi_chart_init, name='fi_chart_init'),
    path('fe_chart_init', views.fe_chart_init, name='fe_chart_init'),
    path('get_map_data', views.get_map_data, name='get_map_data'),
    path('get_map_nodes', views.get_map_nodes, name='get_map_nodes'),
    path('get_categories', views.get_categories, name='get_categories'),
    path('get_chart_data', views.get_chart_data, name='get_chart_data'),
    path('clique_edges', views.clique_edges, name = 'clique_edges')
]