import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";

export function useUserRole(userId?: string) {
  const session = useSession();
  const currentUserId = userId || session?.user?.id;

  return useQuery({
    queryKey: ['userRole', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return 'student';

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            name
          )
        `)
        .eq('user_id', currentUserId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'student';
      }
      
      return data?.roles?.name || 'student';
    },
    enabled: !!currentUserId,
  });
}