# DROP DATABASE IF EXISTS faf5;
#CREATE DATABASE faf5;

USE faf5;

DROP TABLE IF EXISTS records_temp;
CREATE TABLE records_temp (
	fr_orig INT,
    dms_orig INT,
    dms_dest INT,
    fr_dest INT,
    fr_inmode INT,
    dms_mode INT,
    fr_outmode INT,
    sctg2 INT,
    trade_type INT,
    dist_band INT,
    tons_2018 DOUBLE,
    tons_2019 DOUBLE,
    tons_2020 DOUBLE,
    tons_2021 DOUBLE,
    tons_2022 DOUBLE,
    value_2018 DOUBLE,
    value_2019 DOUBLE,
    value_2020 DOUBLE,
    value_2021 DOUBLE,
    value_2022 DOUBLE,
    current_value_2018 DOUBLE,
    current_value_2019 DOUBLE,
    current_value_2020 DOUBLE,
    current_value_2021 DOUBLE,
    current_value_2022 DOUBLE,
    tmiles_2018 DOUBLE,
    tmiles_2019 DOUBLE,
    tmiles_2020 DOUBLE,
    tmiles_2021 DOUBLE,
    tmiles_2022 DOUBLE
);

DROP TABLE IF EXISTS domestic_zones;
CREATE TABLE domestic_zones (
	dms_id INT,
    dms_desc TEXT,
    dms_x INT,
    dms_y INT
);

DROP TABLE IF EXISTS foreign_zones;
CREATE TABLE foreign_zones (
	fr_id INT,
    fr_desc TEXT,
    x INT,
    y INT
);

DROP TABLE IF EXISTS commodity;
CREATE TABLE commodity (
	id INT,
    `desc` TEXT
);

DROP TABLE IF EXISTS distance_bands;
CREATE TABLE distance_bands (
	db_id INT,
    db_desc TEXT
);

DROP TABLE IF EXISTS trade_type;
CREATE TABLE trade_type (
	tt_id INT,
    tt_desc TEXT
);

DROP TABLE IF EXISTS transportation_mode;
CREATE TABLE transportation_mode (   
	id INT,
    `desc` TEXT
);

DROP TABLE IF EXISTS zone_state_assoc;
CREATE TABLE zone_state_assoc (
	zone_id INT,
    state_id INT
);

DROP TABLE IF EXISTS state_region_assoc;
CREATE TABLE state_region_assoc (
	state_id INT,
    region_id INT
);

DROP TABLE IF EXISTS states;
CREATE TABLE states (
	state_id INT,
    state_desc TEXT,
    state_x INT,
    state_y INT
);

DROP TABLE IF EXISTS regions;
CREATE TABLE regions (
	region_id INT,
    region_desc TEXT,
    region_x INT,
    region_y INT
);

LOAD DATA LOCAL
    INFILE 'records.csv'
    INTO TABLE records_temp
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

LOAD DATA LOCAL
    INFILE 'commodity.csv'
    INTO TABLE commodity
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

LOAD DATA LOCAL
    INFILE 'distance_bands.csv'
    INTO TABLE distance_bands
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'domestic_zones.csv'
    INTO TABLE domestic_zones
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'foreign_zones.csv'
    INTO TABLE foreign_zones
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'trade_type.csv'
    INTO TABLE trade_type
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'transportation_mode.csv'
    INTO TABLE transportation_mode
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'zone_state_assoc.csv'
    INTO TABLE zone_state_assoc
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

LOAD DATA LOCAL
    INFILE 'state_region_assoc.csv'
    INTO TABLE state_region_assoc
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'states.csv'
    INTO TABLE states
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
    
LOAD DATA LOCAL
    INFILE 'regions.csv'
    INTO TABLE regions
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

DROP TABLE IF EXISTS records;
CREATE TABLE records(
	fr_orig_id INT,
    fr_inmode_id INT,
    dms_orig_id INT,
    dms_mode_id INT,
    dms_dest_id INT,
    fr_outmode_id INT,
    fr_dest_id INT,
    commodity_id INT,
    trade_type_id INT,
	tons DOUBLE,
    usd DOUBLE,
    `year` INT
);

INSERT INTO records
	SELECT fr_orig,
			fr_inmode,
			dms_orig, 
			dms_mode,
			dms_dest, 
			fr_outmode,
			fr_dest,
			sctg2,
            trade_type,
			tons_2018 * 1000,
			value_2018 * 1000000,
			2018
		FROM records_temp;

INSERT INTO records
	SELECT fr_orig,
		fr_inmode,
		dms_orig, 
		dms_mode,
		dms_dest, 
		fr_outmode,
		fr_dest,
		sctg2,
        trade_type,
		tons_2019 * 1000,
		value_2019 * 1000000,
		2019
	FROM records_temp;


INSERT INTO records
	SELECT fr_orig,
		fr_inmode,
		dms_orig, 
		dms_mode,
		dms_dest, 
		fr_outmode,
		fr_dest,
		sctg2,
		trade_type,
		tons_2020 * 1000,
		value_2020 * 1000000,
		2020
	FROM records_temp;
    
INSERT INTO records
	SELECT fr_orig,
		fr_inmode,
		dms_orig, 
		dms_mode,
		dms_dest, 
		fr_outmode,
		fr_dest,
        sctg2,
        trade_type,
		tons_2021 * 1000,
		value_2021 * 1000000,
		2021
	FROM records_temp;

INSERT INTO records
	SELECT fr_orig,
		fr_inmode,
		dms_orig, 
		dms_mode,
		dms_dest, 
		fr_outmode,
		fr_dest,
        sctg2,
        trade_type,
		tons_2022 * 1000,
		value_2022 * 1000000,
		2022
	FROM records_temp;

DROP TABLE records_temp;

DELETE FROM records WHERE tons = 0;

DROP TABLE IF EXISTS interdf_records;
CREATE TABLE interdf_records
	SELECT 
		ROW_NUMBER() OVER() AS id,
		srao.region_id AS o_region_id, 
		zsao.state_id AS o_state_id,
		a.dms_orig_id AS o_zone_id,
        srad.region_id AS d_region_id, 
		zsad.state_id AS d_state_id,
		a.dms_dest_id AS d_zone_id,
        a.commodity_id,
        commodity.desc AS commodity,
        a.dms_mode_id AS mode_id,
        transportation_mode.desc AS `mode`,
		a.tons,
		a.usd,
		a.`year`
    FROM
		(SELECT dms_orig_id, 
			dms_mode_id,
			dms_dest_id, 
			commodity_id,
			tons,
			usd,
			`year`
		FROM records
		WHERE trade_type_id = 1) a
	LEFT JOIN zone_state_assoc zsao
		ON a.dms_orig_id = zsao.zone_id
	LEFT JOIN zone_state_assoc zsad
		ON a.dms_dest_id = zsad.zone_id
	LEFT JOIN state_region_assoc srao
		ON zsao.state_id = srao.state_id
	LEFT JOIN state_region_assoc srad
		ON zsad.state_id = srad.state_id
	LEFT JOIN commodity
		ON a.commodity_id = commodity.id
	LEFT JOIN transportation_mode
		ON a.dms_mode_id = transportation_mode.id;

CREATE INDEX o_zone_index
	ON interdf_records (o_zone_id);

CREATE INDEX d_zone_index
	ON interdf_records (d_zone_id);
    
CREATE INDEX o_state_index
	ON interdf_records (o_state_id);

CREATE INDEX d_state_index
	ON interdf_records (d_state_id);
    
CREATE INDEX o_region_index
	ON interdf_records (o_region_id);

CREATE INDEX d_region_index
	ON interdf_records (d_region_id);

CREATE INDEX mode_index
	ON interdf_records (mode_id);

CREATE INDEX commodity_index
	ON interdf_records (commodity_id);
    
CREATE INDEX year_index
	ON interdf_records (year);

DROP TABLE IF EXISTS f_import_records;    
CREATE TABLE f_import_records
	SELECT 
		ROW_NUMBER() OVER() AS id,
        r.fr_orig_id AS fo_zone_id,
		r.fr_inmode_id AS f_mode_id,
        fm.desc AS f_mode,
        srao.region_id AS do_region_id,
        zsao.state_id AS do_state_id,
		r.dms_orig_id AS do_zone_id, 
		r.dms_mode_id AS d_mode_id,
        dm.desc AS d_mode,
		srad.region_id AS dd_region_id,
        zsad.state_id AS dd_state_id,
        r.dms_dest_id AS dd_zone_id, 
		r.commodity_id,
        commodity.desc AS commodity,
		r.tons,
        r.usd,
        `year`
	FROM 
		records r
		LEFT JOIN zone_state_assoc zsao
			ON r.dms_orig_id = zsao.zone_id
		LEFT JOIN zone_state_assoc zsad
			ON r.dms_dest_id = zsad.zone_id
		LEFT JOIN state_region_assoc srao
			ON zsao.state_id = srao.state_id
		LEFT JOIN state_region_assoc srad
			ON zsad.state_id = srad.state_id
		LEFT JOIN commodity
			ON r.commodity_id = commodity.id
		LEFT JOIN transportation_mode fm
			ON r.fr_inmode_id = fm.id
		LEFT JOIN transportation_mode dm
			ON r.dms_mode_id = dm.id
    WHERE r.trade_type_id = 2;
    
CREATE INDEX fo_zone_index
	ON f_import_records (fo_zone_id);

CREATE INDEX do_zone_index
	ON f_import_records (do_zone_id);

CREATE INDEX dd_zone_index
	ON f_import_records (dd_zone_id);
    
CREATE INDEX do_state_index
	ON f_import_records (do_state_id);

CREATE INDEX dd_state_index
	ON f_import_records (dd_state_id);
    
CREATE INDEX do_region_index
	ON f_import_records (do_region_id);

CREATE INDEX dd_region_index
	ON f_import_records (dd_region_id);
    
CREATE INDEX mode_index
	ON f_import_records (f_mode_id);

CREATE INDEX commodity_index
	ON f_import_records (commodity_id);
    
CREATE INDEX year_index
	ON f_import_records (year);
 
DROP TABLE IF EXISTS f_export_records;
CREATE TABLE f_export_records
	SELECT 
		ROW_NUMBER() OVER() AS id,
        srao.region_id AS do_region_id,
        zsao.state_id AS do_state_id,
		r.dms_orig_id AS do_zone_id, 
		r.dms_mode_id AS d_mode_id,
        dm.desc AS d_mode,
		srad.region_id AS dd_region_id,
        zsad.state_id AS dd_state_id,
        r.dms_dest_id AS dd_zone_id, 
        r.fr_dest_id AS fd_zone_id,
        r.fr_outmode_id AS f_mode_id,
        fm.desc AS f_mode,
		r.commodity_id,
        commodity.desc AS commodity,
        year,
		r.tons,
        r.usd
	FROM 
		records r
		LEFT JOIN zone_state_assoc zsao
			ON r.dms_orig_id = zsao.zone_id
		LEFT JOIN zone_state_assoc zsad
			ON r.dms_dest_id = zsad.zone_id
		LEFT JOIN state_region_assoc srao
			ON zsao.state_id = srao.state_id
		LEFT JOIN state_region_assoc srad
			ON zsad.state_id = srad.state_id
		LEFT JOIN commodity
			ON r.commodity_id = commodity.id
		LEFT JOIN transportation_mode fm
			ON r.fr_outmode_id = fm.id
		LEFT JOIN transportation_mode dm
			ON r.dms_mode_id = dm.id
    WHERE trade_type_id = 3;
    
CREATE INDEX fd_zone_index
	ON f_export_records (fd_zone_id);

CREATE INDEX do_zone_index
	ON f_export_records (do_zone_id);

CREATE INDEX dd_zone_index
	ON f_export_records (dd_zone_id);
    
CREATE INDEX do_state_index
	ON f_export_records (do_state_id);

CREATE INDEX dd_state_index
	ON f_export_records (dd_state_id);
    
CREATE INDEX do_region_index
	ON f_export_records (do_region_id);

CREATE INDEX dd_region_index
	ON f_export_records (dd_region_id);

CREATE INDEX mode_index
	ON f_export_records (f_mode_id);

CREATE INDEX commodity_index
	ON f_export_records (commodity_id);
    
CREATE INDEX year_index
	ON f_export_records (year);

DROP TABLE records;

DROP TABLE IF EXISTS df_chart_init;
CREATE TABLE df_chart_init AS
	SELECT 
		ROW_NUMBER() OVER() AS id,
		commodity,
		mode,
		year,
		SUM(tons) AS tons,
		SUM(usd) AS usd
	FROM 
		interdf_records
	GROUP BY
		commodity_id, mode_id, `year`;

DROP TABLE IF EXISTS fi_chart_init;
CREATE TABLE fi_chart_init AS
	SELECT 
		ROW_NUMBER() OVER() AS id,
		commodity,
		f_mode AS mode,
		year,
		SUM(tons) AS tons,
		SUM(usd) AS usd
	FROM 
		f_import_records
	GROUP BY
		commodity_id, f_mode_id, `year`;
        
DROP TABLE IF EXISTS fe_chart_init;
CREATE TABLE fe_chart_init AS
	SELECT 
		ROW_NUMBER() OVER() AS id,
		commodity,
		f_mode AS mode,
		year,
		SUM(tons) AS tons,
		SUM(usd) AS usd
	FROM 
		f_export_records
	GROUP BY
		commodity_id, f_mode_id, `year`;


