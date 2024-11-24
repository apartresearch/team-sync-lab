import { useState } from "react";
import { Link } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import { TaskList } from "@/components/TaskList";
import { UpdatesFeed } from "@/components/UpdatesFeed";
import { PaperManagement } from "@/components/PaperManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Task, WeeklyUpdate, Stage } from "@/types";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  role: "researcher",
  avatarUrl: "https://github.com/shadcn.png"
};

const mockStages: Stage[] = [
  {
    id: "1",
    name: "Stage 1: Research Foundation",
    description: "Establish research groundwork",
    status: "in_progress",
    tasks: ["1", "2", "3"]
  },
  {
    id: "2",
    name: "Stage 2: Data Collection",
    description: "Gather and analyze research data",
    status: "not_started",
    tasks: ["4", "5"]
  },
  {
    id: "3",
    name: "Stage 3: Paper Development",
    description: "Write and refine research paper",
    status: "not_started",
    tasks: ["6", "7"]
  }
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Literature Review",
    description: "Review and summarize key papers in the field",
    completed: false,
    requiredRole: "student",
    stageId: "1"
  },
  {
    id: "2",
    title: "Methodology Design",
    description: "Design research methodology and approach",
    completed: false,
    requiredRole: "researcher",
    stageId: "1"
  },
  {
    id: "3",
    title: "Grant Application",
    description: "Submit research grant application",
    completed: false,
    requiredRole: "advisor",
    stageId: "1"
  },
  {
    id: "4",
    title: "Data Collection Plan",
    description: "Create detailed data collection strategy",
    completed: false,
    requiredRole: "researcher",
    stageId: "2"
  },
  {
    id: "5",
    title: "Initial Analysis",
    description: "Perform preliminary data analysis",
    completed: false,
    requiredRole: "researcher",
    stageId: "2"
  },
  {
    id: "6",
    title: "Draft Paper",
    description: "Write initial paper draft",
    completed: false,
    requiredRole: "researcher",
    stageId: "3"
  },
  {
    id: "7",
    title: "Final Review",
    description: "Review and approve final paper draft",
    completed: false,
    requiredRole: "advisor",
    stageId: "3"
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
  const [stages, setStages] = useState(mockStages);
  const [updates, setUpdates] = useState(mockUpdates);

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
      <Dashboard 
        user={mockUser} 
        stages={stages} 
        tasks={tasks} 
        updates={updates} 
        headerActions={
          <Link to="/profile">
            <Button variant="outline" className="ml-4">
              View Profile
            </Button>
          </Link>
        } 
      />
      
      <div className="max-w-7xl mx-auto p-8">
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
