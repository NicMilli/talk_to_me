import React from 'react'
import { FaPenNib as Pen } from 'react-icons/fa'
import WriteMeForm from '@/components/WriteMeForm'

const page = async () => {
  return (
    <>
      <div className="mb-2 p-2">
        <h1 className="flex text-2xl">
          Write Me &nbsp;
          <Pen className="fill-yellow-500" />
        </h1>
      </div>
      <WriteMeForm />
    </>
  )
}

export default page
