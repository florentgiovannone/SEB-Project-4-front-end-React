import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IUser } from "../interfaces/user"
import Footer from "./Footer"
import axios from "axios"
// import { baseUrl } from "../config";
function UserDashboard() {

    const { userId } = useParams()
console.log(userId);

    React.useEffect(() => {
        console.log("The dash Page has mounted")
    }, [])



    const [neededUser, setUser] = React.useState<IUser | null>(null)
    React.useEffect(() => {
        async function fetchUser() {
            const resp = await fetch(`/api/users/${userId}`)
            console.log(resp);
            const userData = await resp.json()
            setUser(userData)            
        }
        fetchUser()
    }, [])
    console.log(neededUser?.email);
    

    return <> <section className="section">
        <div className="container has-text-centered is-widescreen">

            <div className="account column is-rounded background-is-grey is-centered m-6">
                <h5 className="title has-text-black has-text-centered mb-6">{`${neededUser?.username}'s Account`}</h5>
                <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Firstname:`}</span> {neededUser?.firstname}</p>
                <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Lastname:`}</span> {neededUser?.lastname}</p>
                <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Username:`}</span> {neededUser?.username}</p>
                <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Email:`}</span> {neededUser?.email}</p>
            </div>
            <div className="columns has-text-centered is-centered is-multiline mt-5">
                <a href={`/mystream`}><button className="button is-outlined is-primary m-2">Back to My stream</button></a>
            </div>
        </div>

    </section>
        <Footer /> </>
}

export default UserDashboard