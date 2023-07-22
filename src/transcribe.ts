import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import { getErrorMessage } from "../utils/getErrorMessage"
import path from "path"

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(config)

export const transcribe = async (filepath: string, prompt?: string) => {
  try {
    const file = fs.createReadStream(filepath) as any
    const response = await openai.createTranscription(file, "whisper-1", prompt, "verbose_json")

    console.log(`🌈 `, response.data)

    const filename = path.basename(filepath, path.extname(filepath))
    fs.writeFileSync(`output/${filename}.json`, JSON.stringify(response.data, null, 2))

    return response.data
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = error.response as any
      console.log("🔴", JSON.stringify(response.data))
    } else {
      console.log("🔴", getErrorMessage(error))
    }
    throw new Error("OpenAI API Error")
  }
}
