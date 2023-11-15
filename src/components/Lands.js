import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from '@material-ui/core';

import '../App.css';
import { Box, Container,Paper,Typography,createTheme, ThemeProvider } from "@mui/material";

export default function Lands(){
    
const serviceList = ['Hello', 'Hello2', 'Hello3'];
const [trade, setTrade] = useState([]);
const [price, setPrice] = useState([])

const theme = createTheme({
    pallete: {
        primary: {
            main:"#f57c00",
        },
        secondary: { 
            main: "#050300",
        }
    },
    typography: {
        h1: {
            color: "#f57c00",
            fontSize: "1.5rem",
            fontFamily: "Arial",
            fontWeight: "600"
        }
    }
})
// Analogous to ComponentDidMount; runs on component's mount and first render; runs once

// useEffect(() => {
//     fetch(`https://api.binance.us/api/v3/trades?symbol=BTCUSDT&limit=1`)
//     .then((body) => body.json())
//     .then((json) => setTrade(() => [...json]))
//     .catch(rejected => console.log(rejected))
// }, [trade]);
return (
    <ThemeProvider theme = {theme}>
        <Container backgroundColor = 'orange'>
            <Box display='flex' gap = {3}flexDirection={"row"}>
            {trade.map((trade) => {
                return (
                    <Paper elevation={6} sx = {{backgroundColor: "grey"}}>
                        <Typography variant="h1">
                            {trade.price}
                        </Typography>
                        <Container >
                        </Container>
                        
                    </Paper>            
            )
            })}
            </Box>
        </Container>
    </ThemeProvider>
    );
}