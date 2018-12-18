# routing functions:
```sql
CREATE OR REPLACE FUNCTION belgium.create_area(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

--delete from belgium.matrixresult;

DECLARE target RECORD;
BEGIN
   FOR target IN select distinct startid from belgium.cloudresult LOOP
   
      RAISE NOTICE '% done!', target.startid;
      insert into belgium.arearesult(startid, geom)
      select target.startid, ST_SetSRID(pgr_pointsaspolygon, 4326) as geom from pgr_pointsaspolygon(
    'SELECT startid as id, ST_X(geom) AS x, ST_Y(geom) AS y
    FROM belgium.cloudresult where startid = '||target.startid,0.01);

   END LOOP;
END; 

$BODY$;

CREATE OR REPLACE FUNCTION belgium.create_cloud(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE target RECORD;
BEGIN
   FOR target IN select id, dt, geom from belgium.rawdata LOOP                  -- set iteration limit
   
      RAISE NOTICE '% done!', target.id;
      insert into belgium.cloudresult(startid, seq, node, edge, cost, agg_cost, geom)
      SELECT target.id, * from getthatcloud(
          target.geom,                                                                  
          target.dt,                                                                           -- set radius
          32);                                                                          -- set country code (telephone country code)

   END LOOP;
   END;
   

$BODY$;

CREATE OR REPLACE FUNCTION belgium.create_matrix(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

--delete from belgium.matrixresult;

--DO $$

DECLARE target RECORD;
BEGIN
   FOR target IN select id, dt, geom from belgium.rawdata limit 100 LOOP
   
      RAISE NOTICE '% done!', target.id;
      insert into belgium.matrixresult(startid, source, target, agg_cost, geom, name)
        
    SELECT target.id,m.start_vid, m.end_vid, m.agg_cost, si.pc_geom, si.name
    from pgr_dijkstraCost(
                'SELECT id, source, target, cost FROM belgium.roads_nw where cost >= 0',
                                                                                                --endpoints
        (SELECT ARRAY(select source from
        (select DISTINCT ON(startgeom.id) startgeom.id, startgeom.geom, r.source, r.geom, ST_distance(r.geom, startgeom.geom)
        from    (
              select p.id, p.name, p.geom from belgium.pc_centroids as p, belgium.arearesult as a
                --where st_intersects(p.geom, st_buffer(s.geom,(15200/100000::float))) and s.id = 4
				where st_contains(a.geom, p.geom) and a.startid = target.id             
                ) as startgeom,
            belgium.roads_nw as r
            where st_intersects(r.geom, (st_buffer(startgeom.geom, 0.01)))                         --exit point tolerance
            group by startgeom.id, startgeom.geom, r.geom, r.source, startgeom.name
            order by startgeom.id, ST_distance(r.geom, startgeom.geom) asc)as si)as startids
        ),
                                                                                                --startpoint
        (select source
         from belgium.roads_nw as r, belgium.rawdata as s 
            where ST_Intersects(r.geom, (st_buffer(s.geom, 0.008))) and s.id = target.id            --entry point tolerance
            order by ST_distance(r.geom, (st_buffer(s.geom, 0.008))) LIMIT 1),
        false) as m
        inner join 
        (select DISTINCT ON(startgeom.id) startgeom.id, startgeom.name, startgeom.geom as pc_geom,r.source, r.geom, ST_distance(r.geom, startgeom.geom)
        from    (
                select p.id, p.name, p.geom from belgium.pc_centroids as p, belgium.arearesult as a
                --where st_intersects(p.geom, st_buffer(s.geom,(15200/100000::float))) and s.id = 4
				where st_contains(a.geom, p.geom) and a.startid = target.id              
                ) as startgeom,
            belgium.roads_nw as r
            where st_intersects(r.geom, (st_buffer(startgeom.geom, 0.08)))						--exit point?
            group by startgeom.id, startgeom.geom, r.geom, r.source, startgeom.name
            order by startgeom.id, ST_distance(r.geom, startgeom.geom) asc)as si
        on si.source = m.start_vid;
    END LOOP;
END; --$$

$BODY$;

CREATE OR REPLACE FUNCTION belgium.fill_hexgrid(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN
insert into belgium.gridresult (geom, avg_cost, startid)
select g.geom, avg(c.agg_cost), c.startid
from belgium.grid_bel as g
inner join belgium.cloudresult as c
on st_contains(g.geom, c.geom) 
group by g.geom, c.startid;  
END

$BODY$;


CREATE OR REPLACE FUNCTION belgium.gravitation(
	)
    RETURNS void
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$

--delete from belgium.gravitationresult;
insert into belgium.gravitationresult(startid, agg_cost, geom, probability, name)

select startid, agg_cost, --s.geom as site_geom, n.geom as pc_geom,
st_makeLine(s.geom, (st_dump(n.geom)).geom) as flowgeom,
probability,
n.name

from belgium.rawdata as s 
inner join
(
    select a.startid, a.source, a.agg_cost, a.geom, b.name,
    --select *,
    (
        (1/a.agg_cost)/(sum(1/b.agg_cost))
    ) as probability
    from belgium.matrixresult as a , belgium.matrixresult as b 
    where   a.source = b.source 
            --and a.startid <> b.startid
            and a.agg_cost <> 0
            and b.agg_cost <> 0
    group by a.startid, a.source, a.agg_cost, a.geom,  b.name
    order by a.source
) as n
on s.id = n.startid;

$BODY$;



```
#app functions:
```sql

CREATE OR REPLACE FUNCTION belgium.insert_rawdata(
	lng double precision,
	lat double precision,
	name character varying,
	dt integer)
    RETURNS void
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$

insert into belgium.rawdata(x,y,name,dt,geom)
values (lng, lat, name, dt,
		ST_SetSRID((ST_MakePoint(lng,lat)),4326))
		--ST_MakePoint(lng,lat))

$BODY$;


CREATE OR REPLACE FUNCTION belgium.deletebyid(
	id_ integer)
    RETURNS void
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
	delete from belgium.rawdata where id = id_;
	delete from belgium.cloudresult where startid = id_;
	delete from belgium.arearesult where startid = id_;
	delete from belgium.matrixresult where startid = id_;
	delete from belgium.gravitationresult where startid = id_;
	delete from belgium.gridresult where startid = id_;
$BODY$;

CREATE OR REPLACE FUNCTION belgium.update_rawdata(
	)
    RETURNS void
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$

update belgium.rawdata as rawtab
set pot = pot.sum
--select pot.sum
from belgium.rawdata as raw
inner join
	(
	SELECT g.startid,  sum(round(g.probability*z.anzahl::integer))
	--z.name_gebiet, round(g.probability*z.anzahl::integer) as potential, z.anzahl,
	FROM 		belgium."ZUL_BE" as z
	inner join 	belgium.gravitationresult as g on z.name_gebiet = g.name
	group by g.startid
	--, z.name_gebiet, z.anzahl, round(g.probability*z.anzahl::integer)
	) as pot on pot.STARTID	= raw.id
where pot.startid = rawtab.id;

$BODY$;


CREATE OR REPLACE FUNCTION belgium.updatehex_rawdata(
	)
    RETURNS void
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$

update belgium.rawdata as rawtab
set hexPot = pot.sum
--select pot.sum
from belgium.rawdata as raw
inner join
	(
	select startid, sum(sum) from belgium.reg_grid as reg
inner join belgium.gridresult as r on r.geom=reg.geom
group by startid
	) as pot on pot.STARTID	= raw.id
where pot.startid = rawtab.id;

$BODY$;

```
