type TaskDefinition = {
  title: string;
  description: string;
};

type StageDefinition = TaskDefinition[];

type DeliverableStages = {
  [key: string]: StageDefinition;
};

type DeliverableTypes = {
  paper: { [key: string]: StageDefinition };
  blog_post: { [key: string]: StageDefinition };
  funding_application: { [key: string]: StageDefinition };
  hackathon_project: { [key: string]: StageDefinition };
};

export const defaultPaperTasks: DeliverableTypes = {
  paper: {
    overview: [
      {
        title: "Review Literature",
        description: "Review existing literature in your field to understand current research and identify gaps.",
      },
      {
        title: "Define Research Question",
        description: "Clearly articulate your research question and objectives based on the literature review.",
      },
      {
        title: "Create Research Plan",
        description: "Develop a detailed plan outlining your research methodology, timeline, and required resources.",
      }
    ],
    research: [
      {
        title: "Gather Data",
        description: "Collect and organize all necessary data following your research methodology.",
      },
      {
        title: "Analyze Results",
        description: "Process and analyze the collected data using appropriate methods and tools.",
      },
      {
        title: "Document Methodology",
        description: "Write a detailed description of your research methods and procedures.",
      }
    ],
    writing: [
      {
        title: "Draft Introduction",
        description: "Write the introduction section including background, objectives, and significance of your research.",
      },
      {
        title: "Write Methods",
        description: "Document your methodology in detail, including procedures, materials, and analysis methods.",
      },
      {
        title: "Present Results",
        description: "Present your research findings using clear explanations, tables, and figures.",
      },
      {
        title: "Draft Discussion",
        description: "Interpret your results and discuss their implications in the context of existing literature.",
      }
    ],
    review: [
      {
        title: "Internal Review",
        description: "Conduct a thorough review of your paper for content, clarity, and coherence.",
      },
      {
        title: "Address Feedback",
        description: "Incorporate feedback from reviewers and make necessary revisions.",
      },
      {
        title: "Format Paper",
        description: "Ensure the paper follows all required formatting guidelines and citation styles.",
      }
    ],
    final: [
      {
        title: "Final Proofreading",
        description: "Complete final proofreading for grammar, spelling, and formatting consistency.",
      },
      {
        title: "Submit Paper",
        description: "Submit the final version of your paper to the intended destination.",
      },
      {
        title: "Archive Research Data",
        description: "Properly archive all research data and supporting materials.",
      }
    ]
  },
  blog_post: {
    planning: [
      {
        title: "Topic Research",
        description: "Research and define your blog post topic and target audience.",
      },
      {
        title: "Outline Creation",
        description: "Create a detailed outline of your blog post structure.",
      }
    ],
    writing: [
      {
        title: "Draft Content",
        description: "Write the initial draft of your blog post.",
      },
      {
        title: "Add Media",
        description: "Source and add relevant images, videos, or other media.",
      }
    ],
    review: [
      {
        title: "Edit Content",
        description: "Review and edit your content for clarity and engagement.",
      },
      {
        title: "SEO Optimization",
        description: "Optimize your post for search engines.",
      }
    ],
    publish: [
      {
        title: "Final Review",
        description: "Conduct final proofreading and formatting check.",
      },
      {
        title: "Publish Post",
        description: "Publish and promote your blog post.",
      }
    ]
  },
  funding_application: {
    preparation: [
      {
        title: "Requirements Review",
        description: "Review all funding requirements and eligibility criteria.",
      },
      {
        title: "Project Planning",
        description: "Develop detailed project plan and budget.",
      }
    ],
    writing: [
      {
        title: "Project Description",
        description: "Write comprehensive project description and objectives.",
      },
      {
        title: "Budget Documentation",
        description: "Prepare detailed budget and financial documentation.",
      }
    ],
    review: [
      {
        title: "Internal Review",
        description: "Review application for completeness and accuracy.",
      },
      {
        title: "External Review",
        description: "Get feedback from relevant stakeholders.",
      }
    ],
    submission: [
      {
        title: "Final Check",
        description: "Final review of all application components.",
      },
      {
        title: "Submit Application",
        description: "Submit application and required documentation.",
      }
    ]
  },
  hackathon_project: {
    ideation: [
      {
        title: "Problem Definition",
        description: "Define the problem you're solving and target users.",
      },
      {
        title: "Solution Planning",
        description: "Outline your proposed solution and technical approach.",
      }
    ],
    development: [
      {
        title: "MVP Development",
        description: "Build minimum viable product (MVP).",
      },
      {
        title: "Testing",
        description: "Test functionality and user experience.",
      }
    ],
    presentation: [
      {
        title: "Demo Preparation",
        description: "Prepare project demonstration and pitch.",
      },
      {
        title: "Documentation",
        description: "Create project documentation and submission materials.",
      }
    ],
    submission: [
      {
        title: "Final Testing",
        description: "Conduct final testing and bug fixes.",
      },
      {
        title: "Project Submission",
        description: "Submit project and required materials.",
      }
    ]
  }
};