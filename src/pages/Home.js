import React, {useRef, useState, useEffect} from 'react'
import '../Css/home.css'

import LoveResult from '../Components/loveResultPortal';

import { usePeer } from "../Contexts/PeerContext"
import { useAuth } from "../Contexts/AuthContext"

import firebase from '../Components/firebase'

function Home() {

    const {showVideoCall, currentCallState, callInformation, setCallInformation, setShowVideoCall } = usePeer() 
    const {usersChat, currentUser } = useAuth()  

    const myName = useRef()
    const otherName = useRef()

    const [matchResult, setMatchResult] = useState(null)

    const handleMatch = (e) =>{
        e.preventDefault()
        fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${myName.current.value}&sname=${otherName.current.value}`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-key": "36f99601d0mshff227eef7694e85p164d14jsn84b0ebf94d9e",
            "x-rapidapi-host": "love-calculator.p.rapidapi.com"
          }
        })
        .then(response => 
          response.json()
        )
        .then((data) => {
            console.log(data)
            setMatchResult(data)
        })
        .catch((err) =>{
            console.log("err")
        })
    }
    useEffect(async()=>{
        if(currentUser && currentUser!=null){
        try {
          await firebase.firestore().collection('calls').doc(currentUser.email).delete()
          console.log("Current successfully deleted!");
          if(await firebase.firestore().collection('destroy').doc(currentUser.email)!=null){
            await firebase.firestore().collection('destroy').doc(currentUser.email).delete()
          }
        }
        catch(error){
          console.error("Error removing document: ", error);
        }
    }
    if(callInformation && callInformation!=null){
        try {
          await firebase.firestore().collection('calls').doc(callInformation.from).delete()
          console.log("Other successfully deleted!");
          if(await firebase.firestore().collection('destroy').doc(callInformation.from)!=null){
            await firebase.firestore().collection('destroy').doc(callInformation.from).delete()
          }
        }
        catch(error){
          console.error("Error removing document: ", error);
        }
    }
      },[])

    return (
        matchResult===null?
        <form className="home" onSubmit={handleMatch}>
        <div className="form">
            <input type="text" placeholder="Your Name" required autocomplete="off"
            ref={myName}/>
            <label for="name" className="label-name">
            <span className="content-name"></span>    
            </label>  
        </div>
        <div className="form">
            <input type="text" placeholder="Match Name" required autocomplete="off"
            ref={otherName}/>
            <label for="name" className="label-name">
            <span className="content-name"></span>    
            </label>  
        </div>
        <div>
            <input type="submit" value="Calcul love" className="button"/> 
        </div>
        </form>
        :<LoveResult 
        svgNumber={matchResult.percentage}
        messageResult={matchResult.result}
        setMatchResult={setMatchResult}
        />
    )
}

export default Home
