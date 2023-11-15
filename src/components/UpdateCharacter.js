import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UpdateCharacter(){
    console.log('called updade')
    const { characterId } = useParams();
    const {landId} = useParams(); // could be one of the problems
    const [characterInfo, setCharacterInfo] = useState({
        _id: parseInt(characterId),
        name: "",
        health: parseInt(""),
        strength: parseInt(""),
        land_id: parseInt(landId)
    })

    // console.log(storeId)

    const sendCharacter = () => {
        fetch(`http://localhost:8000/lands/${landId}/characters/${characterId}`, {
           method: "PUT",
           body: JSON.stringify(characterInfo),
           mode: "cors",
           headers: {
             "Content-Type": "application/json",
           },
         })
         .then((res) =>{
           if(res.ok){
             console.log(res.json())
           }
           else throw new Error('error with parsing json')
         })
         .catch((rejected) => {
           console.error("Error detected: ", rejected)
         })
    };

    async function handleChange(event){
        setCharacterInfo({ ...characterInfo, [event.target.name]: event.target.value});
        // console.log(characterInfo)
    };

    // question about this method???
    const handelSubmit = (event) => {
        event.preventDefault()
        characterInfo._id = parseInt(characterInfo._id)
        // console.log(characterInfo)
        sendCharacter()
    };

    return (
        //  <form
<>
	<form onSubmit={handelSubmit}>

		<div>
		<label htmlFor='name'>Name</label>
		<input
           type = 'text' 
			name='name'
			placeholder='String'
            value = {characterInfo.name}
            onChange = {handleChange}
		/>

		</div>
		<div>
		<label htmlFor='health'>health</label>
		<input
            type = 'number'
			name='health'
			placeholder='Int'
			value={characterInfo.health}
            onChange = {handleChange}
		/>
		</div>
		<div>
		<label htmlFor='strength'>strength</label>
		<input
            type = 'number'
			name='strength'
			placeholder='Int'
			value={characterInfo.strength}
            onChange = {handleChange}
		/>
		</div>

		<div>
		<button>Update Character</button>
		</div>
    </form>
    <Link to={`/lands/${landId}/characters`} className="App-link">Back to Characters</Link>
    {/* <Link to='/lands' className="App-link">Back to Lands</Link> */}
    </>

       );
}
