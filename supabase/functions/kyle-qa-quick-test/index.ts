import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface ScenarioConfig {
  id: string;
  name: string;
  simulated_user_prompt: string;
  first_message: string;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "PRICE_OBJECTION",
    name: "Price Objection Handling",
    simulated_user_prompt: `You are a skeptical lead who just saw the project pricing and thinks it's too expensive. 
    Start by saying the price is too high. If the agent talks about value or ROI, acknowledge it but stay hesitant.
    After 3-4 exchanges, either agree to hear more or end the conversation.`,
    first_message: "Hey, I just saw the pricing... honestly it's way more than I expected. Can you explain why it costs so much?"
  },
  {
    id: "SOURCE_CHECK",
    name: "Source Verification Request",
    simulated_user_prompt: `You are a data-driven lead who wants to verify the sources of any claims made.
    Ask where the data comes from. If the agent offers to send sources via email, accept.
    Be polite but firm about wanting proof.`,
    first_message: "These numbers you're showing me - where do they come from? I need to verify this with my team."
  },
  {
    id: "SCHEDULE_CALL",
    name: "Meeting Scheduling",
    simulated_user_prompt: `You are an interested lead who wants to schedule a call to discuss further.
    Ask about scheduling a meeting. Provide your availability when asked.
    Be cooperative and ready to book.`,
    first_message: "This looks interesting. Can we schedule a call to go over the details? I have some time this week."
  },
  {
    id: "NEED_TO_THINK",
    name: "Stalling Objection",
    simulated_user_prompt: `You are a lead who is interested but hesitant to commit.
    Say you need to think about it. If the agent asks discovery questions, answer them honestly.
    Don't commit easily but be open to discussion.`,
    first_message: "Look, this all sounds good but I really need to think about it. Let me get back to you."
  }
];

const EVALUATION_CRITERIA = [
  {
    id: "brevity",
    name: "Brevity Check",
    conversation_goal_prompt: "Did each agent response contain at most 2 short sentences? Responses should be concise and punchy, not long-winded.",
    use_knowledge_base: false
  },
  {
    id: "no_forbidden_phrases",
    name: "No Forbidden Phrases",
    conversation_goal_prompt: "Did the agent avoid saying phrases like 'Let me pull up', 'According to the report', 'I'm checking', 'One moment while I'? The agent should never announce tool usage.",
    use_knowledge_base: false
  },
  {
    id: "one_question",
    name: "One Question Rule",
    conversation_goal_prompt: "Did the agent ask at most one question per response? Multiple questions in a single turn is a failure.",
    use_knowledge_base: false
  },
  {
    id: "value_focus",
    name: "Value Before Price",
    conversation_goal_prompt: "When discussing pricing, did the agent focus on value, ROI, or outcomes rather than justifying the cost directly?",
    use_knowledge_base: false
  }
];

async function runScenario(
  apiKey: string,
  agentId: string,
  scenario: ScenarioConfig,
  wizardId: string
): Promise<any> {
  const url = `https://api.elevenlabs.io/v1/convai/agents/${agentId}/simulate-conversation`;
  
  const payload = {
    simulation_specification: {
      simulated_user_config: {
        prompt: {
          prompt: scenario.simulated_user_prompt,
          llm: "gpt-4o",
          temperature: 0.7
        },
        first_message: scenario.first_message
      },
      max_turns: 8,
      mock_tool_calls: {
        "kyle_n8n_mcp_tools_kyle_get_lead_context": {
          result: JSON.stringify({
            name: "Test Lead",
            email: "test@example.com",
            project: "Metrixa",
            saas_description: "A SaaS analytics platform for e-commerce",
            hero_score: 78,
            investment_min: 15000,
            investment_max: 25000
          })
        },
        "kyle_n8n_mcp_tools_kyle_send_general_email": {
          result: JSON.stringify({ success: true, message_id: "mock-123" })
        },
        "kyle_n8n_mcp_tools_kyle_get_available_slots": {
          result: JSON.stringify({
            slots: [
              { date: "2026-02-05", time: "10:00 AM EST" },
              { date: "2026-02-05", time: "2:00 PM EST" },
              { date: "2026-02-06", time: "11:00 AM EST" }
            ]
          })
        },
        "kyle_n8n_mcp_tools_kyle_book_meeting": {
          result: JSON.stringify({ success: true, booking_id: "book-456" })
        }
      }
    },
    extra_evaluation_criteria: EVALUATION_CRITERIA,
    dynamic_variables: {
      wizard_id: wizardId,
      timezone: "America/Sao_Paulo",
      current_date: new Date().toISOString()
    }
  };

  console.log(`Running scenario: ${scenario.id}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Scenario ${scenario.id} failed:`, errorText);
    return {
      id: scenario.id,
      name: scenario.name,
      status: "error",
      error: errorText
    };
  }

  const result = await response.json();
  
  // Extract tool calls from transcript
  const toolCallsDetected: string[] = [];
  if (result.transcript) {
    for (const turn of result.transcript) {
      if (turn.tool_calls) {
        for (const call of turn.tool_calls) {
          if (!toolCallsDetected.includes(call.name)) {
            toolCallsDetected.push(call.name);
          }
        }
      }
    }
  }

  // Determine pass/fail based on evaluation results
  const criteriaResults = result.evaluation_results || [];
  const allPassed = criteriaResults.every((c: any) => c.result === "success");

  return {
    id: scenario.id,
    name: scenario.name,
    status: allPassed ? "passed" : "failed",
    transcript: result.transcript,
    tool_calls_detected: toolCallsDetected,
    criteria_results: criteriaResults,
    raw_response: result
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_KYLE_AGENT_ID_CHAT = Deno.env.get('ELEVENLABS_KYLE_AGENT_ID_CHAT');

    if (!ELEVENLABS_API_KEY || !ELEVENLABS_KYLE_AGENT_ID_CHAT) {
      return new Response(
        JSON.stringify({ error: 'Missing ELEVENLABS_API_KEY or ELEVENLABS_KYLE_AGENT_ID_CHAT' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse optional body for custom wizard_id
    let wizardId = "57a2f729-64ef-47bd-8edf-beac638eeed5"; // default
    try {
      const body = await req.json();
      if (body.wizard_id) {
        wizardId = body.wizard_id;
      }
    } catch {
      // No body, use default
    }

    console.log(`Starting Kyle QA Quick Test with agent: ${ELEVENLABS_KYLE_AGENT_ID_CHAT}`);
    console.log(`Using wizard_id: ${wizardId}`);

    const results = [];
    
    // Run scenarios sequentially to avoid rate limiting
    for (const scenario of SCENARIOS) {
      const result = await runScenario(
        ELEVENLABS_API_KEY,
        ELEVENLABS_KYLE_AGENT_ID_CHAT,
        scenario,
        wizardId
      );
      results.push(result);
    }

    const passed = results.filter(r => r.status === "passed").length;
    const failed = results.filter(r => r.status === "failed").length;
    const errors = results.filter(r => r.status === "error").length;

    const report = {
      test_run_id: `quick-test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agent_id: ELEVENLABS_KYLE_AGENT_ID_CHAT,
      wizard_id: wizardId,
      total_scenarios: SCENARIOS.length,
      passed,
      failed,
      errors,
      scenarios: results
    };

    console.log(`Test complete: ${passed} passed, ${failed} failed, ${errors} errors`);

    return new Response(
      JSON.stringify(report, null, 2),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('kyle-qa-quick-test error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
