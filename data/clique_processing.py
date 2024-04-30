import pandas as pd
import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
import itertools
import pymysql
from dotenv import load_dotenv
import os


load_dotenv()

hostname = os.getenv('DATABASE_HOST', 'localhost')
username = os.getenv('DATABASE_USER', 'root')
password =os.getenv('DATABASE_PASSWORD', '')
database = os.getenv('DATABASE_NAME', 'faf5')

connection = pymysql.connect(host=hostname, user=username, passwd=password, db=database)
select_query = "SELECT * FROM interdf_records"
data = pd.read_sql(select_query, connection)

state_data = data[data['o_state_id']!=data['d_state_id']].groupby(['o_state_id', 'd_state_id', 'commodity', 'commodity_id', 'mode_id', 'mode', 'year']).agg(
    {
        'tons':'sum',
        'usd': 'sum'
    }).reset_index()

zone_data = data[data['o_zone_id']!=data['d_zone_id']].groupby(['o_zone_id', 'd_zone_id', 'commodity', 'commodity_id', 'mode_id', 'mode','year']).agg(
    {
        'tons':'sum',
        'usd': 'sum'
    }).reset_index()

focused_data = {'ss': state_data,'zz': zone_data}

def is_perfect_clique(G):
    for u in G.nodes():
        for v in G.nodes():
            if u != v and not G.has_edge(u, v):
                return False
    return True

def find_scc(G, k):
    
    #TONS
    in_degree_tons = G.in_degree(weight='tons')
    out_degree_tons = G.out_degree(weight='tons')
    in_degree_dict_tons = dict(in_degree_tons)
    out_degree_dict_tons = dict(out_degree_tons)

    total_degree_tons = {node: in_degree_dict_tons.get(node, 0) + out_degree_dict_tons.get(node, 0) for node in set(in_degree_dict_tons) | set(out_degree_dict_tons)}
    sorted_nodes_tons = sorted(total_degree_tons.items(), key=lambda x: x[1], reverse=True)
    top_k_nodes_tons = sorted_nodes_tons[:k]        
    top_k_nodes_list_tons = [node for node, weight in top_k_nodes_tons]

    subG_tons = nx.Graph()

    for u, v in itertools.combinations(top_k_nodes_list_tons, 2):

        weight_uv = G[u][v]['tons'] if G.has_edge(u, v) else 0
        weight_vu = G[v][u]['tons'] if G.has_edge(v, u) else 0

        if weight_uv > 0 and weight_vu > 0:
            combined_weight = weight_uv + weight_vu
            subG_tons.add_edge(u, v, weight=combined_weight)

    #USD
    in_degree_usd = G.in_degree(weight='usd')
    out_degree_usd = G.out_degree(weight='usd')
    in_degree_dict_usd = dict(in_degree_usd)
    out_degree_dict_usd = dict(out_degree_usd)

    total_degree_usd = {node: in_degree_dict_usd.get(node, 0) + out_degree_dict_usd.get(node, 0) for node in set(in_degree_dict_usd) | set(out_degree_dict_usd)}
    sorted_nodes_usd = sorted(total_degree_usd.items(), key=lambda x: x[1], reverse=True)
    top_k_nodes_usd = sorted_nodes_usd[:k]        
    top_k_nodes_list_usd = [node for node, weight in top_k_nodes_usd]

    subG_usd = nx.Graph()

    for u, v in itertools.combinations(top_k_nodes_list_usd, 2):

        weight_uv = G[u][v]['usd'] if G.has_edge(u, v) else 0
        weight_vu = G[v][u]['usd'] if G.has_edge(v, u) else 0

        if weight_uv > 0 and weight_vu > 0:
            combined_weight = weight_uv + weight_vu
            subG_usd.add_edge(u, v, weight=combined_weight)

    return subG_tons, subG_usd

commodity_tons_records = {}
commodity_usd_records = {}
mode_tons_records = {}
mode_usd_records = {}
year_tons_records = {}
year_usd_records = {}

for node_type, edge_df in focused_data.items():
    if node_type == 'ss':
        source = 'o_state_id'
        target = 'd_state_id'
        k = 10
    else:
        source = 'o_zone_id'
        target = 'd_zone_id'
        k = 20
        
    entry_dict_tons, entry_dict_usd = {}, {}
        
    for c_id, c_df in edge_df.groupby('commodity_id'):
        c_edges = c_df.groupby([source, target]).agg({'tons':'sum','usd':'sum'}).reset_index()
        CG = nx.from_pandas_edgelist(c_edges, source=source, target=target, edge_attr=['tons','usd'], create_using=nx.DiGraph())
        C_tons_scc, C_usd_scc = find_scc(CG,k)
        entry_dict_tons[c_id] = C_tons_scc
        entry_dict_usd[c_id] = C_usd_scc
    commodity_tons_records[node_type] = entry_dict_tons
    commodity_usd_records[node_type] = entry_dict_usd
    
    entry_dict_tons, entry_dict_usd = {}, {}
    for m_id, m_df in edge_df.groupby('mode_id'):
        m_edges = m_df.groupby([source, target]).agg({'tons':'sum','usd':'sum'}).reset_index()
        MG = nx.from_pandas_edgelist(m_edges, source=source, target=target, edge_attr=['tons','usd'], create_using=nx.DiGraph())
        M_tons_scc, M_usd_scc = find_scc(MG,k)
        entry_dict_tons[m_id] = M_tons_scc
        entry_dict_usd[m_id] = M_usd_scc
    mode_tons_records[node_type] = entry_dict_tons
    mode_usd_records[node_type] = entry_dict_usd
    
    entry_dict_tons, entry_dict_usd = {}, {}
    for y, y_df in edge_df.groupby('year'):
        y_edges = y_df.groupby([source, target]).agg({'tons':'sum','usd':'sum'}).reset_index()
        YG = nx.from_pandas_edgelist(y_edges, source=source, target=target, edge_attr=['tons','usd'], create_using=nx.DiGraph())
        Y_tons_scc, Y_usd_scc = find_scc(YG,k)
        entry_dict_tons[y] = Y_tons_scc
        entry_dict_usd[y] = Y_usd_scc
    year_tons_records[node_type] = entry_dict_tons
    year_usd_records[node_type] = entry_dict_usd

    record_dict = {
    't': [commodity_tons_records,mode_tons_records,year_tons_records],
    'u': [commodity_usd_records, mode_usd_records,year_usd_records]
}

cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS clique_edges;")

cursor.execute("""
    CREATE TABLE clique_edges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source INT,
        target INT,
        node_type VARCHAR(2),
        metric_type VARCHAR(4),
        entity_type CHAR(1),
        entity_code INT,
        tons FLOAT,
        usd FLOAT,
        edge_count INT
    );
    """)
for k,v in record_dict.items():
    if k =='t':
        insert_query = """
        INSERT INTO clique_edges (source, target, node_type, metric_type, entity_type, entity_code, tons, usd, edge_count)
        VALUES (%s, %s, %s, 'tons', %s, %s, %s, %s,%s);
        """
        
    else:
        insert_query = """
        INSERT INTO clique_edges (source, target, node_type, metric_type, entity_type, entity_code, usd, tons, edge_count)
        VALUES (%s, %s, %s, 'usd', %s, %s, %s, %s,%s);
        """
        
    for node_type, node_dict in v[0].items():
        for c, graph in node_dict.items():
            edge_count = graph.number_of_edges()
            is_perfect_clique(graph)
            for s, t, data in graph.edges(data=True):
                cursor.execute(insert_query, (s, t, node_type, 'c', c, data['weight'], None, edge_count))
                
    for node_type, node_dict in v[1].items():
        for m, graph in node_dict.items():
            edge_count = graph.number_of_edges()
            for s, t, data in graph.edges(data=True):
                cursor.execute(insert_query, (s, t, node_type, 'm', m, data['weight'], None,edge_count))
    
    for node_type, node_dict in v[2].items():
        for y, graph in node_dict.items():
            edge_count = graph.number_of_edges()
            for s, t, data in graph.edges(data=True):
                cursor.execute(insert_query, (s, t, node_type, 'y', y, data['weight'], None,edge_count))
    
# # Commit changes and close connection
connection.commit()
cursor.close()
connection.close()