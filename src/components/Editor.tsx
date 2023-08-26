'use client'

import { useState, useId, useEffect } from 'react'
import { FaMicrophone as Microphone, FaRobot as Robot } from 'react-icons/fa'
import ws from 'ws'
import { toast } from 'react-toastify'
import ToastProvider from './toast.provider'

//if (typeof window === 'undefined') {
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continous = true
mic.interimResults = true
mic.lang = 'en-US'
mic.continuous = true
//}

const Editor = ({
  script,
}: {
  script: { content: string; title: string; audience: string | null }
}) => {
  const [content, setContent] = useState(script.content)
  const [title, setTitle] = useState(script.title)
  const [audience, setAudience] = useState(script.audience)
  const [isRecording, setIsRecording] = useState(false)
  const [tempcontent, setTempContent] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  let socket

  const contentId = useId()
  const titleId = useId()
  const audienceId = useId()

  async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws')
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer)
          setIsConnected(true)
          resolve(ws)
        }
      }, 10)
    })
  }

  // async function record() {
  //   if (isRecording) {
  //     audio.stop()
  //     setIsRecording(false)
  //     const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
  //     const audioUrl = URL.createObjectURL(audioBlob)
  //     console.log(audioUrl)
  //     let file = new File([audioUrl], 'recorded_audio.mp3', {
  //       type: 'audio/mp3',
  //       lastModified: new Date().getTime(),
  //     })
  //     let container = new DataTransfer()
  //     container.items.add(file)
  //     document.getElementById('audioFile').files = container.files
  //     setAudioFile(container.files[0])

  //     console.log(file)
  //     return
  //   }

  //   setIsRecording(true)

  //   try {
  //     socket = await connectToServer()
  //     console.log(socket)
  //     socket.onmessage = (e) => {
  //       console.log(e)
  //       //setContent(e.data)
  //     }
  //   } catch (e) {
  //     toast.error('Failed to connect to server')
  //     return
  //   }

  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: false,
  //     })

  //     const mediaRecorder = new MediaRecorder(stream)

  //     mediaRecorder.ondataavailable = async (event) => {
  //       setAudioChunks((prev) => [...prev, event.data])
  //       socket.send(event.data)
  //     }

  //     mediaRecorder.start(100)

  //     setAudio(mediaRecorder)
  //   } catch (e) {
  //     toast.error('Failed to get audio')
  //     return
  //   }
  // }

  const touchup = async (e) => {
    socket = await connectToServer()
    //     console.log(socket)
    socket.send(JSON.stringify({ content, targetAudience: audience }))
    socket.onmessage = (e) => {
      setContent(JSON.parse(e.data))
    }
  }

  const record = async (e) => {
    // if (!mic) {
    //   toast.error('Failed to connect to microphone')
    //   return
    // }
    setIsRecording((prevIsRecording) => !prevIsRecording)

    if (!isRecording) {
      mic.start()
      mic.onend = (e) => {
        console.log('continue..')
        setTempContent('')
      }
    } else {
      mic.stop()
      mic.onend = () => {
        setContent((prevContent) => prevContent + ' ' + tempcontent)
        setTempContent('')
        toast.error('Audio stopped')
      }
    }

    mic.onstart = () => {
      setTempContent('Start speaking...')
      toast.success('Microphone is on')
    }

    mic.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => {
          return result[0]
        })
        .map((result) => result.transcript)
        .join('')

      setTempContent(transcript)
      mic.onerror = (e) => {
        console.log(e.error)
      }
    }
  }

  return (
    <ToastProvider>
      <div className="w-full h-full p-8">
        <audio style={{ width: 400 }}>
          <p>Audio stream not available. </p>
        </audio>
        <div className="w-[70vw">
          <div className="mb-4 w-full p-3 rounded-lg border bg-gray-300 border-gray-600">
            <label
              htmlFor={titleId}
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Title
              <input
                className="block p-2 w-full text-lg font-bold text-gray-900 bg-gray-50 rounded-lg border border-orange-300 outline-orange-400/80"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                id={titleId}
              ></input>
            </label>
          </div>

          <div className="mb-4 w-full p-3 rounded-lg border bg-gray-300 border-gray-600">
            <label
              htmlFor={titleId}
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Target Audience
              <input
                className="block p-2 w-full text-md text-gray-900 rounded-lg border border-orange-300 outline-orange-400/80"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                id={audienceId}
                name="audience"
                placeholder='Target Audience (e.g. "Investors")'
              ></input>
            </label>
          </div>

          <div className="mb-4 w-full p-3 rounded-lg border bg-gray-300 border-gray-600">
            <label
              htmlFor={contentId}
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Content
              <textarea
                className="w-full p-8 text-xl text-gray-800 rounded-xl outline-orange-500"
                value={content + ' ' + tempcontent}
                onChange={(e) => setContent(e.target.value)}
                name="content"
                id="content"
                rows="20"
              ></textarea>
            </label>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={record}
              className="rounded-lg p-1 bg-orange-200 text-gray-900 text-xl font-bold flex items-center justify-center"
            >
              {isRecording ? 'Stop' : 'Transcribe'}
              <Microphone className={isRecording ? 'fill-red-500' : ''} />
            </button>
            <button
              type="button"
              onClick={touchup}
              className="rounded-lg p-1 bg-orange-200 text-gray-900 text-xl font-bold flex items-center justify-center"
            >
              AI Touchup
              <Robot className="fill-orange-600" />
            </button>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

export default Editor
