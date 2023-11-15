import { Box, Container, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LineChart, pieArcLabelClasses } from '@mui/x-charts';
import { extent } from 'd3-array';
import * as d3 from 'd3'
import { transition } from 'd3-transition';
import LineGraph from'./helper.js'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/python/python.js';
import CodeMirror from 'codemirror';
import { io } from "socket.io-client";

export default function Time(){
    const [times, setTimes] = useState([]);
    const [len, setlen] = useState(0)
    const [svgRef, setSvgRef] = useState(useRef())
    const [socket, setSocket] = useState()
    const [codeRun, setCodeRun] = useState([])
    const [my_editor, setEditor] = useState()
    const w = 600;
    const h = 200;
    const myGraph = new LineGraph(h, w, times, svgRef)
    myGraph.initializeGraph()
    useEffect(() => {
        const initializeSocket = () => {
          const mySocket = io('http://localhost:5001', {
            transports: ['websocket'],
            cors: {
              origin: 'http://localhost:3000',
            },
          });
    
          mySocket.on('disconnect', () => {
            console.log('Disconnected from the WebSocket server');
          });
    
          mySocket.on('connect', () => {
            console.log('Connected to the WebSocket server');
          });
    
          mySocket.on('data', (data) => {
            console.log('Received data from the server:', data);
            // Handle the received data as needed
            debugger;
            setCodeRun(String([data.data]))
          });
    
          setSocket(mySocket);
        };
    
        initializeSocket();
      }, []);
    // ...
    const editorRef = useRef(null);
    const handleClick = () => {
        // Assuming my_editor is your code editor reference
        let textContent = my_editor.getValue();
        socket.emit('data', textContent);
      };

    useEffect(() => {
        if (editorRef.current) {
        const editor = CodeMirror(editorRef.current, {
            mode: 'python',
            theme: 'material',
            lineNumbers: true,
        });
        const initialCode = 
`import os
import sys
from threading import Lock
        
sys.path.insert(0,os.getcwd())
import copy
import threading
from datetime import datetime, timedelta
from decimal import Decimal
        
import numpy as np
import pandas as pd
import pandas_ta as ta
        
from exchanges import Exchange
from exchanges.Exchange import Candle
from manage.managetrades import get_amount, suggested_trade
from tests.Strats import Permutation, generic_strat
from tests.limit_strats import generic_limit_strat
class avg_strat_tiers(generic_limit_strat):\n\tdef __init__(self, exchange, account, manager_id, fucn, symbol, percent_to_manage, start_time_iso):
        \tself.exchange = exchange
        \tself.account = account
        \tself.manager_id = manager_id
        \tself.fucn = fucn
        \tself.symbol = symbol
        \tself.percent_to_manage = percent_to_manage
        \tself.start_time_iso = start_time_iso`;
        editor.setValue(initialCode);
        setEditor(editor)
    }
    }, []);
    
    

    useEffect(() => {
        fetch(`http://localhost:8000/times`)
        .then((body) => body.json())
        .then((json) => setTimes(() => [...json]))
        .then(times.forEach(d => {
            d.name = new Date(d.name)
        }))
        
        .catch(rejected => console.log(rejected))
    }, [len]);

    useEffect(() => {
        myGraph.setTimes(times)
        setSvgRef(myGraph.drawChart())
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setlen(len + 1);
        },500)
        return () => clearTimeout(timer);
    })
    useEffect(() => {
        myGraph.setTimes(times)
        myGraph.updateAgain()
    }, [times.length])
    return (
        <div>
            <Typography key = {times.length}>
                {times.length}
            </Typography>
            <Typography p={6}>
              {codeRun}
            </Typography>
            <Container display = 'flex' flexDirection={'column'} justifyContent={'center'}>
                <svg ref = {svgRef}></svg>
            </Container>
            <div ref={editorRef} style={{ height: '100px' }}></div>
            <Button onClick={handleClick} variant="contained">Contained</Button>
         </div>
    )
}