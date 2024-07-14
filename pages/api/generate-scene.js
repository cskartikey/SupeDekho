import OpenAI from 'openai';
import dotenv from 'dotenv';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "http://jamsapi.hackclub.dev/openai"
});

async function generateDalleImage(prompt) {
  try {
    const dalleResponse = await openai.images.generate({
      prompt: prompt,
      n: 1,
    });

    if (typeof dalleResponse === 'string') {
      const parsedResponse = JSON.parse(dalleResponse);
      if (parsedResponse.data && parsedResponse.data.length > 0) {
        return parsedResponse.data[0].url;
      } else {
        throw new Error("No data returned from DALL-E API");
      }
    } else {
      throw new Error("Invalid response format from DALL-E API");
    }
  } catch (error) {
    console.error("Error during DALL-E image generation:", error);
    return null;
  }
}

export default async function handler(req, res) {
  const { powers } = req.body;
  const prompt = `
    Create a scene that includes the following superpowers: ${powers.join(', ')}
    The scene should be imaginative and vivid, rendered in a cartoonish style.
  `;

  try {
    const dalleImage = await generateDalleImage(prompt);

    if (dalleImage) {
      toast.dismiss();
      toast.success('Scene generated successfully!');
      res.status(200).json({ sceneImageUrl: dalleImage });
    } else {
      toast.dismiss();
      toast.error('Failed to generate scene.');
      res.status(500).json({ error: 'Failed to generate scene.' });
    }
  } catch (error) {
    toast.dismiss();
    toast.error('Internal server error.');
    console.error("Error during DALL-E image generation:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
