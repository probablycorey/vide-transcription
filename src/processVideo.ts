import { execSync } from "child_process"
import fs from "fs"
import path from "path"

const outputName = "output/output"

export const processVideo = (inputFile: string) => {
  const dir = path.dirname(outputName)
  fs.rm(dir, { recursive: true })
  fs.mkdirSync(dir, { recursive: true })

  const audioFile = `${outputName}.mp3`
  const adjustedAudioFile = `${outputName}.adjusted.mp3`

  console.log(`🌈 `, "extracting audio")
  extractAudio(inputFile, audioFile)
  console.log(`🌈 `, "adjusting bitrate")
  adjustBitrate(audioFile, adjustedAudioFile)
  console.log(`🌈 `, "splitting audio")
  const outputFiles = splitAudio(adjustedAudioFile)

  return outputFiles
}

const execFFmpegCommand = (command: string) => {
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error("Error executing command:", command)
    console.error(error)
    process.exit(1)
  }
}

const extractAudio = (inputFile: string, outputFile: string) => {
  const command = `ffmpeg -i ${inputFile} -vn -acodec libmp3lame ${outputFile}`
  execFFmpegCommand(command)
}

const splitAudio = (inputFile: string) => {
  const duration = 5000 //seconds
  const command = `ffmpeg -i ${inputFile} -f segment -segment_time ${duration} -c copy ${outputName}-%03d.mp3`
  execFFmpegCommand(command)

  // get all files that match outputName-*.mp3
  const dir = path.dirname(outputName)
  const basename = path.basename(outputName, path.extname(outputName))
  const outputFiles = fs.readdirSync(dir).filter((file) => file.startsWith(`${basename}-`))
  return outputFiles
}

const adjustBitrate = (inputFile: string, outputFile: string) => {
  const bitrate = "16k"
  const command = `ffmpeg -i ${inputFile} -vn -b:a ${bitrate} -threads 4 ${outputFile}`
  execFFmpegCommand(command)
}
