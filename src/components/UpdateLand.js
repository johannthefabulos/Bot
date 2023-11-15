import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UpdateLand(){
    const { landId } = useParams();
    console.log(landId)
    const [landInfo, setLandInfo] = useState({
        _id: landId,
        name: "",
        realm: ""
    })

    // console.log(storeId)

    const sendLand = () => {
        fetch(`http://localhost:8000/lands/${landInfo._id}`, {
           method: "PUT",
           body: JSON.stringify(landInfo),
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
        setLandInfo({ ...landInfo, [event.target.name]: event.target.value});
        console.log(landInfo)
    };

    const handelSubmit = (event) => {
        event.preventDefault()
        landInfo._id = parseFloat(landInfo._id)
        console.log(landInfo)
        sendLand()
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
            value = {landInfo.name}
            onChange = {handleChange}
		/>

		</div>
		<div>
		<label htmlFor='health'>Realm</label>
		<input
            type = 'text'
			name='realm'
			placeholder='String'
			value={landInfo.realm}
            onChange = {handleChange}
		/>
		</div>

		<div>
		<button>Update Land</button>
		</div>
	</form>
    <Link to="/lands" className="App-link">Back to Lands</Link>
    </>

       );
}