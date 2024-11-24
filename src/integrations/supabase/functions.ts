export const handleNewUser = `
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    newcomer_role_id INTEGER;
    discord_name TEXT;
BEGIN
    -- Get Discord username from raw_user_meta_data
    discord_name := new.raw_user_meta_data->>'full_name';
    
    -- If no Discord name is found, use email
    IF discord_name IS NULL THEN
        discord_name := new.email;
    END IF;

    -- Insert into profiles with Discord information
    INSERT INTO public.profiles (id, full_name, username)
    VALUES (
        new.id,
        discord_name,
        new.raw_user_meta_data->>'preferred_username'
    );
    
    -- Get Newcomer role ID
    SELECT id INTO newcomer_role_id
    FROM roles
    WHERE name = 'Newcomer';
    
    -- Assign Newcomer role
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (new.id, newcomer_role_id);
    
    RETURN new;
END;
$$;
`;