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
  const [myGraph, setMyGraph] = useState(new LineGraph(h, w, times, svgRef))
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
      mySocket.on('btc', (my_data) => {
        console.log('Received data from the server:', my_data);
        // Handle the received data as needed
        setTimes(times.append(my_data))
      });
      setSocket(mySocket);
    };
    
    initializeSocket();
  }, []);
  // useEffect(() => {
    //   const initializeSocket = () => {
      //     const mySocket = io('http://localhost:5002', {
        //       transports: ['websocket'],
        //       cors: {
          //         origin: 'http://localhost:3000',
          //       },
          //     });
          //     mySocket.on('disconnect', () => {
            //       console.log('Disconnected from the WebSocket server');
            //     });
            
            //     mySocket.on('connect', () => {
              //       console.log('Connected to the WebSocket server');
              //     });
              
              //     mySocket.on('btc', (my_data) => {
                //       console.log('Received data from the server:', my_data);
                //       // Handle the received data as needed
                //       setTimes(times.append(my_data))
                //     });
                //     setSocket(mySocket);
                //   };
                
                //   initializeSocket();
                // }, []);
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

#from manage.managetrades import stored_trade
from tests.Strats import Permutation, generic_strat
from tests.limit_strats import generic_limit_strat

class avg_strat_tiers(generic_limit_strat):
    def __init__(self, exchange, account, manager_id, fucn, symbol, percent_to_manage, start_time_iso):
        self.ema_price = None
        self.account = account
        super().__init__('avg_limit_strat')
        #self.params['increment'] = [1.015]
        self.params['lookback'] = 5
        self.params['percent_loss'] = [0.9999]
        #self.params['global_lookback'] = [100]
        self.params['buy_tiers'] = [7]
        self.params['max_buydown'] = [0.005]
        self.params['ema_periods'] = 5
        self.params['percent_up_modifier'] = 0.5
        self.list_of_amt_objs = []
        #fucn = lambda x: x ** 2
        self.buy_tiers, self.sell_tiers = self.get_tiers(self.params['buy_tiers'], self.params['max_buydown'], fucn)
        self.len_amt_objects = len(self.buy_tiers)-1
        self.exchange = exchange
        self.set_manager_id = manager_id
        self.symbol = symbol
        self.percent_to_manage = percent_to_manage
        self.list_of_accepted_currencies = ['USD', 'USDT', 'BTC', 'ETH']
        self.amt_to_manage, _, _ = self.account.amount_of_total_funds_to_handle(percent=self.percent_to_manage, time_iso=start_time_iso, end_currency=self.symbol, list_of_accepted_currencies=self.list_of_accepted_currencies)
        self.custom_id = 0
        self.final_price_and_volume = self.get_info_for_tiers(now_iso_format=start_time_iso, amt_to_manage=self.amt_to_manage)
        self.helper_make_amt_objs()
        self.place_buy_lock = Lock()
        self.TOLERANCE = .0001
        self.testing = False
        self.now_iso_format = None
        self.use_supertrend = True
        self.simulating = False
        self.df = None

    def helper_total_periods_passed(self, date_time_object_start, date_time_object_end, period_len_minutes):
        time_passed_delta = date_time_object_end - date_time_object_start
        return ((time_passed_delta.total_seconds()/60)//period_len_minutes)

    def helper_make_amt_objs(self):
        for i in range(len(self.final_price_and_volume)):
            current_obj = get_amount(symbol=self.symbol, amount_to_manage=self.final_price_and_volume[i][1],custom_id=self.custom_id, manager_id=self.set_manager_id, additional_info=['tiers', str(i)])
            self.custom_id+=1
            self.list_of_amt_objs.append(current_obj)

    def get_all_amt_objects(self):
        return self.list_of_amt_objs

    def get_info_for_tiers(self, now_iso_format, amt_to_manage):
        if not isinstance(now_iso_format, datetime):
            now_iso_format = datetime.fromisoformat(now_iso_format)
        start_time_iso = datetime.isoformat(now_iso_format - timedelta(seconds=(self.params['ema_periods']*7)*60))
        total_b = amt_to_manage
        history, _ = self.exchange.get_candles_on_timestamps(symbol=self.symbol, start_date_iso=start_time_iso, end_date_iso=now_iso_format, period_len_minutes=self.params['ema_periods'])
        data_pd_format = pd.DataFrame.from_records(candle.to_dict() for candle in history[list(history.keys())[0]])
        averages = self.get_ema(data_pd_format=data_pd_format)
        self.ema_price = averages.iloc[-1]
        final_price_and_volume1 = []
        for percent_ema_vol in self.buy_tiers:
            first_element = Decimal(percent_ema_vol[0])*Decimal(self.ema_price)
            second_element = Decimal(percent_ema_vol[1])*Decimal(total_b)
            final_price_and_volume1.append([first_element, second_element])
        return final_price_and_volume1

    def get_list_of_suggested_trades(self):
        all_lists_of_suggested_trades = []
        total_amt = 0
        for amt_obj in self.list_of_amt_objs:
            amt_object_suggested_trades = amt_obj.get_size_buy_sell()
            for trade in amt_object_suggested_trades:
                total_amt += Decimal(trade.total_amt)
            all_lists_of_suggested_trades.append(amt_object_suggested_trades)
        return all_lists_of_suggested_trades, total_amt


    def order_sell_handler(self, trade, editable_trade, now_iso_format, current_price):
        used_price = current_price
        if trade.price == -1:
            print('first sell')
            tier_assignment = Decimal(self.final_price_and_volume[trade.tier_assigned][0])
            ema_price = self.ema_price
            percent_modifier = Decimal(self.params['percent_up_modifier'])
            tester = Decimal(Decimal(ema_price) + tier_assignment)  * percent_modifier
            trade.price = tester
            trade.last_date_modified = now_iso_format
            trade.original_price = trade.price
            editable_trade.original_price = trade.price
            editable_trade.price = trade.price
            editable_trade.last_time_modified = now_iso_format
            if self.testing:
                trade.price = used_price + 5
                editable_trade.price = trade.price
        else:
            self.sell_decay(trade, editable_trade, now_iso_format, current_price)

    def sell_decay(self, trade, editable_trade, now_iso_format, current_price):
        print('second sell')
        parent_id_timestamp = datetime.fromisoformat(editable_trade.parent_timestamp)
        total_periods_passed = self.helper_total_periods_passed(parent_id_timestamp, datetime.fromisoformat(now_iso_format), self.params['lookback'])
        trade.price = trade.original_price * pow(Decimal(self.params['percent_loss']), Decimal(total_periods_passed))
        editable_trade.last_time_modified = now_iso_format
        editable_trade.price = trade.price
        if self.testing:
            trade.price = current_price + 5
            editable_trade.price = trade.price

    def order_buy_handler(self, trade, editable_trade, now_iso_format, current_price):
        trade.price = self.final_price_and_volume[trade.tier_assigned][0]
        editable_trade.last_time_modified = now_iso_format
        editable_trade.price = trade.price
        if self.testing:
            trade.price = current_price - 5
            editable_trade.price = trade.price

    def check_all_amts_against_total(self, amt_allowed):
        total_addition = 0
        for idx, amt_obj in enumerate(self.list_of_amt_objs):
            amt_obj.set_amt_to_manage(self.final_price_and_volume[amt_obj.tier_assigned][1])
            total_1, obj_amt_to_manage = amt_obj.consider_amt()
            total_addition += obj_amt_to_manage
        if abs(total_addition-amt_allowed) >= self.TOLERANCE:
            raise ValueError('Too much or too little allocated')

    def get_all_suggested_trades_one_list(self):
        all_suggested_trades, total_amt = self.get_list_of_suggested_trades()
        suggested_trades = []
        for every_list in all_suggested_trades:
            for trade in every_list:
                suggested_trades.append(trade)
        return copy.deepcopy(suggested_trades), suggested_trades

    def prepare_and_check_before_decision(self):
        amount, current_price, total = self.account.amount_of_total_funds_to_handle(percent=self.percent_to_manage, time_iso=self.now_iso_format, end_currency=self.symbol, list_of_accepted_currencies=self.list_of_accepted_currencies)
        self.amt_to_manage = amount
        self.final_price_and_volume = self.get_info_for_tiers(now_iso_format=self.now_iso_format, amt_to_manage=self.amt_to_manage)
        self.check_all_amts_against_total(amount)
        one_list, suggested_trades = self.get_all_suggested_trades_one_list()
        if self.testing:
            one_list = one_list[:1]
            suggested_trades = suggested_trades[:1]
        return one_list, suggested_trades, current_price

    def sort_through_trades(self, one_list, amt_obj):
        amt_obj_trades = []
        for trade in one_list:
            if trade.amt_id == amt_obj.amt_obj_id:
                amt_obj_trades.append(trade)
        return amt_obj_trades

    def decision(self, now_iso_format, amt_obj=None):
        self.now_iso_format = now_iso_format
        with self.place_buy_lock:
            final_list = []
            final_list_editable = []
            one_list, suggested_trades, current_price = self.prepare_and_check_before_decision()
            if amt_obj:
                one_list = self.sort_through_trades(one_list, amt_obj)
            for idx, trade in enumerate(one_list):
                editable_trade = suggested_trades[idx]
                if trade.side == 'buy':
                    self.order_buy_handler(trade, editable_trade, now_iso_format, current_price)
                if trade.side == 'sell':
                    self.order_sell_handler(trade, editable_trade, now_iso_format, current_price)                
                if trade.side == 'buy' and current_price < trade.price:
                    continue
                else:
                    final_list.append(trade)
                    final_list_editable.append(suggested_trades[idx])
        if self.use_supertrend:
            difference = self.get_supertrend(now_iso_format)
        really_final = []
        really_final_editable = []
        if self.use_supertrend:
            for idx, trade in enumerate(final_list):
                # if trade.price < 1  :
                #     pass
                if abs(difference) < 1:
                    really_final.append(trade)
                    really_final_editable.append(final_list_editable[idx])
                elif difference < 0 and trade.side == 'sell':
                    really_final.append(trade)
                    really_final_editable.append(final_list_editable[idx])
            if really_final is not None:
                final_list = really_final
                final_list_editable = final_list_editable
        return final_list, final_list_editable

    def get_supertrend(self, now_iso_format):
        if now_iso_format == '2023-04-07T01:55:00+00:00':
            hello = 'hello'
        print(now_iso_format, 'mmm')
        start_time_iso = datetime.isoformat(datetime.fromisoformat(now_iso_format) - timedelta(seconds = 11*self.params['lookback']*60))
        history, _ = self.exchange.get_candles_on_timestamps(symbol=self.symbol, start_date_iso=start_time_iso, end_date_iso=now_iso_format, period_len_minutes=5)
        df = pd.DataFrame.from_records(candle.to_dict() for candle in history[self.params['lookback']])
        st = ta.supertrend(df['high'], df['low'], df['close'], 10, 2)
        print('st: ', st)
        print('df: ', df)
        # slope = self.calculate_slope(data=st, supertrend_column='SUPERT_10_2.0', start_idx=20, end_idx=len(st)-1)
        difference = st.iloc[-2]['SUPERT_10_2.0']-st.iloc[-1]['SUPERT_10_2.0']
        return difference

    def calculate_slope(self, data, supertrend_column, start_idx, end_idx):
        x = np.arange(start_idx, end_idx +1)
        y = data.iloc[start_idx:end_idx + 1][supertrend_column].values

        slope, _ = np.polyfit(x, y, 1)
        return slope

    def get_ema(self, data_pd_format):
        while len(data_pd_format.index) < self.params['ema_periods'] + 1:
            last_line = data_pd_format.iloc[-1]
            data_pd_format = data_pd_format.append(last_line)
        averages = pd.Series(data_pd_format['open'].ewm(span=self.params['ema_periods'], min_periods=self.params['ema_periods']).mean(), name='EMA')
        return averages

    def get_tiers(self, tiers_on_each_side, max_percent_change, volume_funct):
        # Get individual limit tiers from the number of tiers, the maximum distance from the current price,
        #   and a function to fit the volume units
        # Returns a dictionary representing the buy/sell prices (keys) and their volumes (values)
        #   as a percentage of total volume available
        if isinstance(tiers_on_each_side, list):
            tiers_on_each_side = tiers_on_each_side[0]
        if isinstance(max_percent_change, list):
            max_percent_change = max_percent_change[0]
        volumes = [volume_funct(i) for i in range(1, tiers_on_each_side + 1)]
        # Scale volumes to be a percent
        total = sum(volumes)
        volumes = [volume / total for volume in volumes]

        percent_at_a_time = max_percent_change / tiers_on_each_side
        sell_tiers = [1.0 + percent_at_a_time * i for i in range(1, tiers_on_each_side + 1)]
        buy_tiers = [1.0 - percent_at_a_time * i for i in range(1, tiers_on_each_side + 1)]
        return list(zip(buy_tiers, volumes)), list(zip(sell_tiers, volumes))

          `;
          editor.setValue(initialCode);
          setEditor(editor)
        }
      }, []);
      
      
    useEffect(() => {
      myGraph.initializeGraph()

    },[])
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
        times.forEach(d => {
          d.name = new Date(d.name)
        })
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