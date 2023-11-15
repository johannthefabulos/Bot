import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from '@material-ui/core';
import "../App.css"
export default function Characters(){
    const { landId } = useParams();
    const [characters, setCharacters] = useState([]);

    // Runs on page render or when classId changes, but that happens on re-render
    useEffect(() => {
        fetch(`http://localhost:8000/lands/${landId}/characters`)
        .then((body) => body.json())
        .then((json) => setCharacters(() => [...json.characters]))
        .catch(rejected => console.log(rejected))
    }, [landId]);

    return (
        <>
            <h1>Characters Whom Reside in This Land</h1>
                <ul>
                    {characters.map((character) => (
                        <li key={character._id}>
                            <Link 
                            to={`/lands/${character.land_id}/characters/${character._id}`} className="App-link">
                                {character.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            <Link to={`/lands/${landId}/characters/new`} className="App-link">Add New Character</Link>
            <Link to="/lands" className="App-link"> Back To Lands </Link>
        </>
    );
}