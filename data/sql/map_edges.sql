USE faf5;
DROP TABLE IF EXISTS map_edges;

CREATE TABLE map_edges (
	id VARCHAR(14),
    map VARCHAR(2),
    category VARCHAR(1),
    subcategory INT,
    fzone INT,
    source INT,
    target INT,
    tons DOUBLE,
    usd DOUBLE,
    usd_per_ton DOUBLE
);

INSERT INTO map_edges 
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'a'),
        'df',
		'a',
        NULL,
        NULL,
        o_region_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_region_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_region_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_state_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_state_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_state_id, d_region_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_region_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_zone_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_zone_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_zone_id, d_region_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_state_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_state_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_state_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_zone_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_zone_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_zone_id, d_state_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'a'),
		'df',
		'a',
        NULL,
        NULL,
        o_zone_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_zone_id != d_zone_id
	GROUP BY
		o_zone_id, d_zone_id;



----- COMMODITY -----

INSERT INTO map_edges 
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'c'),
        'df',
		'c',
        commodity_id,
        NULL,
        o_region_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_region_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_region_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_state_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_state_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_state_id, d_region_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_region_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_zone_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_zone_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_zone_id, d_region_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_state_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_state_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_state_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_zone_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_zone_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_zone_id, d_state_id, commodity_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'c'),
		'df',
		'c',
        commodity_id,
        NULL,
        o_zone_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_zone_id != d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, commodity_id;



----- MODE -----

INSERT INTO map_edges 
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'm'),
        'df',
		'm',
        mode_id,
        NULL,
        o_region_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_region_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_region_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_state_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_state_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_state_id, d_region_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_region_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_zone_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_zone_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_zone_id, d_region_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_state_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_state_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_state_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_zone_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_zone_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_zone_id, d_state_id, mode_id;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'm'),
		'df',
		'm',
        mode_id,
        NULL,
        o_zone_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_zone_id != d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, mode_id;



----- YEAR -----

INSERT INTO map_edges 
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_region_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_region_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_region_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_state_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_state_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_state_id, d_region_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_region_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_region_id, d_zone_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_zone_id,
        d_region_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_region_id != d_region_id
	GROUP BY
		o_zone_id, d_region_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_state_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_state_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_state_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_state_id, d_zone_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_zone_id,
        d_state_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_state_id != d_state_id
	GROUP BY
		o_zone_id, d_state_id, year;
        
INSERT INTO map_edges 
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'y'),
		'df',
        'y',
        year,
        NULL,
        o_zone_id,
        d_zone_id,
        SUM(tons),
        SUM(usd),
        SUM(usd)/SUM(tons)
	FROM
		interdf_records
	WHERE 
		o_zone_id != d_zone_id
	GROUP BY
		o_zone_id, d_zone_id, year;
        
        
        
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'a'),
		'ip',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'a'),
		'ip',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		do_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_region_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'a'),
		'ip',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		do_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_state_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'a'),
		'ip',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		do_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_zone_id;
        
        


INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'c'),
		'ip',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'c'),
		'ip',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		do_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_region_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'c'),
		'ip',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		do_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_state_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'c'),
		'ip',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		do_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_zone_id, commodity_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'm'),
		'ip',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'm'),
		'ip',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		do_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_region_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'm'),
		'ip',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		do_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_state_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'm'),
		'ip',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		do_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_zone_id, f_mode_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'y'),
		'ip',
        'y',
        year,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'y'),
		'ip',
        'y',
        year,
        NULL,
		fo_zone_id,
		do_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_region_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'y'),
		'ip',
        'y',
        year,
        NULL,
		fo_zone_id,
		do_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_state_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'y'),
		'ip',
        'y',
        year,
        NULL,
		fo_zone_id,
		do_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, do_zone_id, year;
        
        

INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_region_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_state_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_zone_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_state_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_region_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_zone_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_region_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_zone_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'a'),
        'ip',
        'a',
        NULL,
		fo_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_state_id;
        
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_region_id, commodity_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_state_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_zone_id, commodity_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_state_id, commodity_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_region_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_zone_id, commodity_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_region_id, commodity_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_zone_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'c'),
        'ip',
        'c',
        commodity_id,
		fo_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_state_id, commodity_id;
        
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_region_id, f_mode_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_state_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_zone_id, f_mode_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_state_id, f_mode_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_region_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_zone_id, f_mode_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_region_id, f_mode_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_zone_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'm'),
        'ip',
        'm',
        f_mode_id,
		fo_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_state_id, f_mode_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_region_id, year;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_state_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_zone_id, year;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_state_id, year;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_region_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_region_id, dd_zone_id, year; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_region_id, year; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_state_id, dd_zone_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'y'),
        'ip',
        'y',
        year,
		fo_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fo_zone_id, do_zone_id, dd_state_id, year;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'a'),
		'id',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'a'),
		'id',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_region_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'a'),
		'id',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_state_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'a'),
		'id',
        'a',
        NULL,
        NULL,
		fo_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_zone_id;
        
        


INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'c'),
		'id',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'c'),
		'id',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_region_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'c'),
		'id',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_state_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'c'),
		'id',
        'c',
        commodity_id,
        NULL,
		fo_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_zone_id, commodity_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'm'),
		'id',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'm'),
		'id',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_region_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'm'),
		'id',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_state_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'm'),
		'id',
        'm',
        f_mode_id,
        NULL,
		fo_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_zone_id, f_mode_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'y'),
		'id',
        'y',
        year,
        NULL,
		fo_zone_id,
		0 AS target,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'y'),
		'id',
        'y',
        year,
        NULL,
		fo_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_region_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'y'),
		'id',
        'y',
        year,
        NULL,
		fo_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_state_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'y'),
		'id',
        'y',
        year,
        NULL,
		fo_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_import_records
	GROUP BY 
		fo_zone_id, dd_zone_id, year;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'a'),
		'ep',
        'a',
        NULL,
        NULL,
        0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'a'),
		'ep',
        'a',
        NULL,
        NULL,
		dd_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_region_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'a'),
		'ep',
        'a',
        NULL,
        NULL,
		dd_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_state_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'a'),
		'ep',
        'a',
        NULL,
        NULL,
		dd_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_zone_id;
        
        


INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'c'),
		'ep',
        'c',
        commodity_id,
        NULL,
		0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'c'),
		'ep',
        'c',
        commodity_id,
        NULL,
		dd_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_region_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'c'),
		'ep',
        'c',
        commodity_id,
        NULL,
		dd_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_state_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'c'),
		'ep',
        'c',
        commodity_id,
        NULL,
		dd_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_zone_id, commodity_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'm'),
		'ep',
        'm',
        f_mode_id,
        NULL,
		0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'm'),
		'ep',
        'm',
        f_mode_id,
        NULL,
		dd_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_region_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'm'),
		'ep',
        'm',
        f_mode_id,
        NULL,
		dd_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_state_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'm'),
		'ep',
        'm',
        f_mode_id,
        NULL,
		dd_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_zone_id, f_mode_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'y'),
		'ep',
        'y',
        year,
        NULL,
		0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'y'),
		'ep',
        'y',
        year,
        NULL,
		dd_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_region_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'y'),
		'ep',
        'y',
        year,
        NULL,
		dd_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_state_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'y'),
		'ep',
        'y',
        year,
        NULL,
		dd_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, dd_zone_id, year;
        
        

INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_region_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_state_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_zone_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_state_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_region_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_zone_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_region_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_zone_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'a'),
        'ep',
        'a',
        NULL,
		fd_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_state_id;
        
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_region_id, commodity_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_state_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_zone_id, commodity_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_state_id, commodity_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_region_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_zone_id, commodity_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_region_id, commodity_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_zone_id, commodity_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'c'),
        'ep',
        'c',
        commodity_id,
		fd_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_state_id, commodity_id;
        
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_region_id, f_mode_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_state_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_zone_id, f_mode_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_state_id, f_mode_id;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_region_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_zone_id, f_mode_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_region_id, f_mode_id; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_zone_id, f_mode_id;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'm'),
        'ep',
        'm',
        f_mode_id,
		fd_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_state_id, f_mode_id;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('rr', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_region_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_region_id, year;
        
INSERT INTO map_edges    
	SELECT
		CONCAT('ss', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_state_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_state_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zz', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_zone_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_zone_id != dd_zone_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_zone_id, year;

INSERT INTO map_edges    
	SELECT
		CONCAT('rs', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_region_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_state_id, year;

INSERT INTO map_edges    
	SELECT
		CONCAT('sr', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_state_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_region_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('rz', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_region_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_region_id, dd_zone_id, year; 

INSERT INTO map_edges    
	SELECT
		CONCAT('zr', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_zone_id,
		dd_region_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_region_id != dd_region_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_region_id, year; 

INSERT INTO map_edges    
	SELECT
		CONCAT('sz', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_state_id,
		dd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_state_id, dd_zone_id, year;
    
INSERT INTO map_edges    
	SELECT
		CONCAT('zs', ROW_NUMBER() OVER(), 'y'),
        'ep',
        'y',
        year,
		fd_zone_id,
		do_zone_id,
		dd_state_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	WHERE 
		do_state_id != dd_state_id
	GROUP BY 
		fd_zone_id, do_zone_id, dd_state_id, year;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'a'),
		'ed',
        'a',
        NULL,
        NULL,
        0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'a'),
		'ed',
        'a',
        NULL,
        NULL,
        do_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_region_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'a'),
		'ed',
        'a',
        NULL,
        NULL,
        do_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_state_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'a'),
		'ed',
        'a',
        NULL,
        NULL,
        do_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_zone_id;
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'c'),
		'ed',
        'c',
        commodity_id,
        NULL,
        0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'c'),
		'ed',
        'c',
        commodity_id,
        NULL,
        do_region_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_region_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'c'),
		'ed',
        'c',
        commodity_id,
        NULL,
        do_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_state_id, commodity_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'c'),
		'ed',
        'c',
        commodity_id,
        NULL,
        do_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_zone_id, commodity_id;
        
        
INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'm'),
		'ed',
        'm',
        f_mode_id,
        NULL,
		0 AS target,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'm'),
		'ed',
        'm',
        f_mode_id,
        NULL,
		do_region_id,
        fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_region_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'm'),
		'ed',
        'm',
        f_mode_id,
        NULL,
		do_state_id,
        fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_state_id, f_mode_id;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'm'),
		'ed',
        'm',
        f_mode_id,
        NULL,
		do_zone_id,
        fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_zone_id, f_mode_id;
        
        INSERT INTO map_edges
	SELECT
		CONCAT('fu', ROW_NUMBER() OVER(), 'y'),
		'ed',
        'y',
        year,
        NULL,
		0 AS target,
        fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fr', ROW_NUMBER() OVER(), 'y'),
		'ed',
        'y',
        year,
        NULL,
		do_region_id,
        fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_region_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fs', ROW_NUMBER() OVER(), 'y'),
		'ed',
        'y',
        year,
        NULL,
        do_state_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_state_id, year;

INSERT INTO map_edges
	SELECT
		CONCAT('fz', ROW_NUMBER() OVER(), 'y'),
		'ed',
        'y',
        year,
        NULL,
        do_zone_id,
		fd_zone_id,
		SUM(tons),
		SUM(usd),
        SUM(usd)/SUM(tons)
	FROM 
		f_export_records
	GROUP BY 
		fd_zone_id, do_zone_id, year;
        
CREATE INDEX map_edge_index ON map_edges(map, category, subcategory, fzone);