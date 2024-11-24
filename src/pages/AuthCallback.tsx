import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session using the tokens from the URL
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) throw sessionError;

          if (session) {
            // Insert the user role if it doesn't exist
            const { error: roleError } = await supabase
              .from('user_roles')
              .upsert(
                { 
                  user_id: session.user.id,
                  role: 'researcher' 
                },
                { 
                  onConflict: 'user_id',
                  ignoreDuplicates: true 
                }
              );

            if (roleError) {
              console.error('Error setting user role:', roleError);
            }

            // Clear the URL hash and redirect to home page
            window.location.hash = '';
            navigate('/', { replace: true });
            return;
          }
        }

        // Handle code exchange (for authorization code flow)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (session) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-muted-foreground">
        Completing authentication...
      </div>
    </div>
  );
}