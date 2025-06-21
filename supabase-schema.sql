-- Create user_locations table
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_locations
CREATE POLICY "Users can view their own locations"
    ON user_locations FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own locations"
    ON user_locations FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own locations"
    ON user_locations FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own locations"
    ON user_locations FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS user_locations_user_id_idx ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS user_locations_is_default_idx ON user_locations(is_default);

-- Function to ensure only one default location per user
CREATE OR REPLACE FUNCTION ensure_single_default_location()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this location as default, unset all other defaults for this user
    IF NEW.is_default = TRUE THEN
        UPDATE user_locations 
        SET is_default = FALSE 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the function
DROP TRIGGER IF EXISTS trigger_ensure_single_default_location ON user_locations;
CREATE TRIGGER trigger_ensure_single_default_location
    BEFORE INSERT OR UPDATE ON user_locations
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_location();