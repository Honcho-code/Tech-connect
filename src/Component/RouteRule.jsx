import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../config/firebase'


export function ProtectedRoute({children}){
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user)=>{
        if(!user){
            navigate("/login")
        }
    })
    return children;
}

export function PublicRoute({children}){
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user)=>{
        if(user){
            navigate("/")
        }
    })
    return children;
}