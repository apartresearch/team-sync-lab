import { useState } from "react";
import { User, Task, WeeklyUpdate, Stage } from "@/types";
import { UpdatesFeed } from "@/components/UpdatesFeed";
import { PaperManagement } from "@/components/PaperManagement";
import { TaskList } from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardContentProps {
  currentUser: User;
  initialTasks: Task[];
  initialStages: Stage[];
  initialUpdates: WeeklyUpdate[];
}

export function DashboardContent({ 
  currentUser, 
  initialTasks, 
  initialStages, 
  initialUpdates 
}: DashboardContentProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [stages, setStages] = useState(initialStages);
  const [updates, setUpdates] = useState(initialUpdates);

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleRequestReview = (stageId: string) => {
    setStages(stages.map(stage =>
      stage.id === stageId
        ? { ...stage, status: 'pending_review' }
        : stage
    ));
  };

  const handlePostUpdate = (content: string) => {
    const newUpdate: WeeklyUpdate = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      ratings: []
    };
    setUpdates([newUpdate, ...updates]);
  };

  const handleRateUpdate = (updateId: string, rating: number) => {
    setUpdates(updates.map(update => {
      if (update.id === updateId) {
        const existingRating = update.ratings.findIndex(r => r.userId === currentUser.id);
        const newRatings = [...update.ratings];
        
        if (existingRating >= 0) {
          newRatings[existingRating] = { userId: currentUser.id, value: rating };
        } else {
          newRatings.push({ userId: currentUser.id, value: rating });
        }
        
        return { ...update, ratings: newRatings };
      }
      return update;
    }));
  };

  return (
    <Tabs defaultValue="papers" className="space-y-6">
      <TabsList>
        <TabsTrigger value="papers">Papers</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="updates">Updates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="papers">
        <PaperManagement />
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList
          tasks={tasks}
          stages={stages}
          onTaskComplete={handleTaskComplete}
          onRequestReview={handleRequestReview}
        />
      </TabsContent>
      
      <TabsContent value="updates">
        <UpdatesFeed
          updates={updates}
          currentUser={currentUser}
          onPostUpdate={handlePostUpdate}
          onRateUpdate={handleRateUpdate}
        />
      </TabsContent>
    </Tabs>
  );
}