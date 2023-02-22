import React , {useEffect} from 'react'
import {useOutletContext} from 'react-router-dom'

function GroupMessages() {
    const [myMessage,renderMessages] = useOutletContext();
  
  return (
    <React.Fragment>
       {renderMessages(myMessage)}
    </React.Fragment>
  )
}

export default GroupMessages