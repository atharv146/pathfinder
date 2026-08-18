import type { GuideVisualData } from "@/components/guide/GuideVisual";
import roadmapJson from "./roadmap.json";

export type RoadmapItem = {
  id: string;
  category: string;
  title: string;
  sections: {
    heading?: string;
    paragraphs: string[];
    /** Same visual system the guide articles use. See GuideVisual. */
    visual?: GuideVisualData;
  }[];
};

export type RoadmapData = Record<string, RoadmapItem[]>;

export const roadmapData = roadmapJson as RoadmapData;

export const gradeGroups = [
  { label: "Middle School", grades: [6, 7, 8] },
  { label: "High School", grades: [9, 10, 11, 12] },
];

export function getRoadmapItems(grade: number): RoadmapItem[] {
  return roadmapData[String(grade)] ?? [];
}
