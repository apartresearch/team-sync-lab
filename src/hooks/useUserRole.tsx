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
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Error fetching user role:', error);
        return 'student';
      }

      if (!data || data.length === 0) return 'student';

      // Define role priorities (higher number = higher priority)
      const rolePriorities: { [key: string]: number } = {
        advisor: 3,
        researcher: 2,
        student: 1
      };

      // Get the highest priority role
      const highestPriorityRole = data.reduce((highest, current) => {
        const currentRoleName = current.roles?.name || 'student';
        const highestRoleName = highest.roles?.name || 'student';
        
        return rolePriorities[currentRoleName] > rolePriorities[highestRoleName] 
          ? current 
          : highest;
      }, data[0]);

      return highestPriorityRole.roles?.name || 'student';
    },
    enabled: !!currentUserId,
  });
}