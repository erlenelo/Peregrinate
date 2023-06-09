import { useState } from "react"
import { useTravelsContext } from "../hooks/useTravelsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const AddTravelForm = (props) => {
    const { travelDispatch } = useTravelsContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState("")
    const [country, setCountry] = useState("")
    const [startDestination, setStartDestination] = useState("")
    const [endDestination, setEndDestination] = useState("")
    const [price, setPrice] = useState("")
    const [duration, setDuration] = useState("")
    const [travelType, setTravelType] = useState("")
    const [description, setDescription] = useState("")
    const [likes] = useState(0)
    const [author, setAuthor] = useState("")
    const [error, setError] = useState(null)

    const [style, setStyle] = useState("add-travel-form-show")
    
    const handleAddTravel = async (e) => {
        e.preventDefault()

        const travel = {title, country, startDestination, endDestination, price, duration, travelType, description, likes, author}

        const response = await fetch("/api/travels", {
            method: "POST",
            body: JSON.stringify(travel),
            headers: {"Content-Type": "application/json"}
        })

        const json = await response.json()

        if (!response) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)
            setTitle("")
            setCountry("")
            setStartDestination("")
            setEndDestination("")
            setPrice("")
            setDuration("")
            setTravelType("")
            setDescription("")
            travelDispatch({type: "CREATE_TRAVEL", payload: json})

            addToUserTravels(json._id)

            setStyle("add-travel-form-hide")
        }
        
        console.log(title, country, startDestination, endDestination, price, duration, travelType, description)
        console.log(travel)
        props.setExitButton (false)
        props.setAddNewTravel(false)
    }
    

    const addToUserTravels = async (travelID) => {
        user.myTravels.push(travelID)

        const response2 = await fetch("/api/users/" + user._id, {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        })
    }
    
    return (
        <form className={style} onSubmit={handleAddTravel} >
            <h1 className="add-travel-heading">Add new travel</h1>

            <input className="add-travel-input" type="text" placeholder="Title of travel"
                onChange={(e) => setTitle(e.target.value)} value={title} />

            <input className="add-travel-input" type="text" placeholder="Country"
                onChange={(e) => setCountry(e.target.value)} value={country} />

            <input className="add-travel-input" type="text" placeholder="Start"
                onChange={(e) => setStartDestination(e.target.value)} value={startDestination} />

            <input className="add-travel-input" type="text" placeholder="Destination"
                onChange={(e) => setEndDestination(e.target.value)} value={endDestination} />

            <input className="add-travel-input" type="number" placeholder="Price"
                onChange={(e) => setPrice(e.target.value)} value={price} />

            <input className="add-travel-input" type="number" placeholder="Duration"
                onChange={(e) => setDuration(e.target.value)} value={duration} />

            <input className="add-travel-input" type="text" placeholder="Type of travel"
                onChange={(e) => setTravelType(e.target.value)} value={travelType} />

            <input className="add-travel-input" type="text" placeholder="Short description"
                onChange={(e) => {setDescription(e.target.value); setAuthor(user.username)}} value={description} />

            <button className="formButton" id="add-travel-button" onClick={handleAddTravel}>Publish</button>
        </form>
    )
}

export default AddTravelForm
