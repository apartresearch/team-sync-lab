import { User, Task, WeeklyUpdate, Stage } from "@/types";

export const mockUser: User = {
  id: "00000000-0000-0000-0000-000000000000", // Using a valid UUID format
  name: "John Doe",
  role: "researcher",
  avatarUrl: "https://github.com/shadcn.png"
};

export const mockStages: Stage[] = [
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

export const mockTasks: Task[] = [
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

export const mockUpdates: WeeklyUpdate[] = [
  {
    id: "1",
    userId: mockUser.id,
    content: "Completed initial literature review of 20 papers",
    createdAt: new Date().toISOString(),
    ratings: []
  }
];