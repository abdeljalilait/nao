import { OpenAI } from '@langchain/openai';

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your OpenAI API key in the environment variables
});

export async function enhanceProductDescription(product: {
  name: string;
  description: string;
  nameOfCategory: string;
}) {
  const prompt = `
You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task is to enhance the description of a product based on the information provided.

Product name: ${product.name}
Product description: ${product.description}
Category: ${product.nameOfCategory}

New Description:
  `;

  try {
    const response = await openai.completionWithRetry({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.7,
    });

    const enhancedDescription = response.choices[0].text.trim();
    return enhancedDescription;
  } catch (error) {
    console.error('Error enhancing product description:', error);
    throw error;
  }
}
