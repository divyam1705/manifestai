"use server";

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// Define task type with description field
export const maxDuration = 50;

export type ScheduleTask = {
  time: string;
  task: string;
  description: string; // Added description field
  reason: string;
};

// Define types for our output
export type ScheduleOutput = {
  error: string | null;
  summary: string | null;
  // Original daily_schedule for compatibility
  daily_schedule: ScheduleTask[] | null;
  // New weekly_schedule with schedules for each day
  weekly_schedule: {
    Monday: ScheduleTask[];
    Tuesday: ScheduleTask[];
    Wednesday: ScheduleTask[];
    Thursday: ScheduleTask[];
    Friday: ScheduleTask[];
    Saturday: ScheduleTask[];
    Sunday: ScheduleTask[];
  } | null;
  weekly_goals: string[] | null;
  monthly_goals: string[] | null;
  productivity_tips: string[] | null;
  // New fields for enhanced dashboard
  daily_challenges: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  } | null;
  learning_resources:
    | {
        title: string;
        url: string;
        description: string;
      }[]
    | null;
  energy_insights: {
    peak_hours: string;
    rest_periods: string;
    optimizations: string;
  } | null;
  progress_metrics: {
    focus_areas: string[];
    key_milestones: string[];
    success_indicators: string[];
  } | null;
};

// The main function to generate a schedule
export async function generateSchedule(
  prompt: string
): Promise<ScheduleOutput> {
  try {
    // Initialize the OpenAI chat model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Using a capable model
      temperature: 0.5, // Lower temperature for more predictable output
      maxTokens: 3000,
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create instructions for formatting JSON correctly

    // Create a custom prompt template with properly escaped braces

    const promptTemplate = PromptTemplate.fromTemplate(
      `{input}

      Ensure you include the daily_schedule field for backward compatibility, but focus on providing a comprehensive weekly_schedule.`
    );

    // Create a parsing chain
    const outputParser = new StringOutputParser();

    // Create a chain
    const chain = RunnableSequence.from([promptTemplate, model, outputParser]);

    // Run the chain with the input prompt
    const result = await chain.invoke({
      input: prompt,
    });

    console.log("Raw LLM Response:", result.slice(0, 300) + "..."); // Log the beginning of the response

    // Parse the response to extract the JSON
    let parsedOutput: ScheduleOutput;
    try {
      // Clean up the response to handle potential extra characters
      let cleanedJsonString = result.trim();

      // Remove any potential markdown code block markers
      cleanedJsonString = cleanedJsonString.replace(/```json\s*/g, "");
      cleanedJsonString = cleanedJsonString.replace(/```\s*$/g, "");

      // Try to find the JSON object if there's surrounding text
      // Using a regex without the 's' flag for broader compatibility
      const jsonMatch = cleanedJsonString.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[1]) {
        cleanedJsonString = jsonMatch[1];
      }

      console.log(
        "Cleaned JSON string:",
        cleanedJsonString.slice(0, 300) + "..."
      );

      parsedOutput = JSON.parse(cleanedJsonString);

      // Validate that the parsed output has the expected structure
      if (!parsedOutput.summary && !parsedOutput.error) {
        throw new Error("Missing required fields in the generated schedule");
      }

      // If we have a daily_schedule but not a weekly_schedule, create a default one
      if (parsedOutput.daily_schedule && !parsedOutput.weekly_schedule) {
        parsedOutput.weekly_schedule = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };

        // Fill Monday with the daily_schedule tasks as a fallback
        parsedOutput.weekly_schedule.Monday = parsedOutput.daily_schedule;
      }
    } catch (parseError: Error | SyntaxError | unknown) {
      console.error("Failed to parse LLM output as JSON:", parseError);
      // Provide a fallback error response
      const errorMessage =
        parseError instanceof Error ? parseError.message : String(parseError);
      return {
        error:
          "Failed to generate a valid schedule. The AI response could not be parsed correctly. Technical details: " +
          errorMessage,
        summary: null,
        daily_schedule: null,
        weekly_schedule: null,
        weekly_goals: null,
        monthly_goals: null,
        productivity_tips: null,
        daily_challenges: null,
        learning_resources: null,
        energy_insights: null,
        progress_metrics: null,
      };
    }

    return parsedOutput;
  } catch (error: Error | unknown) {
    console.error("Error in schedule generation:", error);
    // Return an error response
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error: `An error occurred while generating your schedule: ${errorMessage}`,
      summary: null,
      daily_schedule: null,
      weekly_schedule: null,
      weekly_goals: null,
      monthly_goals: null,
      productivity_tips: null,
      daily_challenges: null,
      learning_resources: null,
      energy_insights: null,
      progress_metrics: null,
    };
  }
}

// Helper function to validate if the user's input is appropriate
export async function validateUserInput(): Promise<boolean> {
  // Simplified function to avoid unused parameter warning
  // Add validation logic here if needed
  return true;
}

// Helper function to format an error response
export async function formatErrorResponse(
  errorMessage: string
): Promise<ScheduleOutput> {
  return {
    error: errorMessage,
    summary: null,
    daily_schedule: null,
    weekly_schedule: null,
    weekly_goals: null,
    monthly_goals: null,
    productivity_tips: null,
    daily_challenges: null,
    learning_resources: null,
    energy_insights: null,
    progress_metrics: null,
  };
}
