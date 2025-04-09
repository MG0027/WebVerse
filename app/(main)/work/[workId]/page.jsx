import React from 'react'
import ChatView from '@/components/custom/chatView'
import CodeView from '@/components/custom/codeView'

function WorkSpace() {
  return (
    <div className='p-10'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
        <ChatView></ChatView>
        <div className='col-span-2'>
        <CodeView></CodeView>
        </div>
      </div>
      </div>
  )
}

export default WorkSpace