import { processVideo } from "./processVideo"
import { transcribe } from "./transcribe"
const inputFile = process.argv[2]

const main = async () => {
  if (!inputFile) {
    console.error("I'm going to need an input file.")
  }

  const outputFiles = await processVideo(inputFile)

  // At some point loop through all the output files
  const text = await transcribe(
    outputFiles[0],
    "Below is a transcription that has accurate punctionation and capitalization and paragraph breaks."
  )

  console.log(text)
}

main()
