-- Create a function to get public water reports with lat/lng extracted
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_public_water_reports()
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    ph_level float,
    turbidity float,
    dissolved_oxygen float,
    conductivity float,
    bacteria_load float,
    metal_concentration float,
    calculated_tier int,
    notes text,
    lat double precision,
    lng double precision
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        id,
        created_at,
        ph_level,
        turbidity,
        dissolved_oxygen,
        conductivity,
        bacteria_load,
        metal_concentration,
        calculated_tier,
        notes,
        ST_Y(location::geometry) as lat,
        ST_X(location::geometry) as lng
    FROM water_reports
    WHERE is_public = true
    AND location IS NOT NULL
    ORDER BY created_at DESC;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_public_water_reports() TO authenticated;
GRANT EXECUTE ON FUNCTION get_public_water_reports() TO anon;
