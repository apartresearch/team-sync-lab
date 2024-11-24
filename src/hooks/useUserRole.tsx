import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useUserRole(userId?: string) {
  return useQuery({
    queryKey: ['userRole', userId],
    queryFn: async () => {
      // Get current session if no userId provided
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No user session');

      // Use provided userId or fallback to current user's id
      const targetUserId = userId || session.user.id;

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            name
          )
        `)
        .eq('user_id', targetUserId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'No Role';
      }
      
      return data?.roles?.name || 'No Role';
    },
    enabled: !!userId || !!(supabase.auth.getSession()),
  });
}