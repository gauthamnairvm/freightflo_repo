from django.shortcuts import render

from .models import InterdfRecords
from .models import FIRecords
from .models import FERecords

from .models import MapNodes
from .models import MapNodeWeights
from .models import MapEdges
from .models import Commodities
from .models import TransportationModes

from .models import DFChartInit
from .models import FIChartInit
from .models import FEChartInit
from .models import CliqueEdges
import re


from json import dumps
from django.core import serializers
from django.http import JsonResponse
import json
from django.db.models import Q, F

# Create your views here.
from django.http import HttpResponse
from django.template import loader

def home_page(request):
    template = loader.get_template("main_page.html")
    return HttpResponse(template.render())

def get_categories(request):

    commodities = list(Commodities.objects.all().values())
    modes = list(TransportationModes.objects.all().values())

    data = {
        'commodities': commodities,
        'modes': modes
    }

    return JsonResponse(data, safe=False)

def get_map_nodes(request):
    nodes = list(MapNodes.objects.all().values())
    return JsonResponse(nodes, safe=False)

def get_map_data(request):
    query_data = json.load(request)

    r_map = query_data['map']
    r_category = query_data['category']
    r_subcategory = query_data['subcategory']
    r_fzone = query_data['fzone']
    r_port = query_data['port']
    
    edges = None
    node_weights = None

    if(r_map == 'df' or r_map == 'id' or r_map == 'ed'):
        if(r_category == 'a'):
            edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category)).values())
            node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category)).values())
        else:
            edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory)).values())
            node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory)).values())
    elif(r_fzone == -1):
        if(r_category == 'a'):
            edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, fzone__isnull=True)).values())
            node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, fzone__isnull=True)).values())
        else:
            edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone__isnull=True)).values())
            node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone__isnull=True)).values())
    else:
        if(r_map == 'ip'):
            if(r_category == 'a'):
                edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, fzone=r_fzone, source=r_port)).values())
                node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, fzone=r_fzone, id=r_port)).values())
            else:
                edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone=r_fzone, source=r_port)).values())
                node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone=r_fzone, id=r_port)).values())
        else:
            if(r_category == 'a'):
                edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, fzone=r_fzone, target=r_port)).values())
                node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, fzone=r_fzone, id=r_port)).values())
            else:
                edges = list(MapEdges.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone=r_fzone, target=r_port)).values())
                node_weights = list(MapNodeWeights.objects.filter(Q(map=r_map, category=r_category, subcategory=r_subcategory, fzone=r_fzone, id=r_port)).values())

    data = {
        'edges': edges,
        'node_weights': node_weights
    }

    return JsonResponse(data, safe=False)

def df_chart_init(request):
    data = list(DFChartInit.objects.all().values())
    return JsonResponse(data, safe = False)


def fi_chart_init(request):
    data = list(FIChartInit.objects.all().values())
    return JsonResponse(data, safe = False)

def fe_chart_init(request):
    data = list(FEChartInit.objects.all().values())
    return JsonResponse(data, safe = False)

def get_chart_data(request):

    data = None

    query_data = json.load(request)

    r_map = query_data['map']
    r_chart = query_data['chart']
    r_type = query_data['type']
    r_from = query_data['from']
    r_to = query_data['to']
    r_fzone = query_data['fzone']

    if (r_map == 'df'):
        if (r_chart == 'edge'):
            match r_type:
                case 'rr':
                    data = list(InterdfRecords.objects.filter(Q(o_region_id=r_from, d_region_id=r_to)).values())
                case 'ss':
                    data = list(InterdfRecords.objects.filter(Q(o_state_id=r_from, d_state_id=r_to)).values())
                case 'zz':
                    data = list(InterdfRecords.objects.filter(Q(o_zone_id=r_from, d_zone_id=r_to)).values())
                case 'rs':
                    data = list(InterdfRecords.objects.filter(Q(o_region_id=r_from, d_state_id=r_to)).values())
                case 'sr':
                    data = list(InterdfRecords.objects.filter(Q(o_state_id=r_from, d_region_id=r_to)).values())
                case 'rz':
                    data = list(InterdfRecords.objects.filter(Q(o_region_id=r_from, d_zone_id=r_to)).values())
                case 'zr':
                    data = list(InterdfRecords.objects.filter(Q(o_zone_id=r_from, d_region_id=r_to)).values())
                case 'sz':
                    data = list(InterdfRecords.objects.filter(Q(o_state_id=r_from, d_zone_id=r_to)).values())
                case 'zs':
                    data = list(InterdfRecords.objects.filter(Q(o_zone_id=r_from, d_state_id=r_to)).values())
            return JsonResponse(data, safe = False)
        if (r_chart == 'import'):
            match r_type:
                case 'r':
                    data = list(InterdfRecords.objects.filter(Q(d_region_id=r_to)).values())
                case 's':
                    data = list(InterdfRecords.objects.filter(Q(d_state_id=r_to)).values())
                case 'z':
                    data = list(InterdfRecords.objects.filter(Q(d_zone_id=r_to)).values())
            return JsonResponse(data, safe = False)
        if (r_chart == 'export'):
            match r_type:
                case 'r':
                    data = list(InterdfRecords.objects.filter(Q(o_region_id=r_from)).values())
                case 's':
                    data = list(InterdfRecords.objects.filter(Q(o_state_id=r_from)).values())
                case 'z':
                    data = list(InterdfRecords.objects.filter(Q(o_zone_id=r_from)).values())
            return JsonResponse(data, safe = False)
        if (r_chart == 'within'):
            match r_type:
                case 'r':
                    data = list(InterdfRecords.objects.filter(Q(o_region_id=r_from, d_region_id=r_to)).values())
                case 's':
                    data = list(InterdfRecords.objects.filter(Q(o_state_id=r_from, d_state_id=r_to)).values())
                case 'z':
                    data = list(InterdfRecords.objects.filter(Q(o_zone_id=r_from, d_zone_id=r_to)).values())
            return JsonResponse(data, safe = False)
    elif (r_map == 'id' or (r_map == 'ip' and r_fzone == None and r_chart != 'edge')):
        if (r_chart == 'edge'):
            match r_type:
                case 'fu':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fr':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fs':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fz':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'import'):
            match r_type:
                case 'r':
                    data = list(FIRecords.objects.filter(Q(dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FIRecords.objects.filter(Q(dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FIRecords.objects.filter(Q(dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'export'):
            match r_type:
                case 'f':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
    elif (r_map == 'ed' or (r_map == 'ep' and r_fzone == None and r_chart != 'edge')):
        if (r_chart == 'edge'):
            match r_type:
                case 'fu':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fr':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, do_region_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fs':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, do_state_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fz':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, do_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'import'):
            match r_type:
                case 'f':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'export'):
            match r_type:
                case 'r':
                    data = list(FERecords.objects.filter(Q(do_region_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FERecords.objects.filter(Q(do_state_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FERecords.objects.filter(Q(do_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
    elif (r_map == 'ip'):
        if (r_chart == 'edge'):
            match r_type:
                case 'fu':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fr':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, do_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fs':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, do_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fz':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_from, do_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rr':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_region_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'ss':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_state_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zz':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_zone_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rs':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_region_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'sr':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_state_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rz':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_region_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zr':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_zone_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'sz':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_state_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zs':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_zone_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'export'):
            match r_type:
                case 'r':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_region_id=r_from)).exclude(dd_region_id=r_from).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_state_id=r_from)).exclude(dd_state_id=r_from).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_zone_id=r_from)).exclude(dd_zone_id=r_from).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'within'):
            match r_type:
                case 'r':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_region_id=r_from, dd_region_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_state_id=r_from, dd_state_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FIRecords.objects.filter(Q(fo_zone_id=r_fzone, do_zone_id=r_from, dd_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
    else:
        if (r_chart == 'edge'):
            match r_type:
                case 'fu':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fr':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, dd_region_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fs':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, dd_state_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'fz':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_to, dd_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rr':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_region_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'ss':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_state_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zz':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_zone_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rs':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_region_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'sr':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_state_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'rz':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_region_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zr':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_zone_id=r_from, dd_region_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'sz':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_state_id=r_from, dd_zone_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'zs':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_zone_id=r_from, dd_state_id=r_to)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'import'):
            match r_type:
                case 'r':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, dd_region_id=r_to)).exclude(do_region_id=r_to).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, dd_state_id=r_to)).exclude(do_state_id=r_to).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, dd_zone_id=r_to)).exclude(do_zone_id=r_to).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
        if (r_chart == 'within'):
            match r_type:
                case 'r':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_region_id=r_from, dd_region_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 's':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_state_id=r_from, dd_state_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
                case 'z':
                    data = list(FERecords.objects.filter(Q(fd_zone_id=r_fzone, do_zone_id=r_from, dd_zone_id=r_from)).values('id', 'commodity', 'year', 'tons', 'usd', mode=F('f_mode')))
            return JsonResponse(data, safe = False)
    
def clique_edges(request):
    request_json = json.load(request)
    metric = request_json['metric']
    category = request_json['category']
    result = re.findall(r'[A-Za-z]+|\d+', category)
    entity_type = result[0]
    entity_id = result[1]
    node_type = request_json['node_type']
    data = list(CliqueEdges.objects.filter(metric_type=metric, node_type = node_type, entity_type=entity_type, entity_code = entity_id).values('id','source','target','node_type','entity_type','entity_code','metric_type', metric, 'edge_count' ))
    return JsonResponse(data, safe = False)