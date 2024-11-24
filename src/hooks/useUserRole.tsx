import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useUserRole(userId?: string) {
  return useQuery({
    queryKey: ['userRole', userId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No user session');

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            name
          )
        `)
        .eq('user_id', userId || session.user.id)
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