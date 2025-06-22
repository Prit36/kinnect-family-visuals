import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Edit,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Star,
  Trash2,
} from "lucide-react";
import React, { memo } from "react";
import { Person, useFamilyTreeStore } from "../store/familyTreeStore";

interface PersonNodeProps {
  id: string;
  data: Person;
  selected?: boolean;
}

// Helper to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length === 1) return names[0].substring(0, 2);
  return names[0].charAt(0) + names[names.length - 1].charAt(0);
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

const ModernPersonNode: React.FC<PersonNodeProps> = memo(({ data, id, selected }) => {
  const { removePerson, setSelectedNode, selectedNodeId, darkMode } =
    useFamilyTreeStore();

  const isSelected = selectedNodeId === id;

  const handleNodeClick = () => {
    setSelectedNode(isSelected ? null : id);
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

  const InfoRow: React.FC<{
    icon: React.ReactNode;

    label: string | React.ReactNode;

    tooltip?: string;
  }> = ({ icon, label, tooltip }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-3">
          <div className="text-gray-400">{icon}</div>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
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
          animate={{ scale: isSelected ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "w-72 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md",
            "border-2",
            isSelected
              ? "border-sky-500"
              : "border-transparent group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50"
          )}
        >
          {/* --- Main Content --- */}
          <div className="p-4 flex flex-col items-center text-center">
            {/* --- Avatar --- */}
            <div className="relative mb-3">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full",
                  statusRingColor()
                )}
              />
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800"
                />
              ) : (
                <div
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white border-4 border-white dark:border-gray-800",

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
              {data.maritalStatus === "married" && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full p-1 shadow-md border-2 border-white dark:border-gray-800">
                  <Star size={12} className="text-white" />
                </div>
              )}
            </div>
            {/* --- Name & Lifespan --- */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {data.name}
            </h3>
            {data.nickname && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                "{data.nickname}"
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {getLifespan(data)}
            </p>
          </div>
          {/* --- Collapsible Details Section --- */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden border-t border-gray-200/80 dark:border-gray-700/80"
              >
                <div className="p-4 space-y-3">
                  {data.birthDate && (
                    <InfoRow
                      icon={<Calendar size={16} />}
                      label={new Date(data.birthDate).toLocaleDateString()}
                      tooltip={`Born on ${new Date(
                        data.birthDate
                      ).toLocaleDateString()}`}
                    />
                  )}
                  {data.birthPlace && (
                    <InfoRow
                      icon={<MapPin size={16} />}
                      label={data.birthPlace}
                      tooltip={`Birth Place: ${data.birthPlace}`}
                    />
                  )}
                  {data.occupation && (
                    <InfoRow
                      icon={<Briefcase size={16} />}
                      label={data.occupation}
                    />
                  )}
                  {data.maritalStatus && (
                    <InfoRow
                      icon={<Heart size={16} />}
                      label={
                        data.maritalStatus.charAt(0).toUpperCase() +
                        data.maritalStatus.slice(1)
                      }
                    />
                  )}
                  {data.phone && (
                    <InfoRow icon={<Phone size={16} />} label={data.phone} />
                  )}
                  {data.email && (
                    <InfoRow icon={<Mail size={16} />} label={data.email} />
                  )}
                  {data.website && (
                    <div className="flex items-center space-x-3">
                      <Globe
                        size={16}
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
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                        onClick={(e) => {
                          handleActionClick(e);
                          removePerson(id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove Person</p>
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
});

export default ModernPersonNode;
