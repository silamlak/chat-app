import ChatUsers from './ChatUsers'
import { Outlet } from 'react-router-dom'

const ChatLayout = () => {
  return (
    <div className='flex flex-row h-screen w-full '>
      <div className='w-1/4 p-4'>
        <ChatUsers />
      </div>
      <div className='w-3/4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default ChatLayout
