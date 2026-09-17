export interface Project {
  id: number;
  index: string;
  title: string;
  category: string;
  date: string;
  image: string;
  tags: string[];
  accent: string;
}

export const projects: Project[] = [
  {
    id: 1,
    index: "01",
    title: "Nordhaven",
    category: "Branding",
    date: "2026",
    image: "/images/project-01.svg",
    tags: ["Branding", "Identity"],
    accent: "#d96a4a",
  },
  {
    id: 2,
    index: "02",
    title: "Aperture Studio",
    category: "UI Design",
    date: "2025",
    image: "/images/project-02.svg",
    tags: ["Product UI", "Design System"],
    accent: "#3f6b53",
  },
  {
    id: 3,
    index: "03",
    title: "Marrow",
    category: "Packaging",
    date: "2025",
    image: "/images/project-03.svg",
    tags: ["Packaging", "Print"],
    accent: "#c9a13b",
  },
  {
    id: 4,
    index: "04",
    title: "Loop Motion",
    category: "Motion",
    date: "2024",
    image: "/images/project-04.svg",
    tags: ["Motion", "Video"],
    accent: "#4a5fd9",
  },
  {
    id: 5,
    index: "05",
    title: "Synth & Co",
    category: "AI Creative",
    date: "2024",
    image: "/images/project-05.svg",
    tags: ["AI Creative", "Branding"],
    accent: "#8a4ad9",
  },
];
