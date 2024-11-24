import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { TaskList } from "@/components/TaskList";
import { UpdatesFeed } from "@/components/UpdatesFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Task, WeeklyUpdate } from "@/types";

// Temporary mock data until Supabase integration
const mockUser: User = {
  id: "1",
  name: "John Doe",
  role: "researcher",
  avatarUrl: "https://github.com/shadcn.png"
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Literature Review",
    description: "Review and summarize key papers in the field",
    completed: false,
    requiredRole: "student"
  },
  {
    id: "2",
    title: "Methodology Design",
    description: "Design research methodology and approach",
    completed: false,
    requiredRole: "researcher"
  },
  {
    id: "3",
    title: "Final Review",
    description: "Review and approve final paper draft",
    completed: false,
    requiredRole: "advisor"
  }
];

const mockUpdates: WeeklyUpdate[] = [
  {
    id: "1",
    userId: "1",
    content: "Completed initial literature review of 20 papers",
    createdAt: new Date().toISOString(),
    ratings: []
  }
];

const Index = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [updates, setUpdates] = useState(mockUpdates);

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handlePostUpdate = (content: string) => {
    const newUpdate: WeeklyUpdate = {
      id: Date.now().toString(),
      userId: mockUser.id,
      content,
      createdAt: new Date().toISOString(),
      ratings: []
    };
    setUpdates([newUpdate, ...updates]);
  };

  const handleRateUpdate = (updateId: string, rating: number) => {
    setUpdates(updates.map(update => {
      if (update.id === updateId) {
        const existingRating = update.ratings.findIndex(r => r.userId === mockUser.id);
        const newRatings = [...update.ratings];
        
        if (existingRating >= 0) {
          newRatings[existingRating] = { userId: mockUser.id, value: rating };
        } else {
          newRatings.push({ userId: mockUser.id, value: rating });
        }
        
        return { ...update, ratings: newRatings };
      }
      return update;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Dashboard user={mockUser} tasks={tasks} updates={updates} />
      
      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <TaskList
              tasks={tasks}
              userRole={mockUser.role}
              onTaskComplete={handleTaskComplete}
            />
          </TabsContent>
          
          <TabsContent value="updates">
            <UpdatesFeed
              updates={updates}
              currentUser={mockUser}
              onPostUpdate={handlePostUpdate}
              onRateUpdate={handleRateUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;