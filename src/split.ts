import { execSync } from "child_process"
import fs from "fs"
import path from "path"

const inputFile = process.argv[2]
const bitrate = process.argv[4]
const outputName = "output/output"

const processVideo = (inputFile: string) => {
  const dir = path.dirname(outputName)
  fs.mkdirSync(dir, { recursive: true })

  const audioFile = `${outputName}.mp3`
  const adjustedAudioFile = `${outputName}.adjusted.mp3`

  console.log(`🌈 `, 1)
  extractAudio(inputFile, audioFile)
  console.log(`🌈 `, 2)
  adjustBitrate(audioFile, adjustedAudioFile)
  console.log(`🌈 `, 3)
  splitAudio(adjustedAudioFile)
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
  const command = `ffmpeg -i ${inputFile} -f segment -segment_time ${duration} -c copy ${outputName}%03d.mp3`
  execFFmpegCommand(command)
}

const adjustBitrate = (inputFile: string, outputFile: string) => {
  const bitrate = "16k"
  const command = `ffmpeg -i ${inputFile} -vn -b:a ${bitrate} -threads 4 ${outputFile}`
  execFFmpegCommand(command)
}

processVideo(inputFile)
