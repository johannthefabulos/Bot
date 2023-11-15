import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Land(){
    const { landId } = useParams();
    const [land, setLand] = useState({});
    // console.log(storeId)
    // Runs on page render or when classId changes, but that happens on re-render
    useEffect(() => {
        fetch(`http://localhost:8000/lands/${landId}`)
        .then((body) => body.json())
        .then((json) => setLand(() => json))
        .catch(rejected => console.log(rejected))
    }, [landId]);
    //const handelSubmit = (event) => {
      //  event.preventDefault()
        //landInfo._id = parseFloat(landInfo._id)
        //console.log(landInfo)
        //sendLand()
    //};
    const handleSubmit = (event) => {
        console.log("button pushed")
        event.preventDefault()
        fetch(`http://localhost:8000/lands/`+ land._id, {
            method:'DELETE',
            headers: {
             "Content-Type": "application/json",
           }
        })
        //props.history.push('/lands')

    }

    return (
        <>
        <h1>
            {land.name}
        </h1>
        <h2>
            {land.realm}
        </h2>

        <Link to={`/lands/${landId}/characters`} className="App-link">Characters</Link>

        
        <Link to={`/lands/${land._id}/updateLand`} className="App-link"> Update Land</Link>

        <Link to="/lands" className="App-link"> Back To Lands </Link>
        <button onClick = {handleSubmit}>Delete Me</button>
        </>
    );
}