import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from '@material-ui/core';

export default function Character(){
    const { landId, characterId } = useParams();
    const [character, setCharacter] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8000/lands/${landId}/characters/${characterId}`)
        .then((body) => body.json())
        .then((json) => setCharacter(() => json))
        .catch(rejected => console.log(rejected))
    }, [landId, characterId])

    const handelSubmit = (event) => {
        event.preventDefault()
        fetch(`http://localhost:8000/lands/${landId}/characters/${character._id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    return(
        <Card
            style={{
                justifyContent: "center",
                background: "#282c34",
            }}
        >
            <Card
                style={{
                    display: "flex",
                    maxWidth: 600,
                    maxHeight: '80vh',
                    overflow: 'auto',
                    flexDirection: "column",
                    background: "#282c34",
                    color: "#61dafb"
                }}
            >
                <label>
                    Name: {character.name}
                </label>
                <label>
                    Strength: {character.strength}
                </label>
                <label>
                    Health: {character.health}
                </label>
            </Card>
            <Link to="/lands" className="App-link"> Back To Lands </Link>
            <div>
            <Link to={`/lands/${landId}/characters/${characterId}/update`} className="App-link"> Update Character</Link>
            </div>
            <div>
            <button onClick = {handelSubmit}>Delete Me</button>
            </div>
        </Card>
    );
}