import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  User,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Heart,
  Info,
  Edit,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyTreeStore, Person } from "../store/familyTreeStore";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PersonNodeProps {
  id: string;
  data: Person;
  selected?: boolean;
}

// Helper to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length === 1) return names?.[0]?.substring(0, 2) ?? "";
  return (
    (names?.[0]?.charAt(0) ?? "") + (names?.[names.length - 1]?.charAt(0) ?? "")
  );
};

// Helper for displaying the lifespan
const getLifespan = (person: Person) => {
  const birthYear = person.birthDate
    ? new Date(person.birthDate).getFullYear()
    : "?";
  if (!person.isAlive) {
    const deathYear = person.deathDate
      ? new Date(person.deathDate).getFullYear()
      : "?";
    return `${birthYear} - ${deathYear}`;
  }
  return `Born ${birthYear}`;
};

// A small component for consistently styled info rows
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string | React.ReactNode;
  tooltip?: string;
  capitalize?: boolean;
}> = ({ icon, label, tooltip, capitalize }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center space-x-3">
        <div className="text-gray-400">{icon}</div>
        <span
          className={cn(
            "text-sm text-gray-700 dark:text-gray-300 truncate",
            capitalize && "capitalize"
          )}
        >
          {label}
        </span>
      </div>
    </TooltipTrigger>
    {tooltip && (
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    )}
  </Tooltip>
);

const PersonNodeFullImage: React.FC<PersonNodeProps> = memo(
  ({ data, id, selected }) => {
    const { removePerson, setSelectedNode, selectedNodeId, darkMode } =
      useFamilyTreeStore();

    const handleNodeClick = () => {
      setSelectedNode(selected ? null : id);
    };

    const handleActionClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const statusRingColor = () => {
      if (!data.isAlive) return "border-gray-500";
      switch (data.gender) {
        case "male":
          return "border-blue-500";
        case "female":
          return "border-pink-500";
        default:
          return "border-purple-500";
      }
    };

    return (
      <TooltipProvider delayDuration={300}>
        <div className="relative group" onClick={handleNodeClick}>
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-transparent !w-4 !h-4 !border-2 !border-gray-400/50 hover:!border-sky-500 !transition-colors !duration-300"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-transparent !w-4 !h-4 !border-2 !border-gray-400/50 hover:!border-sky-500 !transition-colors !duration-300"
          />
          <motion.div
            animate={{ scale: selected ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-72 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
              "bg-white dark:bg-gray-800",
              "border-2",
              selected
                ? "border-sky-500"
                : "border-transparent group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50"
            )}
          >
            {/* --- Top Section with Image and Name --- */}
            <div className="relative">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-auto object-cover rounded-t-2xl"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-28 flex items-center justify-center font-bold text-4xl text-white rounded-t-2xl",
                    !data.isAlive
                      ? "bg-gray-500"
                      : data.gender === "male"
                      ? "bg-blue-500"
                      : data.gender === "female"
                      ? "bg-pink-500"
                      : "bg-purple-500"
                  )}
                >
                  {getInitials(data.name)}
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 w-full p-2 rounded-b-2xl text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0))",
                }}
              >
                <h3 className="font-bold text-xl text-center leading-snug">
                  {data.name}
                </h3>
                <p className="text-sm text-center text-gray-300">
                  {getLifespan(data)}
                </p>
              </div>
            </div>
            {/* --- Collapsible Details Section --- */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-200/80 dark:border-gray-700/80"
                >
                  <div className="p-4 space-y-2">
                    {data.birthDate && (
                      <InfoRow
                        icon={<Calendar size={14} />}
                        label={new Date(data.birthDate).toLocaleDateString()}
                        tooltip={`Born on ${new Date(
                          data.birthDate
                        ).toLocaleDateString()}`}
                      />
                    )}
                    {data.birthPlace && (
                      <InfoRow
                        icon={<MapPin size={14} />}
                        label={data.birthPlace}
                        tooltip={`Birth Place: ${data.birthPlace}`}
                      />
                    )}
                    {data.occupation && (
                      <InfoRow
                        icon={<Briefcase size={14} />}
                        label={data.occupation}
                      />
                    )}
                    {data.maritalStatus && (
                      <InfoRow
                        icon={<Heart size={14} />}
                        label={data.maritalStatus}
                        capitalize
                      />
                    )}
                    {data.phone && (
                      <InfoRow icon={<Phone size={14} />} label={data.phone} />
                    )}
                    {data.email && (
                      <InfoRow icon={<Mail size={14} />} label={data.email} />
                    )}
                    {data.website && (
                      <div className="flex items-center space-x-3">
                        <Globe
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <a
                          href={data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-sky-600 dark:text-sky-400 hover:underline truncate"
                          onClick={handleActionClick}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    {data.biography && (
                      <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-left leading-relaxed">
                          {data.biography}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* --- Action Buttons --- */}
                  <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={handleActionClick}
                        >
                          <Edit size={14} className="text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Person</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0  text-red-500 hover:text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            handleActionClick(e);
                            removePerson(id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>RemovePerson</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </TooltipProvider>
    );
  }
);

export default PersonNodeFullImage;
