import { transcribe } from "./transcribe"

const main = async () => {
  const text = await transcribe(
    "output/output_first_60s.mp3",
    "Below is a transcription that has accurate punctionation and capitalization and paragraph breaks."
  )
}

main()
