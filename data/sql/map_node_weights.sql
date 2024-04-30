USE faf5;
DROP TABLE IF EXISTS map_node_weights;

CREATE TABLE map_node_weights (
	id INT,
    map VARCHAR(2),
    category VARCHAR(1),
    subcategory INT,
    fzone INT,
    tons DOUBLE,
    usd DOUBLE,
    usd_per_ton DOUBLE
);

INSERT INTO map_node_weights
	SELECT 
		o_region_id,
        'df',
		'a',
        NULL,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_region_id = d_region_id
	GROUP BY
		o_region_id, d_region_id;
            
INSERT INTO map_node_weights
	SELECT 
		o_state_id,
        'df',
		'a',
        NULL,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_state_id = d_state_id
	GROUP BY
		o_state_id, d_state_id;

INSERT INTO map_node_weights
	SELECT 
		o_zone_id,
        'df',
		'a',
        NULL,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_zone_id = d_zone_id
	GROUP BY
		o_zone_id, d_zone_id;



----- COMMODITY -----

INSERT INTO map_node_weights
	SELECT 
		o_region_id,
        'df',
		'c',
        commodity_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_region_id = d_region_id
	GROUP BY
		o_region_id, d_region_id, commodity_id;
            
INSERT INTO map_node_weights
	SELECT 
		o_state_id,
        'df',
		'c',
        commodity_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_state_id = d_state_id
	GROUP BY
		o_state_id, d_state_id, commodity_id;

INSERT INTO map_node_weights
	SELECT 
		o_zone_id,
        'df',
		'c',
        commodity_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_zone_id = d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, commodity_id;



----- MODE -----

INSERT INTO map_node_weights
	SELECT 
		o_region_id,
        'df',
		'm',
        mode_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_region_id = d_region_id
	GROUP BY
		o_region_id, d_region_id, mode_id;
            
INSERT INTO map_node_weights
	SELECT 
		o_state_id,
        'df',
		'm',
        mode_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_state_id = d_state_id
	GROUP BY
		o_state_id, d_state_id, mode_id;

INSERT INTO map_node_weights
	SELECT 
		o_zone_id,
        'df',
		'm',
        mode_id,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_zone_id = d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, mode_id;
            


----- YEAR -----

INSERT INTO map_node_weights
	SELECT 
		o_region_id,
        'df',
		'y',
        year,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_region_id = d_region_id
	GROUP BY
		o_region_id, d_region_id, year;
            
INSERT INTO map_node_weights
	SELECT 
		o_state_id,
        'df',
		'y',
        year,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_state_id = d_state_id
	GROUP BY
		o_state_id, d_state_id, year;

INSERT INTO map_node_weights
	SELECT 
		o_zone_id,
        'df',
		'y',
        year,
        NULL,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		interdf_records
	WHERE o_zone_id = d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, year;
        

# BY FOREIGN ZONE

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ip',
		'a',
        NULL,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, fo_zone_id;
        
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ip',
		'a',
        NULL,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, fo_zone_id;
        
INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ip',
		'a',
        NULL,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, fo_zone_id;



----- COMMODITY -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ip',
		'c',
        commodity_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, commodity_id, fo_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ip',
		'c',
        commodity_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, commodity_id, fo_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ip',
		'c',
        commodity_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, commodity_id, fo_zone_id;



----- MODE -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ip',
		'm',
        f_mode_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, f_mode_id, fo_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ip',
		'm',
        f_mode_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, f_mode_id, fo_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ip',
		'm',
        f_mode_id,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, f_mode_id, fo_zone_id;
            


----- YEAR -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ip',
		'y',
        year,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, year, fo_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ip',
		'y',
        year,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, year, fo_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ip',
		'y',
        year,
        fo_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_import_records
	WHERE 
		do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, year, fo_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ep',
		'a',
        NULL,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, fd_zone_id;
        
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ep',
		'a',
        NULL,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, fd_zone_id;
        
INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ep',
		'a',
        NULL,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, fd_zone_id;



----- COMMODITY -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ep',
		'c',
        commodity_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, commodity_id, fd_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ep',
		'c',
        commodity_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, commodity_id, fd_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ep',
		'c',
        commodity_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, commodity_id, fd_zone_id;



----- MODE -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ep',
		'm',
        f_mode_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, f_mode_id, fd_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ep',
		'm',
        f_mode_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, f_mode_id, fd_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ep',
		'm',
        f_mode_id,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, f_mode_id, fd_zone_id;
            


----- YEAR -----

INSERT INTO map_node_weights
	SELECT 
		do_region_id,
        'ep',
		'y',
        year,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_region_id = dd_region_id
	GROUP BY
		do_region_id, dd_region_id, year, fd_zone_id;
            
INSERT INTO map_node_weights
	SELECT 
		do_state_id,
        'ep',
		'y',
        year,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_state_id = dd_state_id
	GROUP BY
		do_state_id, dd_state_id, year, fd_zone_id;

INSERT INTO map_node_weights
	SELECT 
		do_zone_id,
        'ep',
		'y',
        year,
        fd_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd,
		SUM(usd)/SUM(tons) AS usd_per_ton
	FROM 
		f_export_records
	WHERE 
		do_zone_id = dd_zone_id
	GROUP BY
		do_zone_id, dd_zone_id, year, fd_zone_id;        

CREATE INDEX map_node_weight_index
	ON  map_node_weights (map, category, subcategory, fzone);
