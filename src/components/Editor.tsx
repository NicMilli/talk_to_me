'use client'

import { useState, useId, useEffect } from 'react'
import { FaMicrophone as Microphone, FaRobot as Robot } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ToastProvider from './toast.provider'

const Editor = ({
  Content = '',
  Title = '',
  Audience = '',
}: {
  Content?: string | null
  Title?: string | null
  Audience?: string | null
}) => {
  const [content, setContent] = useState(Content)
  const [title, setTitle] = useState(Title)
  const [audience, setAudience] = useState(Audience)
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  let originalContent = ''
  const [isConnected, setIsConnected] = useState(false)
  let socket

  const contentId = useId()
  const titleId = useId()
  const audienceId = useId()

  const getAudioPermission = () => {
    navigator.getUserMedia(
      {
        video: false,
        audio: true,
      },
      // successCallback
      function (localMediaStream) {
        setAudioEnabled(true)
      },

      // errorCallback
      function (err) {
        setAudioEnabled(false)
        console.log(typeof err.DOMException)
        if (err.DOMException === 'Permission denied') {
          toast.error(
            'Speech dictation requires access to your microphone, please click the information icon in the address bar and allow access to your microphone to use this feature.'
          )
        }
      }
    )

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      const mic = new SpeechRecognition()
      mic.continous = true
      mic.interimResults = true
      mic.lang = 'en-US'
      mic.continuous = true
    }
  }

  useEffect(() => {
    getAudioPermission()
  }, [])

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

  const touchup = async (e) => {
    socket = await connectToServer()
    setContent((prev) => '')
    socket.send(JSON.stringify({ content, targetAudience: audience }))
    socket.onmessage = (e) => {
      console.log(e)
      setContent((prevContent) => prevContent + e.data)
    }
  }

  const record = async (e) => {
    //TODO: Handle permission denied/mic not available

    setIsRecording((prevIsRecording) => !prevIsRecording)
    try {
      if (!isRecording) {
        mic.start()
      } else {
        mic.stop()
        mic.onend = () => {
          toast.error('Audio stopped')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to connect to microphone')
      return
    }

    mic.onstart = () => {
      originalContent = content
      setContent((prevContent) => prevContent + ' ' + 'Start speaking...')
      toast.success('Microphone is on')
    }

    mic.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => {
          return result[0]
        })
        .map((result) => result.transcript)
        .join('')

      const mergedContent = originalContent + ' ' + transcript

      setContent(mergedContent)
      mic.onerror = (e) => {
        console.log(e.error)
      }
    }
  }

  //TODO: HANDLE BACKSPACE IN TEXTAREA
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
                className="block p-2 w-full text-lg font-bold text-gray-300 rounded-lg border border-orange-300 outline-orange-400/80"
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
                className="w-full p-8 text-xl text-gray-400 rounded-xl outline-orange-500"
                value={content}
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
              disabled={!audioEnabled}
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
