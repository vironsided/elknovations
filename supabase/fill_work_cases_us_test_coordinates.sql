-- Fill all work_cases with test coordinates across U.S. mining regions.
-- Run in Supabase SQL Editor.

with coords as (
  select
    row_number() over () as idx,
    v.latitude::numeric(9, 6) as latitude,
    v.longitude::numeric(9, 6) as longitude,
    v.mine_name
  from (
    values
      (40.808400, -77.837100, 'Moshannon Valley Coal, PA'),
      (39.236300, -82.568800, 'Buckeye Coal Belt, OH'),
      (37.597400, -81.274700, 'Raleigh County Mines, WV'),
      (36.783200, -84.159100, 'Cumberland Plateau Mines, KY'),
      (37.148900, -87.121000, 'Western Kentucky Coalfield, KY'),
      (35.959300, -84.283700, 'Appalachian Ridge Mines, TN'),
      (34.886700, -87.638800, 'Shoals Mining Area, AL'),
      (33.398100, -87.550600, 'Tuscaloosa Mining District, AL'),
      (32.505100, -87.836400, 'Central Alabama Mineral Basin, AL'),
      (34.704400, -86.748300, 'Northern Alabama Industrial Quarry, AL'),
      (39.808300, -86.137900, 'Indiana Limestone Quarry Belt, IN'),
      (38.230700, -90.377000, 'Missouri Lead Belt, MO'),
      (37.161100, -93.295900, 'Ozark Mining District, MO'),
      (35.467600, -97.516400, 'Oklahoma Gypsum Mining Area, OK'),
      (34.746500, -92.289600, 'Arkansas Bauxite Region, AR'),
      (31.968600, -99.901800, 'Texas Lignite Basin, TX'),
      (32.351300, -101.512200, 'Permian Basin Potash Area, TX'),
      (35.084400, -106.650400, 'New Mexico Uranium Belt, NM'),
      (39.550100, -105.782100, 'Colorado Gold Belt, CO'),
      (38.833900, -104.821400, 'Pikes Peak Aggregate Mines, CO'),
      (43.615000, -116.202300, 'Idaho Silver Valley Region, ID'),
      (45.783300, -108.500700, 'Montana Coal & Bentonite Belt, MT'),
      (44.080500, -103.231000, 'Black Hills Mineral District, SD'),
      (41.140000, -104.820200, 'Wyoming Powder River Basin, WY'),
      (36.169900, -115.139800, 'Nevada Gold Trend, NV'),
      (38.581600, -121.494400, 'California Industrial Minerals, CA'),
      (47.606200, -122.332100, 'Washington Sand & Gravel Hub, WA'),
      (45.515200, -122.678400, 'Oregon Basalt Quarry Region, OR'),
      (44.058200, -121.315300, 'Central Oregon Pumice Field, OR'),
      (33.448400, -112.074000, 'Arizona Copper Belt, AZ')
  ) as v(latitude, longitude, mine_name)
),
ranked_cases as (
  select
    id,
    row_number() over (order by sort_order, created_at, id) as rn
  from work_cases
),
coord_count as (
  select count(*)::int as total from coords
),
case_coordinates as (
  select
    rc.id,
    c.latitude,
    c.longitude
  from ranked_cases rc
  cross join coord_count cc
  join coords c
    on c.idx = ((rc.rn - 1) % cc.total) + 1
)
update work_cases wc
set
  latitude = cc.latitude,
  longitude = cc.longitude
from case_coordinates cc
where wc.id = cc.id;
