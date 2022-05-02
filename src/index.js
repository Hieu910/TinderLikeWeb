import React from 'react'
import ReactDOM from 'react-dom'
import { UserProvider } from "./context/UserContext"
import { HeaderProvider } from './context/HeaderContext'
import { ChatProvider } from './context/ChatContext'
import './index.css'
import App from './App'
import { ChatEngineWrapper } from 'react-chat-engine'

ReactDOM.render(
  <React.StrictMode>
    <ChatEngineWrapper>
      <UserProvider>
        <HeaderProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </HeaderProvider>
      </UserProvider>
    </ChatEngineWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

