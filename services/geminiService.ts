import { GoogleGenAI } from "@google/genai";
import { getDirectoryData } from './db';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Flatten directory data for easier AI consumption
const flattenDirectory = () => {
  const data = getDirectoryData(); // Fetch fresh data
  let context = "Here is the directory of Preferred Partners of the Hamptons (PPOTH):\n";
  data.forEach(cat => {
    cat.subCategories.forEach(sub => {
      sub.businesses.forEach(biz => {
        context += `- Name: ${biz.name} (ID: ${biz.id})\n`;
        context += `  Category: ${cat.name} > ${sub.name}\n`;
        context += `  Description: ${biz.description}\n`;
        context += `  Rating: ${biz.rating}/5 stars\n`;
        context += `  Location: ${biz.address}\n`;
        context += `  Services: ${biz.services.join(', ')}\n\n`;
      });
    });
  });
  return context;
};

export const generateConciergeResponse = async (userQuery: string, pageContext?: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, I cannot connect to the Concierge service right now. Please check your API key configuration.";
  }

  try {
    const directoryContext = flattenDirectory();
    
    // Add context about what the user is looking at
    let contextInstruction = "";
    if (pageContext) {
        contextInstruction = `The user is currently viewing this page/url: "${pageContext}". If their question is vague (e.g. "who is good here?"), use this context to infer they mean partners relevant to this page.`;
    }

    const systemInstruction = `
      You are the Elite Concierge for "Preferred Partners of the Hamptons" (PPOTH).
      Your goal is to help wealthy homeowners in the Hamptons find the best service providers from our exclusive directory.
      
      Rules:
      1. ONLY recommend businesses that are listed in the provided directory context.
      2. Be polite, sophisticated, and helpful. Use a tone appropriate for high-net-worth individuals.
      3. If a user asks for a service not in the directory, apologize and suggest the closest match or say we don't have a vetted partner for that yet.
      4. When recommending a partner, you MUST provide a link to their profile using this specific syntax: [Partner Name](/business/PARTNER_ID).
         Example: "I highly recommend [Hamptons Modern Architecture](/business/biz_arch_1) for your project."
      5. Provide a brief reason why the partner fits the user's request.
      6. Keep responses concise (under 150 words) unless asked for details.
      7. NEUTRALITY RULE: If a user asks for a service (e.g., "plumber") and there are multiple vetted partners in that subcategory, you MUST list ALL of them. Do not favor one over the other. Present them as equal, excellent options.
      
      ${contextInstruction}
      
      ${directoryContext}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I am having trouble retrieving that information right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing technical difficulties. Please try again later.";
  }
};