'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import ToastProvider from './toast.provider'
import ReactMarkdown from 'react-markdown'
import { FaPaperclip as PaperClip } from 'react-icons/fa'

const WriteMeForm = () => {
  const [readMe, setReadMe] = useState('')
  const [formData, setFormData] = useState({
    repo: '',
    tech: true,
    technologiesFile: '',
    badges: '',
    visuals: false,
    images: '',
    installation: true,
    codeHighlights: false,
    functions: '',
    usage: false,
    contributing: false,
    authors: true,
    endPoint: 'writeme',
  })

  async function connectToServer() {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:7071/ws/writeme'
    )
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws)
        }
      }, 10)
    })
  }

  const handleSubmit = async () => {
    try {
      const socket = await connectToServer()
      setReadMe('')
      socket.send(JSON.stringify(formData))
      socket.onmessage = (res: { data: string }) => {
        setReadMe((prevReadMe) => prevReadMe + res.data)
      }
    } catch (err) {
      toast.error(err)
    }
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFormData({
      repo: '',
      tech: true,
      technologiesFile: '',
      visuals: false,
      images: '',
      installation: true,
      codeHighlights: false,
      functions: '',
      usage: false,
      contributing: false,
      authors: true,
      endPoint: 'writeme',
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.checked,
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readMe)
    toast.success('You copied your ReadMe to your clipboard')
  }

  return (
    <ToastProvider>
      <main>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex flex-col justify-center gap-5 px-5"
        >
          <div>
            <label>
              Repository:
              <input
                className="rounded-lg p-1 m-1"
                type="text"
                name="repo"
                value={formData.repo}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="flex items-center">
            <label>
              Technology badges:
              <input
                className="rounded-lg p-1 m-1"
                type="checkbox"
                name="tech"
                checked={formData.tech}
                onChange={handleCheckbox}
              />
            </label>
          </div>

          <div className="ckeck-box">
            <label>
              Visuals/ Images:
              <input
                type="checkbox"
                name="visuals"
                checked={formData.visuals}
                onChange={handleCheckbox}
              />
            </label>
          </div>

          {formData.visuals ? (
            <div>
              Image URLs (Comma separated list):
              <input
                className="rounded-lg p-1 m-1"
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
              />
            </div>
          ) : null}

          <div className="ckeck-box">
            <label>
              Installation/usage instructions:
              <input
                type="checkbox"
                name="installation"
                checked={formData.installation}
                onChange={handleCheckbox}
              />
            </label>
          </div>

          <div className="ckeck-box">
            <label>
              Code Highlights:
              <input
                type="checkbox"
                name="codeHighlights"
                checked={formData.codeHighlights}
                onChange={handleCheckbox}
              />
            </label>
          </div>

          {formData.codeHighlights ? (
            <div>
              Optional:
              <input
                className="rounded-lg p-1 m-1"
                type="text"
                name="functions"
                value={formData.functions}
                onChange={handleChange}
                placeholder="Functions to highlight?"
              />
            </div>
          ) : null}

          <div className="ckeck-box">
            <label>
              Authors:
              <input
                type="checkbox"
                name="authors"
                id="authors"
                checked={formData.authors}
                onChange={handleCheckbox}
              />
            </label>
          </div>

          <div className="flex gap-5 justify-center">
            <button
              className="flex rounded-md m-2 py-1 px-2 items-center justify-center bg-gradient-to-r from-amber-600 to-fuchsia-600"
              type="submit"
            >
              Generate ReadMe!
            </button>
            <button
              className="flex rounded-md m-2 py-1 px-2 items-center justify-center bg-gradient-to-r from-amber-600 to-fuchsia-600"
              type="button"
              onClick={handleReset}
            >
              Reset fields
            </button>
          </div>
        </form>
      </main>
      <hr
        style={{
          color: 'black',
          width: '100vw',
        }}
      />
      <div className="flex gap-5">
        <button
          className="flex rounded-md m-2 py-1 px-2 items-center justify-center bg-gradient-to-r from-amber-600 to-fuchsia-600"
          type="button"
          aria-label="Copy"
          onClick={copyToClipboard}
        >
          Copy &nbsp;
          <PaperClip />
        </button>
        <button
          className="flex rounded-md m-2 py-1 px-2 items-center justify-center bg-gradient-to-r from-amber-600 to-fuchsia-600"
          type="button"
          onClick={handleSubmit}
        >
          Retry
        </button>
        <ReactMarkdown>{readMe}</ReactMarkdown>
      </div>
    </ToastProvider>
  )
}

export default WriteMeForm
