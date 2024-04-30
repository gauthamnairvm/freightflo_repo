USE faf5;
# SELECT * FROM region_nodes;
# SELECT * FROM state_nodes;
# SELECT * FROM zone_nodes;
# SELECT * FROM region_region_edges;
# SELECT * FROM region_state_edges;
# SELECT * FROM state_state_edges;
# SELECT * FROM region_zone_edges;
# SELECT * FROM state_zone_edges;
# SELECT * FROM zone_zone_edges;



# Region Nodes

DROP TABLE IF EXISTS region_nodes;
# CREATE TABLE region_nodes
	WITH same_region AS
		(SELECT 
			o_region_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE o_region_id = d_region_id
		GROUP BY
			o_region_id, d_region_id
		)
	SELECT 
		regions.region_id AS id,
        'r' AS type,
        regions.region_x AS x,
        regions.region_y AS y,
		regions.region_id AS region_id,
        regions.region_desc,
        NULL AS state_id,
        NULL AS state_desc,
        NULL AS zone_id,
        NULL AS zone_desc,
        same_region.tons,
        same_region.usd
	FROM 
		regions
		LEFT JOIN same_region
			ON regions.region_id = same_region.o_region_id;

ALTER TABLE region_nodes
	ADD PRIMARY KEY (region_id);

# State Nodes

DROP TABLE IF EXISTS state_nodes;
CREATE TABLE state_nodes
WITH same_state AS
	(SELECT 
		o_state_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd
	FROM 
		interdf_records
	WHERE o_state_id = d_state_id
	GROUP BY
		o_state_id, d_state_id)
SELECT 
	states.state_id AS id,
    's' AS type,
	states.state_x AS x,
	states.state_y AS y,
	regions.region_id,
	regions.region_desc,
    states.state_id,
	states.state_desc,
    NULL AS zone_id,
    NULL AS zone_desc,
    same_state.tons,
    same_state.usd
FROM 
	states
	LEFT JOIN state_region_assoc
		ON states.state_id = state_region_assoc.state_id
	LEFT JOIN regions
		ON state_region_assoc.region_id = regions.region_id
	LEFT JOIN same_state
		ON states.state_id = same_state.o_state_id;

ALTER TABLE state_nodes
	ADD PRIMARY KEY (state_id);


# Zone Nodes

DROP TABLE IF EXISTS zone_nodes;
CREATE TABLE zone_nodes
	WITH same_zone AS
	(SELECT 
		o_zone_id,
		SUM(tons) AS tons,
		SUM(usd) AS usd
	FROM 
		interdf_records
	WHERE o_zone_id = d_zone_id
	GROUP BY
		o_zone_id, d_zone_id)
	SELECT 
		domestic_zones.dms_id AS id,
        'z' AS type,
		domestic_zones.dms_x AS x,
		domestic_zones.dms_y AS y,
        regions.region_id,
		regions.region_desc,
        states.state_id,
		states.state_desc,
		domestic_zones.dms_id AS zone_id,
		domestic_zones.dms_desc AS zone_desc,
        same_zone.tons AS tons, 
        same_zone.usd AS usd
	FROM 
		domestic_zones
		LEFT JOIN zone_state_assoc
			ON domestic_zones.dms_id = zone_state_assoc.zone_id
		LEFT JOIN states
			ON zone_state_assoc.state_id = states.state_id
		LEFT JOIN state_region_assoc
			ON state_region_assoc.state_id = states.state_id
		LEFT JOIN regions
			ON state_region_assoc.region_id = regions.region_id
		LEFT JOIN same_zone
			ON domestic_zones.dms_id = same_zone.o_zone_id;

ALTER TABLE zone_nodes
	ADD PRIMARY KEY (zone_id);

# Region - Region Edges

DROP TABLE IF EXISTS region_region_edges;
# CREATE TABLE region_region_edges
	WITH region_group AS
		(SELECT 
			o_region_id,
			d_region_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		GROUP BY
			o_region_id, d_region_id)
	SELECT
		CONCAT(a.o_region_id, 0, a.d_region_id),
        'rr' AS type,
		(CASE WHEN a.tons > b.tons THEN a.o_region_id ELSE a.d_region_id END) AS `source`, 
		(CASE WHEN a.tons > b.tons THEN a.d_region_id ELSE a.o_region_id END) AS target, 
		(CASE WHEN b.tons IS NOT NULL THEN a.tons + b.tons ELSE a.tons END) AS tons,
		ABS(a.tons - (CASE WHEN b.tons IS NOT NULL THEN b.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN b.usd IS NOT NULL THEN a.usd + b.usd ELSE a.usd END) AS usd,
		ABS(a.usd - (CASE WHEN b.usd IS NOT NULL THEN b.usd ELSE 0 END)) AS usd_diff
	FROM
		region_group a
		LEFT JOIN region_group b
			ON a.o_region_id = b.d_region_id AND a.d_region_id = b.o_region_id
	WHERE a.o_region_id > a.d_region_id OR a.o_region_id IS NULL;
    
ALTER TABLE region_region_edges
	ADD PRIMARY KEY (id);



# Region - State Edges

DROP TABLE IF EXISTS region_state_edges;
CREATE TABLE region_state_edges
	WITH region_state_group AS
		(SELECT 
			o_region_id,
			d_state_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_region_id != d_region_id
		GROUP BY
			o_region_id, d_state_id),
		state_region_group AS
		(SELECT 
			o_state_id,
			d_region_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_region_id != d_region_id
		GROUP BY
			o_state_id, d_region_id)
	SELECT
		CONCAT('r', region_state_group.o_region_id, 's', region_state_group.d_state_id) AS id,
		(CASE WHEN region_state_group.tons > state_region_group.tons THEN region_state_group.o_region_id ELSE region_state_group.d_state_id END) AS `source`, 
		(CASE WHEN region_state_group.tons > state_region_group.tons THEN region_state_group.d_state_id ELSE region_state_group.o_region_id END) AS target, 
		(CASE WHEN state_region_group.tons IS NOT NULL THEN region_state_group.tons + state_region_group.tons ELSE region_state_group.tons END) AS tons,
		ABS(region_state_group.tons - (CASE WHEN state_region_group.tons IS NOT NULL THEN state_region_group.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN state_region_group.usd IS NOT NULL THEN region_state_group.usd + state_region_group.usd ELSE region_state_group.usd END) AS usd,
		ABS(region_state_group.usd - (CASE WHEN state_region_group.usd IS NOT NULL THEN state_region_group.usd ELSE 0 END)) AS usd_diff
	FROM
		region_state_group
		LEFT JOIN state_region_group
			ON region_state_group.o_region_id = state_region_group.d_region_id AND region_state_group.d_state_id = state_region_group.o_state_id;
            
ALTER TABLE region_state_edges
	ADD PRIMARY KEY (id);



# State - State Edges

DROP TABLE IF EXISTS state_state_edges;
CREATE TABLE state_state_edges
	WITH state_group AS
		(SELECT 
			o_state_id,
			d_state_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		GROUP BY
			o_state_id, d_state_id)
	SELECT DISTINCT
		CONCAT('s', a.o_state_id, 's', a.d_state_id) AS id,
		(CASE WHEN a.tons > b.tons THEN a.o_state_id ELSE a.d_state_id END) AS `source`, 
		(CASE WHEN a.tons > b.tons THEN a.d_state_id ELSE a.o_state_id END) AS target, 
		(CASE WHEN b.tons IS NOT NULL THEN a.tons + b.tons ELSE a.tons END) AS tons,
		ABS(a.tons - (CASE WHEN b.tons IS NOT NULL THEN b.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN b.usd IS NOT NULL THEN a.usd + b.usd ELSE a.usd END) AS usd,
		ABS(a.usd - (CASE WHEN b.usd IS NOT NULL THEN b.usd ELSE 0 END)) AS usd_diff
	FROM
		state_group a
		LEFT JOIN state_group b
			ON a.o_state_id = b.d_state_id AND a.d_state_id = b.o_state_id
	WHERE a.o_state_id > a.d_state_id OR a.o_state_id IS NULL;
    
ALTER TABLE state_state_edges
	ADD PRIMARY KEY (id);



# Region - Zone Edges

DROP TABLE IF EXISTS region_zone_edges;
CREATE TABLE region_zone_edges
	WITH region_zone_group AS
		(SELECT 
			o_region_id,
			d_zone_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_region_id != d_region_id 
		GROUP BY
			o_region_id, d_zone_id),
		zone_region_group AS
		(SELECT 
			o_zone_id,
			d_region_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_region_id != d_region_id
		GROUP BY
			o_zone_id, d_region_id)
	SELECT
		CONCAT('r', region_zone_group.o_region_id, 'z', region_zone_group.d_zone_id) AS id,
		(CASE WHEN region_zone_group.tons > zone_region_group.tons THEN region_zone_group.o_region_id ELSE region_zone_group.d_zone_id END) AS `source`, 
		(CASE WHEN region_zone_group.tons > zone_region_group.tons THEN region_zone_group.d_zone_id ELSE region_zone_group.o_region_id END) AS target, 
		(CASE WHEN zone_region_group.tons IS NOT NULL THEN region_zone_group.tons + zone_region_group.tons ELSE region_zone_group.tons END) AS tons,
		ABS(region_zone_group.tons - (CASE WHEN zone_region_group.tons IS NOT NULL THEN zone_region_group.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN zone_region_group.usd IS NOT NULL THEN region_zone_group.usd + zone_region_group.usd ELSE region_zone_group.usd END) AS usd,
		ABS(region_zone_group.usd - (CASE WHEN zone_region_group.usd IS NOT NULL THEN zone_region_group.usd ELSE 0 END)) AS usd_diff
	FROM
		region_zone_group
		LEFT JOIN zone_region_group
			ON region_zone_group.o_region_id = zone_region_group.d_region_id AND region_zone_group.d_zone_id = zone_region_group.o_zone_id;
            
ALTER TABLE region_zone_edges
	ADD PRIMARY KEY (id);



# State - Zone Edges

DROP TABLE IF EXISTS state_zone_edges;
CREATE TABLE state_zone_edges
	WITH state_zone_group AS
		(SELECT 
			o_state_id,
			d_zone_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_region_id = d_region_id AND o_state_id != d_state_id 
		GROUP BY
			o_state_id, d_zone_id),
		zone_state_group AS
		(SELECT 
			o_zone_id,
			d_state_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		WHERE 
			o_state_id != d_state_id 
		GROUP BY
			o_zone_id, d_state_id)
	SELECT	
		CONCAT('s', state_zone_group.o_state_id, 'z', state_zone_group.d_zone_id) AS id,
		(CASE WHEN state_zone_group.tons > zone_state_group.tons THEN state_zone_group.o_state_id ELSE state_zone_group.d_zone_id END) AS `source`, 
		(CASE WHEN state_zone_group.tons > zone_state_group.tons THEN state_zone_group.d_zone_id ELSE state_zone_group.o_state_id END) AS target, 
		(CASE WHEN zone_state_group.tons IS NOT NULL THEN state_zone_group.tons + zone_state_group.tons ELSE state_zone_group.tons END) AS tons,
		ABS(state_zone_group.tons - (CASE WHEN zone_state_group.tons IS NOT NULL THEN zone_state_group.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN zone_state_group.usd IS NOT NULL THEN state_zone_group.usd + zone_state_group.usd ELSE state_zone_group.usd END) AS usd,
		ABS(state_zone_group.usd - (CASE WHEN zone_state_group.usd IS NOT NULL THEN zone_state_group.usd ELSE 0 END)) AS usd_diff
	FROM state_zone_group
		LEFT JOIN zone_state_group
			ON state_zone_group.o_state_id = zone_state_group.d_state_id AND state_zone_group.d_zone_id = zone_state_group.o_zone_id;
	
ALTER TABLE state_zone_edges
	ADD PRIMARY KEY (id);



# Zone - Zone Edges

DROP TABLE IF EXISTS zone_zone_edges;
CREATE TABLE zone_zone_edges
	WITH zone_group AS
		(SELECT 
			o_zone_id,
			d_zone_id,
			SUM(tons) AS tons,
			SUM(usd) AS usd
		FROM 
			interdf_records
		GROUP BY
			o_zone_id, d_zone_id)
	SELECT DISTINCT
		CONCAT('z', a.o_zone_id, 'z', a.d_zone_id) AS id,
		(CASE WHEN a.tons > b.tons THEN a.o_zone_id ELSE a.d_zone_id END) AS `source`, 
		(CASE WHEN a.tons > b.tons THEN a.d_zone_id ELSE a.o_zone_id END) AS target, 
		(CASE WHEN b.tons IS NOT NULL THEN a.tons + b.tons ELSE a.tons END) AS tons,
		ABS(a.tons - (CASE WHEN b.tons IS NOT NULL THEN b.tons ELSE 0 END)) AS tons_diff, 
		(CASE WHEN b.usd IS NOT NULL THEN a.usd + b.usd ELSE a.usd END) AS usd,
		ABS(a.usd - (CASE WHEN b.usd IS NOT NULL THEN b.usd ELSE 0 END)) AS usd_diff
	FROM
		zone_group a
		LEFT JOIN zone_group b
			ON a.o_zone_id = b.d_zone_id AND a.d_zone_id = b.o_zone_id
	WHERE a.o_zone_id > a.d_zone_id OR a.o_zone_id IS NULL;
    
ALTER TABLE zone_zone_edges
	ADD PRIMARY KEY (id);



                
