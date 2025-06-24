/**
 * Person form component for adding/editing family members
 */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Heart,
  Users,
  Info,
  Contact,
} from "lucide-react";
import { ImageUpload } from "../molecules/ImageUpload";
import { useFamilyTreeStore } from "../../stores/familyTreeStore";
import {
  personSchema,
  type PersonFormSchema,
} from "../../schemas/personSchema";
import type { PersonFormData, RelationshipType } from "../../types";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  RELATIONSHIP_TYPE_OPTIONS,
} from "../../constants";

interface PersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<PersonFormData>;
  mode?: "add" | "edit";
}

export const PersonForm: React.FC<PersonFormProps> = ({
  isOpen,
  onClose,
  initialData,
  mode = "add",
}) => {
  const { people, addPerson, updatePerson } = useFamilyTreeStore();

  const form = useForm<PersonFormSchema>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: initialData?.name || "",
      nickname: initialData?.nickname || "",
      gender: initialData?.gender || "male",
      birthDate: initialData?.birthDate || "",
      deathDate: initialData?.deathDate || "",
      birthPlace: initialData?.birthPlace || "",
      occupation: initialData?.occupation || "",
      maritalStatus: initialData?.maritalStatus,
      isAlive: initialData?.isAlive !== undefined ? initialData.isAlive : true,
      image: initialData?.image || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      website: initialData?.website || "",
      biography: initialData?.biography || "",
      selectedPerson: initialData?.selectedPerson || "",
      relationshipType: initialData?.relationshipType,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
    reset,
  } = form;

  const watchedIsAlive = watch("isAlive");
  const watchedSelectedPerson = watch("selectedPerson");

  const onSubmit = async (data: PersonFormSchema) => {
    if (mode === "add") {
      const relationshipData =
        data.selectedPerson && data.relationshipType
          ? { personId: data.selectedPerson, type: data.relationshipType }
          : undefined;

      const personId = addPerson(data);

      if (relationshipData) {
        useFamilyTreeStore
          .getState()
          .addRelationship(
            relationshipData.personId,
            personId,
            relationshipData.type
          );
      }
    } else if (initialData?.id) {
      updatePerson(initialData.id, data);
    }

    onClose();
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] flex flex-col gap-0 p-0">
        <DialogHeader className="p-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            {mode === "add" ? "Add New Family Member" : "Edit Family Member"}
          </DialogTitle>
          <DialogDescription>
            The header and photo will remain fixed as you scroll.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto">
          <Form {...form}>
            {/* 1. Added id="person-form" to the form element */}
            <form
              id="person-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
            >
              {/* --- Left Sticky Column: Image Upload --- */}
              <div className="md:col-span-1 space-y-4 self-start sticky top-6">
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Profile Photo
                      </FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Right Scrollable Column: Form Fields --- */}
              <div className="md:col-span-2 space-y-6">
                {/* --- Basic Information Section --- */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nickname</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Johnny" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDER_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* --- Personal Details Section --- */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Personal Details
                  </h3>
                  <FormField
                    control={control}
                    name="isAlive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel className="font-normal">
                          Is this person currently living?
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!watchedIsAlive && (
                      <FormField
                        control={control}
                        name="deathDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Death</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              className="pl-10"
                              placeholder="City, Country"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              className="pl-10"
                              placeholder="e.g., Software Engineer"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share some life stories, achievements, or memories."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- Contact Information Section --- */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Contact className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                className="pl-10"
                                placeholder="+1 (555) 123-4567"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="email"
                                className="pl-10"
                                placeholder="email@example.com"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              className="pl-10"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- Relationship Section --- */}
                {mode === "add" && people.length > 0 && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Relationships
                    </h3>
                    <FormField
                      control={control}
                      name="selectedPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Connect to existing person</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a relative to connect to" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {people.map((person) => (
                                <SelectItem key={person.id} value={person.id}>
                                  {person.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {watchedSelectedPerson && (
                      <FormField
                        control={control}
                        name="relationshipType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How are they related?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {/* 2. Linked this button to the form using the `form` attribute */}
          <Button type="submit" form="person-form" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "add"
              ? "Add Person"
              : "Update Person"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
