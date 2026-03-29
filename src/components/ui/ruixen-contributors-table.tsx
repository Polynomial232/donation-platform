"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Contributor = {
  name: string;
  email: string;
  avatar: string;
  role: string;
};

type Project = {
  id: string;
  title: string;
  repo: string;
  status: "Active" | "Inactive" | "In Progress";
  team: string;
  tech: string;
  createdAt: string;
  contributors: Contributor[];
};

const data: Project[] = [
  {
    id: "1",
    title: "ShadCN Clone",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "UI Guild",
    tech: "Next.js",
    createdAt: "2024-06-01",
    contributors: [
      {
        name: "Srinath G",
        email: "srinath@example.com",
        avatar: "https://github.com/srinath.png",
        role: "UI Lead",
      },
      {
        name: "Kavya M",
        email: "kavya@example.com",
        avatar: "https://github.com/kavya.png",
        role: "Designer",
      },
    ],
  },
  {
    id: "2",
    title: "RUIXEN Components",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "In Progress",
    team: "Component Devs",
    tech: "React",
    createdAt: "2024-05-22",
    contributors: [
      {
        name: "Arjun R",
        email: "arjun@example.com",
        avatar: "https://github.com/arjun.png",
        role: "Developer",
      },
      {
        name: "Divya S",
        email: "divya@example.com",
        avatar: "https://github.com/divya.png",
        role: "QA",
      },
      {
        name: "Nikhil V",
        email: "nikhil@example.com",
        avatar: "https://github.com/nikhil.png",
        role: "UX",
      },
    ],
  },
  {
    id: "3",
    title: "CV Jobs Platform",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "CV Core",
    tech: "Spring Boot",
    createdAt: "2024-06-05",
    contributors: [
      {
        name: "Manoj T",
        email: "manoj@example.com",
        avatar: "https://github.com/manoj.png",
        role: "Backend Lead",
      },
    ],
  },
  {
    id: "4",
    title: "Ruixen UI Docs",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Tech Writers",
    tech: "Markdown + Docusaurus",
    createdAt: "2024-04-19",
    contributors: [
      {
        name: "Sneha R",
        email: "sneha@example.com",
        avatar: "https://github.com/sneha.png",
        role: "Documentation",
      },
      {
        name: "Vinay K",
        email: "vinay@example.com",
        avatar: "https://github.com/vinay.png",
        role: "Maintainer",
      },
    ],
  },
  {
    id: "5",
    title: "Job Portal Analytics",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Data Squad",
    tech: "Python",
    createdAt: "2024-03-30",
    contributors: [
      {
        name: "Aarav N",
        email: "aarav@example.com",
        avatar: "https://github.com/aarav.png",
        role: "Data Engineer",
      },
    ],
  },
  {
    id: "6",
    title: "Real-time Chat",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Infra",
    tech: "Socket.io",
    createdAt: "2024-06-03",
    contributors: [
      {
        name: "Neha L",
        email: "neha@example.com",
        avatar: "https://github.com/neha.png",
        role: "DevOps",
      },
      {
        name: "Raghav I",
        email: "raghav@example.com",
        avatar: "https://github.com/raghav.png",
        role: "NodeJS Engineer",
      },
    ],
  },
  {
    id: "7",
    title: "RUX Theme Builder",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Design Systems",
    tech: "Tailwind CSS",
    createdAt: "2024-05-10",
    contributors: [
      {
        name: "Ishita D",
        email: "ishita@example.com",
        avatar: "https://github.com/ishita.png",
        role: "Design Engineer",
      },
    ],
  },
  {
    id: "8",
    title: "Admin Dashboard",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Dashboard Core",
    tech: "Remix",
    createdAt: "2024-05-28",
    contributors: [
      {
        name: "Rahul B",
        email: "rahul@example.com",
        avatar: "https://github.com/rahul.png",
        role: "Fullstack",
      },
    ],
  },
  {
    id: "9",
    title: "OpenCV Blog Engine",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Platform",
    tech: "Node.js",
    createdAt: "2024-01-18",
    contributors: [
      {
        name: "Sanya A",
        email: "sanya@example.com",
        avatar: "https://github.com/sanya.png",
        role: "API Developer",
      },
      {
        name: "Harshit V",
        email: "harshit@example.com",
        avatar: "https://github.com/harshit.png",
        role: "Platform Architect",
      },
    ],
  },
  {
    id: "10",
    title: "Dark Mode Toggle Package",
    repo: "https://github.com/ruixenui/ruixen-buttons",
    status: "Active",
    team: "Component Devs",
    tech: "TypeScript",
    createdAt: "2024-06-02",
    contributors: [
      {
        name: "Meera C",
        email: "meera@example.com",
        avatar: "https://github.com/meera.png",
        role: "Package Maintainer",
      },
    ],
  },
];

const allColumns = [
  "Project",
  "Repository",
  "Team",
  "Tech",
  "Created At",
  "Contributors",
  "Status",
] as const;

function ContributorsTable() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [statusFilter, setStatusFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");

  const filteredData = data.filter((project) => {
    return (
      (!statusFilter || project.status === statusFilter) &&
      (!techFilter || project.tech.toLowerCase().includes(techFilter.toLowerCase()))
    );
  });

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="w-full space-y-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm overflow-x-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Filter by technology..."
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="w-48 rounded-xl border-slate-100 h-10"
          />
          <Input
            placeholder="Filter by status..."
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 rounded-xl border-slate-100 h-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl border-slate-100 px-4 h-10">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-xl bg-white">
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={visibleColumns.includes(col)}
                onCheckedChange={() => toggleColumn(col)}
                className="rounded-lg"
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            {visibleColumns.includes("Project") && (
              <TableHead className="w-[180px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Project
              </TableHead>
            )}
            {visibleColumns.includes("Repository") && (
              <TableHead className="w-[220px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Repository
              </TableHead>
            )}
            {visibleColumns.includes("Team") && (
              <TableHead className="w-[150px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Team
              </TableHead>
            )}
            {visibleColumns.includes("Tech") && (
              <TableHead className="w-[150px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Tech
              </TableHead>
            )}
            {visibleColumns.includes("Created At") && (
              <TableHead className="w-[120px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Created At
              </TableHead>
            )}
            {visibleColumns.includes("Contributors") && (
              <TableHead className="w-[150px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Contributors
              </TableHead>
            )}
            {visibleColumns.includes("Status") && (
              <TableHead className="w-[100px] font-bold text-slate-500 uppercase text-[11px] tracking-wider">
                Status
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length ? (
            filteredData.map((project) => (
              <TableRow
                key={project.id}
                className="hover:bg-slate-50 transition-colors border-slate-50"
              >
                {visibleColumns.includes("Project") && (
                  <TableCell className="font-bold whitespace-nowrap text-slate-900">
                    {project.title}
                  </TableCell>
                )}
                {visibleColumns.includes("Repository") && (
                  <TableCell className="whitespace-nowrap">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--color-deep-purple) hover:underline font-medium"
                    >
                      {project.repo.replace("https://", "")}
                    </a>
                  </TableCell>
                )}
                {visibleColumns.includes("Team") && (
                  <TableCell className="whitespace-nowrap text-slate-600 font-medium">
                    {project.team}
                  </TableCell>
                )}
                {visibleColumns.includes("Tech") && (
                  <TableCell className="whitespace-nowrap font-medium text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-500">
                      {project.tech}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes("Created At") && (
                  <TableCell className="whitespace-nowrap text-slate-400 font-medium">
                    {project.createdAt}
                  </TableCell>
                )}
                {visibleColumns.includes("Contributors") && (
                  <TableCell className="min-w-[120px]">
                    <div className="flex -space-x-1">
                      <TooltipProvider>
                        {project.contributors.map((contributor, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 ring-2 ring-white hover:z-10 transition-transform hover:scale-110">
                                <AvatarImage src={contributor.avatar} alt={contributor.name} />
                                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm rounded-xl p-3 border-slate-100 shadow-xl bg-white!">
                              <p className="font-bold text-slate-900">{contributor.name}</p>
                              <p className="text-xs text-slate-500">{contributor.email}</p>
                              <p className="text-[10px] uppercase tracking-wider font-black text-(--color-deep-purple) mt-1">
                                {contributor.role}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("Status") && (
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      className={cn(
                        "whitespace-nowrap rounded-lg px-2 py-0.5 text-[10px] font-bold border-none",
                        project.status === "Active" && "bg-green-100 text-green-700",
                        project.status === "Inactive" && "bg-slate-100 text-slate-500",
                        project.status === "In Progress" && "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="text-center py-8 text-slate-400 font-medium italic"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ContributorsTable;
