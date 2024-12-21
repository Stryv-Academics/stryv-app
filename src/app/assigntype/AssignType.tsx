"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AssignRolePage() {
    const supabase = createClient();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserId = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error);
                setMessage("Failed to fetch user. Please log in.");
            } else {
                setUserId(user?.id || null);
            }
        };

        fetchUserId();
    }, [supabase]);

    async function updateRole(selectedRole: string) {
        try {
            if (!userId) {
                setMessage("User not found. Please log in.");
                return;
            }

            setLoading(true);
            setMessage("");

            const { error } = await supabase.from("profiles").upsert({
                id: userId,
                role: selectedRole,
                updated_at: new Date().toISOString(),
            });

            if (error) {
                console.error("Error updating role:", error);
                setMessage("Failed to update role. Please try again.");
            } else {
                setMessage(`Role successfully updated to "${selectedRole}"!`);
                router.push("/student");
            }
        } catch (error: any) {
            console.error("Unexpected error:", error);
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Assign Your Role</h2>

            <p className="text-gray-600">Choose a role below to set your profile.</p>

            <div className="space-y-4">
                <button
                    onClick={() => updateRole("student")}
                    disabled={loading}
                    className="block w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
                >
                    {loading && userId ? "Updating..." : "Set as Student"}
                </button>
                <button
                    onClick={() => updateRole("tutor")}
                    disabled={loading}
                    className="block w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-400"
                >
                    {loading && userId ? "Updating..." : "Set as Tutor"}
                </button>
            </div>

            {message && (
                <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
