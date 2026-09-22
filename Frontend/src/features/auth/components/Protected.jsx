import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children, role = "seller" }) => {


    const { user } = useSelector((state) => state.auth)
    const loading = useSelector((state) => state.auth.loading)

    if (loading) {
        return <div>Loading...</div>
    }
    if (!user) {
        return <Navigate to="/login" />
    }

    if(user.role !== role){
        return <Navigate to ="/" />
    }


    return (
        <>
            {children}
        </>
    )
}

export default Protected