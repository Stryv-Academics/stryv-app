"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Tutor } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  User as UserIcon,
  MapPin,
  Book,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";

const SUBJECT_OPTIONS = [
  { value: "Math", label: "Math" },
  { value: "Science", label: "Science" },
  { value: "History", label: "History" },
  { value: "English", label: "English" },
  { value: "Computer Science", label: "Computer Science" },
];

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField = ({ label, children }: FormFieldProps) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  height = "h-32",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  height?: string;
}) => (
  <textarea
    value={value}
    onChange={onChange}
    className={`w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${height}`}
    placeholder={placeholder}
  />
);

const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder={placeholder}
  />
);

const ProfilePreview = ({
  subjects,
  bio,
  qualifications,
  tutoring_approach,
  tutoring_experience,
  current_education,
  location,
}: {
  subjects: string[];
  bio: string;
  qualifications: string;
  tutoring_approach: string;
  tutoring_experience: string;
  current_education: string;
  location: string;
}) => (
  <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4">
      <div className="flex items-center space-x-4">
        <div className="bg-white p-2 rounded-full">
          <UserIcon size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Profile Preview</h3>
          <p className="text-sm text-blue-100">How students see your profile</p>
        </div>
      </div>
    </div>

    <CardContent className="p-4">
      {location && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Book size={16} />
            <span>Subjects</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {bio && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <UserIcon size={16} />
            <span>About Me</span>
          </div>
          <p className="text-gray-600 text-sm">{bio}</p>
        </div>
      )}

      {(qualifications || current_education) && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <GraduationCap size={16} />
            <span>Education</span>
          </div>
          <div className="text-sm">
            {current_education && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Current: </span>
                {current_education}
              </p>
            )}
            {qualifications && (
              <p className="text-gray-600">
                <span className="font-medium">Qualifications: </span>
                {qualifications}
              </p>
            )}
          </div>
        </div>
      )}

      {tutoring_approach && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Users size={16} />
            <span>Teaching Style</span>
          </div>
          <p className="text-gray-600 text-sm">{tutoring_approach}</p>
        </div>
      )}

      {tutoring_experience && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Clock size={16} />
            <span>Experience</span>
          </div>
          <p className="text-gray-600 text-sm">{tutoring_experience}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function ProfileForm({
  user,
  tutorData,
}: {
  user: User;
  tutorData: Tutor;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>(
    tutorData.subjects?.filter((subject) =>
      SUBJECT_OPTIONS.some((option) => option.value === subject)
    ) || []
  );
  const [bio, setBio] = useState<string>(tutorData.bio || "");
  const [qualifications, setQualifications] = useState<string>(
    tutorData.qualifications || ""
  );
  const [tutoring_approach, setTutorApproach] = useState<string>(
    tutorData.tutoring_approach || ""
  );
  const [tutoring_experience, setTutorExperience] = useState<string>(
    tutorData.tutoring_experience || ""
  );
  const [current_education, setCurrentEducation] = useState<string>(
    tutorData.current_education || ""
  );
  const [location, setLocation] = useState<string>(tutorData.location || "");

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  async function updateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase.from("tutors").upsert({
        id: user?.id,
        subjects,
        bio,
        qualifications,
        tutoring_approach,
        tutoring_experience,
        current_education,
        location,
      });

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      alert(
        `Error updating profile: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Edit Profile
          </h2>
          <p className="text-gray-600">
            Share your expertise and experience with students
          </p>
        </div>

        <div className="space-y-4">
          <FormField label="Subjects">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left justify-between"
                >
                  <span className="truncate">
                    {subjects.length > 0
                      ? `Selected: ${subjects.length} subject${
                          subjects.length === 1 ? "" : "s"
                        }`
                      : "Select subjects..."}
                  </span>
                  <span className="ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {SUBJECT_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={subjects.includes(option.value)}
                    onCheckedChange={() => toggleSubject(option.value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map((subject) => (
                <span
                  key={subject}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </FormField>

          <FormField label="Bio">
            <TextArea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about yourself..."
            />
          </FormField>

          <FormField label="Qualifications">
            <TextArea
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="List your qualifications..."
              height="h-40"
            />
          </FormField>

          <FormField label="Current Education">
            <Input
              value={current_education}
              onChange={(e) => setCurrentEducation(e.target.value)}
              placeholder="Current education status..."
            />
          </FormField>

          <FormField label="Teaching Approach">
            <TextArea
              value={tutoring_approach}
              onChange={(e) => setTutorApproach(e.target.value)}
              placeholder="Describe your teaching style..."
            />
          </FormField>

          <FormField label="Experience">
            <TextArea
              value={tutoring_experience}
              onChange={(e) => setTutorExperience(e.target.value)}
              placeholder="Share your tutoring experience..."
            />
          </FormField>

          <FormField label="Location">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your location..."
            />
          </FormField>

          <div className="pt-4">
            <Button
              onClick={updateProfile}
              disabled={loading}
              className="w-full bg-blue-600 text-white"
            >
              {loading ? "Updating..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 lg:sticky lg:top-4">
        <ProfilePreview
          subjects={subjects}
          bio={bio}
          qualifications={qualifications}
          tutoring_approach={tutoring_approach}
          tutoring_experience={tutoring_experience}
          current_education={current_education}
          location={location}
        />
      </div>
    </div>
  );
}
