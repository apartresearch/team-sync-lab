import { Link } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import { DashboardContent } from "@/components/DashboardContent";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useSession } from "@supabase/auth-helpers-react";
import { mockUser, mockStages, mockTasks, mockUpdates } from "@/data/mockData";

const Index = () => {
  const { isLoading } = useRequireAuth();
  const supabaseSession = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currentUser = {
    ...mockUser,
    id: supabaseSession?.user?.id || mockUser.id,
  };

  return (
    <div className="min-h-screen bg-background">
      <Dashboard 
        user={currentUser}
        stages={mockStages} 
        tasks={mockTasks} 
        updates={mockUpdates} 
        headerActions={
          <Link to="/profile">
            <Button variant="outline" className="ml-4">
              View Profile
            </Button>
          </Link>
        } 
      />
      
      <div className="max-w-7xl mx-auto p-8">
        <DashboardContent
          currentUser={currentUser}
          initialTasks={mockTasks}
          initialStages={mockStages}
          initialUpdates={mockUpdates}
        />
      </div>
    </div>
  );
};

export default Index;