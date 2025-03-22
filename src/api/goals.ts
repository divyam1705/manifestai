import { supabase } from "@/lib/supabase";

export interface Goal {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export const createGoal = async (
  goal: Omit<Goal, "id" | "created_at" | "updated_at">
) => {
  try {
    const { data, error } = await supabase
      .from("goals")
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserGoals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getGoalById = async (goalId: string) => {
  try {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("id", goalId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateGoal = async (
  goalId: string,
  updates: Partial<Omit<Goal, "id" | "user_id" | "created_at">>
) => {
  try {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteGoal = async (goalId: string) => {
  try {
    const { error } = await supabase.from("goals").delete().eq("id", goalId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};
