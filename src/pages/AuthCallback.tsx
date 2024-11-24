import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
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

        navigate('/');
      } else {
        navigate('/login');
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