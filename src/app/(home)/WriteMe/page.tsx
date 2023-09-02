import React from 'react'
import { FaPenNib as Pen } from 'react-icons/fa'
import WriteMeForm from '@/components/WriteMeForm'

const page = () => {
  return (
    <>
      <div>
        <h1>
          Write Me &nbsp;
          <Pen />
        </h1>
      </div>
      <WriteMeForm />
    </>
  )
}

export default page
