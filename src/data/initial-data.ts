import { Column, Card } from "@/types";

export const initialColumns: Column[] = [
  {
    id: "1",
    name: "Neu",
    color: "#10B981" // Primary green
  },
  {
    id: "2",
    name: "To Do Kai",
    color: "#3B82F6" // Secondary blue
  },
  {
    id: "3",
    name: "Ideenpool",
    color: "#10B981" // Success green
  },
  {
    id: "4",
    name: "Ideen: Seiten",
    color: "#8B5CF6" // Accent purple
  }
];

export const initialCards: Card[] = [
  {
    id: "1",
    columnId: "1",
    title: "Set up React Router",
    description: "Configure basic routes for home, today, and archive pages",
    labels: ["React"],
    createdAt: new Date().toISOString(),
    attachmentCount: 2,
    commentCount: 3,
    attachments: [
      {
        id: "a1",
        name: "react-router-notes.md",
        type: "file",
        size: "42KB"
      },
      {
        id: "a2",
        name: "React Router Documentation",
        type: "link",
        url: "reactrouter.com"
      }
    ],
    comments: [
      {
        id: "c1",
        author: "John Doe",
        authorInitials: "JD",
        text: "Don't forget to install react-router-dom first!",
        createdAt: new Date().toISOString()
      },
      {
        id: "c2",
        author: "Guest User",
        authorInitials: "GH",
        text: "Already installed. Working on the routes configuration now.",
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "2",
    columnId: "1",
    title: "Hormes Medical Documentation",
    description: "Review and organize medical product documentation",
    labels: ["Documentation"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    attachmentCount: 1,
    commentCount: 0
  },
  {
    id: "3",
    columnId: "1",
    title: "Xubuntu Documentation PDF",
    description: "https://docs.xubuntu.org/1710/user/de/xubuntu-documentation-A4.pdf",
    labels: ["PDF"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
    attachmentCount: 0,
    commentCount: 0
  },
  {
    id: "4",
    columnId: "2",
    title: "Implement Drag and Drop",
    description: "Add drag and drop functionality between columns",
    labels: ["In Progress"],
    createdAt: new Date().toISOString(),
    attachmentCount: 0,
    commentCount: 0
  },
  {
    id: "5",
    columnId: "3",
    title: "Green Deal Hormes",
    description: "Sustainability initiative for Hormes Medical products",
    labels: ["Idea"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    attachmentCount: 0,
    commentCount: 5
  }
];
