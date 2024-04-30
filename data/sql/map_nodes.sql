USE faf5;
DROP TABLE IF EXISTS map_nodes;

CREATE TABLE map_nodes (
	id INT,
    label TEXT,
    type VARCHAR(1),
    x INT,
    y INT,
    fzone_id INT,
    fzone_desc TEXT,
    region_id INT,
    region_desc TEXT,
    state_id INT,
    state_desc TEXT,
    zone_id INT,
    zone_desc TEXT
);

INSERT INTO map_nodes
	SELECT
		foreign_zones.fr_id,
		foreign_zones.fr_desc,
		'f',
		foreign_zones.x,
		foreign_zones.y,
        foreign_zones.fr_id,
		foreign_zones.fr_desc,
        NULL,
		NULL,
		NULL,
		NULL,
		NULL,
		NULL
	FROM
		foreign_zones;

INSERT INTO map_nodes
	SELECT 
		regions.region_id,
		regions.region_desc,
		'r',
		regions.region_x,
		regions.region_y,
        NULL,
        NULL,
		regions.region_id,
		regions.region_desc,
		NULL,
		NULL,
		NULL,
		NULL
	FROM 
		regions;

INSERT INTO map_nodes
	SELECT 
		states.state_id,
        states.state_desc,
		's',
		states.state_x,
		states.state_y,
        NULL,
        NULL,
		regions.region_id,
		regions.region_desc,
		states.state_id,
		states.state_desc,
		NULL,
		NULL
	FROM 
		states
		LEFT JOIN state_region_assoc
			ON states.state_id = state_region_assoc.state_id
		LEFT JOIN regions
			ON state_region_assoc.region_id = regions.region_id;

INSERT INTO map_nodes
	SELECT 
		domestic_zones.dms_id,
        domestic_zones.dms_desc,
        'z',
		domestic_zones.dms_x,
		domestic_zones.dms_y,
        NULL,
        NULL,
        regions.region_id,
		regions.region_desc,
        states.state_id,
		states.state_desc,
		domestic_zones.dms_id,
		domestic_zones.dms_desc
	FROM 
		domestic_zones
		LEFT JOIN zone_state_assoc
			ON domestic_zones.dms_id = zone_state_assoc.zone_id
		LEFT JOIN states
			ON zone_state_assoc.state_id = states.state_id
		LEFT JOIN state_region_assoc
			ON state_region_assoc.state_id = states.state_id
		LEFT JOIN regions
			ON state_region_assoc.region_id = regions.region_id;
            
INSERT INTO map_nodes 
	VALUES (0, 'USA', 'u', 537, 350, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);