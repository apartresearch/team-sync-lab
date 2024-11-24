import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle hash fragment if present (for implicit grant)
        if (window.location.hash) {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
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

            // Redirect to home page
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