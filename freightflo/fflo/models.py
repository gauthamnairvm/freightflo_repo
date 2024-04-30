from django.db import models
import django.db.models as models

class InterdfRecords(models.Model):
    id = models.BigAutoField(unique=True, primary_key=True)
    o_region_id = models.IntegerField()
    o_state_id = models.IntegerField()
    o_zone_id = models.IntegerField()
    d_region_id = models.IntegerField()
    d_state_id = models.IntegerField()
    d_zone_id = models.IntegerField()
    commodity_id = models.IntegerField()
    commodity = models.TextField()
    mode_id = models.IntegerField()
    mode = models.TextField()
    tons = models.FloatField()
    usd = models.FloatField()
    year = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'interdf_records'
        indexes = [
            models.Index(fields=['o_region_id']),
            models.Index(fields=['o_state_id']),
            models.Index(fields=['o_zone_id']),
            models.Index(fields=['d_region_id']),
            models.Index(fields=['d_state_id']),
            models.Index(fields=['d_zone_id'])
        ]

class FERecords(models.Model):
    id = models.BigAutoField(unique=True, primary_key=True)
    do_region_id = models.IntegerField()
    do_state_id = models.IntegerField()
    do_zone_id = models.IntegerField()
    d_mode_id = models.IntegerField()
    d_mode = models.TextField()
    dd_region_id = models.IntegerField()
    dd_state_id = models.IntegerField()
    dd_zone_id = models.IntegerField()
    fd_zone_id = models.IntegerField()
    f_mode_id = models.IntegerField()
    f_mode = models.TextField()
    commodity_id = models.IntegerField()
    commodity = models.TextField()
    tons = models.FloatField()
    usd = models.FloatField()
    year = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'f_export_records'
        indexes = [
            models.Index(fields=['do_region_id']),
            models.Index(fields=['do_state_id']),
            models.Index(fields=['do_zone_id']),
            models.Index(fields=['dd_region_id']),
            models.Index(fields=['dd_state_id']),
            models.Index(fields=['dd_zone_id']),
            models.Index(fields=['fd_zone_id'])
        ]

class DFNodes(models.Model):
    id = models.IntegerField(unique = True, primary_key = True)
    label = models.TextField()
    type = models.CharField(max_length = 1)
    x = models.IntegerField()
    y = models.IntegerField()
    region_id = models.IntegerField()
    region_desc = models.TextField()
    state_id = models.IntegerField()
    state_desc = models.TextField()
    zone_id = models.IntegerField()
    zone_desc = models.TextField()

    class Meta:
        managed = False
        db_table = 'df_nodes'

class DFNodeWeights(models.Model):
    id = models.IntegerField(unique = True, primary_key = True)
    category = models.CharField(max_length = 1)
    subcategory = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()
    usd_per_ton = models.FloatField()

    class Meta:
        managed = False
        db_table = 'df_node_weights'

class DFEdges(models.Model):
    id = models.CharField(max_length = 6, unique = True, primary_key = True)
    category = models.CharField(max_length = 1)
    subcategory = models.IntegerField()
    source = models.IntegerField()
    target = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()
    usd_per_ton = models.FloatField()

    class Meta:
        managed = False
        db_table = 'df_edges'

class DFChartInit(models.Model):
    id = models.IntegerField(unique = True, primary_key = True)
    commodity = models.TextField()
    mode = models.TextField()
    year = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()

    class Meta:
        managed = False
        db_table = 'df_chart_init'

class FINodes(models.Model):
    id = models.CharField(max_length = 4, unique = True, primary_key = True)
    label = models.TextField()
    type = models.CharField(max_length = 1)
    fo_id = models.IntegerField()
    x = models.IntegerField()
    y = models.IntegerField()
    region_id = models.IntegerField()
    region_desc = models.TextField()
    state_id = models.IntegerField()
    state_desc = models.TextField()
    zone_id = models.IntegerField()
    zone_desc = models.TextField()
    tons = models.FloatField()
    usd = models.FloatField()

    class Meta:
        managed = False
        db_table = 'fi_nodes'

class FIEdges(models.Model):
    id = models.CharField(max_length = 6, unique = True, primary_key = True)
    type = models.CharField(max_length = 2)
    fo_id = models.IntegerField()
    source = models.CharField(max_length = 4)
    target = models.CharField(max_length = 4)
    tons = models.FloatField()
    usd = models.FloatField()
    class Meta:
        managed = False
        db_table = 'fi_edges'

class FIChartInit(models.Model):
    id = models.IntegerField(unique = True, primary_key = True)
    commodity = models.TextField()
    mode = models.TextField()
    year = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()

    class Meta:
        managed = False
        db_table = 'fi_chart_init'

class FEChartInit(models.Model):
    id = models.IntegerField(unique = True, primary_key = True)
    commodity = models.TextField()
    mode = models.TextField()
    year = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()

    class Meta:
        managed = False
        db_table = 'fe_chart_init'

class FIRecords(models.Model):
    id = models.BigAutoField(unique=True, primary_key=True)
    fo_zone_id = models.IntegerField()
    f_mode_id = models.IntegerField()
    f_mode = models.TextField()
    do_region_id = models.IntegerField()
    do_state_id = models.IntegerField()
    do_zone_id = models.IntegerField()
    d_mode_id = models.IntegerField()
    d_mode = models.TextField()
    dd_region_id = models.IntegerField()
    dd_state_id = models.IntegerField()
    dd_zone_id = models.IntegerField()
    commodity_id = models.IntegerField()
    commodity = models.TextField()
    tons = models.FloatField()
    usd = models.FloatField()
    year = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'f_import_records'
        indexes = [
            models.Index(fields=['fo_zone_id']),
            models.Index(fields=['do_region_id']),
            models.Index(fields=['do_state_id']),
            models.Index(fields=['do_zone_id']),
            models.Index(fields=['dd_region_id']),
            models.Index(fields=['dd_state_id']),
            models.Index(fields=['dd_zone_id']) 
        ]

class MapNodes(models.Model):
    id = models.IntegerField(primary_key=True)
    label = models.TextField()
    type = models.CharField(max_length=1)
    x = models.IntegerField()
    y = models.IntegerField()
    fzone_id = models.IntegerField()
    fzone_desc = models.TextField()
    region_id = models.IntegerField()
    region_desc = models.TextField()
    state_id = models.IntegerField()
    state_desc = models.TextField()
    zone_id = models.IntegerField()
    zone_desc = models.TextField()

    class Meta:
        managed = False
        db_table = 'map_nodes'

class MapNodeWeights(models.Model):
    id = models.IntegerField(primary_key=True)
    map = models.CharField(max_length=2)
    category = models.CharField(max_length=1)
    subcategory = models.IntegerField()
    fzone = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()
    usd_per_ton = models.FloatField()

    class Meta:
        managed = False
        db_table = 'map_node_weights'
        indexes = [
            models.Index(fields=['map', 'category', 'subcategory', 'fzone'])
        ]

class MapEdges(models.Model):
    id = models.CharField(max_length=14, primary_key=True)
    map = models.CharField(max_length=2)
    category = models.CharField(max_length=1)
    subcategory = models.IntegerField()
    fzone = models.IntegerField()
    source = models.IntegerField()
    target = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()
    usd_per_ton = models.FloatField()

    class Meta:
        managed = False
        db_table = 'map_edges'
        indexes = [
            models.Index(fields=['map', 'category', 'subcategory', 'fzone'])
        ]

class Commodities(models.Model):
    id = models.IntegerField(primary_key=True) 
    desc = models.TextField()

    class Meta:
        managed = False
        db_table = 'commodity'

class TransportationModes(models.Model):
    id = models.IntegerField(primary_key=True)
    desc = models.TextField()

    class Meta:
        managed = False
        db_table = 'transportation_mode'

class CliqueEdges(models.Model):
    id = models.AutoField(primary_key=True)
    source = models.IntegerField()
    target = models.IntegerField()
    node_type = models.CharField(max_length=2)
    metric_type = models.CharField(max_length=4)
    entity_type = models.CharField(max_length=1)
    entity_code = models.IntegerField()
    tons = models.FloatField()
    usd = models.FloatField()
    edge_count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'clique_edges'