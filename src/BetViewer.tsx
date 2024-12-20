import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Center, ChakraProvider, HStack, Input, VStack, Table, Spinner, Card, Badge, ListItem, List, Icon, Spacer } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'
import {Divider} from "@chakra-ui/layout"

import {Button} from './components/ui/button';
import {Field} from './components/ui/field'
import { PiArrowArcLeft, PiArrowArcRight, PiX } from 'react-icons/pi';
import {Tooltip} from './components/ui/tooltip'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/tabs"
import { NumberInput } from '@chakra-ui/number-input';
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuMinus, LuPlus } from 'react-icons/lu';
import { isNumberObject } from 'util/types';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [staffName, setStaffName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [addPointAmount, setAddPointAmount] = useState(0);

  const [shopUiEnabled, setShopUiEnabled] = useState(false);
  const [inSalesFront, setInSalesFront] = useState(false);

  const [gamblingLogs, setGamblingLogs] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [transactionStarted, setTransactionStarted] = useState(false);
  const [transactionStudentIdInput, setTransactionStudentIdInput] = useState("");
  const [transactionStudent, setTransactionStudent] = useState<any>(undefined);

  const [currentCart, setCurrentCart] = useState<any[]>([]);
  const [cartTotalCost, setCartTotalCost] = useState(0);

  const [products, setProducts] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [changes, setChanges] = useState<any[]>([]);

  const [displayAmounts, setDisplayAmounts] = useState<number[]>([]);
  const [displayPrices, setDisplayPrices] = useState<number[]>([]);

  const [inventoryChanged, setInventoryChanged] = useState(false);
  const [staffLogs, setStaffLogs] = useState<any[]>([])
  const [staffLogsPageVisible, setStaffLogsPageVisible] = useState(false);
  const [staffLogsPage, setStaffLogsPage] = useState(0);

  const [staffLogsPageCount, setStaffLogsPageCount] = useState(0);
  const [collectionsUiActive, setCollectionsUiActive] = useState(false);

  const [collectionsRecord, setCollectionsRecord] = useState<any>(undefined);
  const [collectionsAddPointAmount, setCollectionsAddPointAmount] = useState(0);

  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [displayLogs, setDisplayLogs] = useState<any[]>([]);

  const [lastCall, setLastCall] = useState(new Date());
  const [val, setVal] = useState(0);

  const url = 'https://hugoacdec.com/api' //'http://127.0.0.1:4000/api'

  async function login() {
    let m = undefined;

    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/staffLogin", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: "hayden",
          accessCode: "AF82C"
        })
      });

      const u = await res.json();
      

      if (u.requestSuccess){
        setLoggedIn(true);
        setStaffName(nameInput);
        setUsers(u.users);

        let q = [];

        for (let i = 0; i < u.users.length; i++){
            const b = await grabGamblingLogs(u.users[i].username);
            
            q[i] = b;
        }

        m = q;
        
        setUserLogs(q);
        
        
        if (nameInput == "salas"){
          await getStaffLogs();
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
      return m;
    }
  }

  async function grabGamblingLogs(username: string) {
    let o = undefined;
    try {
      setAddPointAmount(0)
      setSelectedUser(username)
      setLoading(true)
      const res = await fetch(url + "/gambling/staffGamblingLogs", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          accessCode: "AF82C"
        })
      });

      const u = await res.json();
      

      if (u.requestSuccess){
        o = u.logs.reverse();
        setGamblingLogs(u.logs.reverse());
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
      return o;
    }
  }

  async function addPoints(username: string, points: number, deleteLog?: string) {
    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/addPoints", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          points: points,
          deleteLog: deleteLog,
          staffName: nameInput
        })
      });

      const u = await res.json();


      if (u.requestSuccess){
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  async function loadProducts() {
    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/getProductList", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: nameInput,
          code: accessCodeInput
        })
      });

      const u = await res.json();

      console.log(u);
      

      if (u.requestSuccess){
        setProducts(u.productList);
        console.log(products);
        
        setDisplayAmounts(displayAmounts.fill(0, 0, u.productList.length));
        setDisplayPrices(displayPrices.fill(0, 0, u.productList.length));

        for (let i = 0; i < u.productList.length; i++) {
          displayAmounts[i] = u.productList[i].quantity;
          displayPrices[i] = u.productList[i].price;
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  interface ModifyProductAmountBody {
    username: string,
    accessCode: string,
    productName: string,
    amount: number,
    chargeUser?: string
  }

  async function modifyProductAmount(props: ModifyProductAmountBody) {
    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/modifyProductAmount", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(props)
      });

      const u = await res.json();

      console.log(u);
      

      if (u.requestSuccess){
        setProducts(u.productList);
        console.log(products);
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  interface ModifyProductPriceBody {
    username: string,
    accessCode: string,
    productName: string,
    newPrice: number,
}

async function modifyProductPrice(props: ModifyProductPriceBody) {
  try {
    setLoading(true)
    const res = await fetch(url + "/gambling/modifyProductPrice", {
      method:"POST", 
      headers : {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(props)
    });

    const u = await res.json();

    console.log(u);
    

    if (u.requestSuccess){
      
    }
  } catch (error) {
    
  } finally {
    setLoading(false);
  }
}

  async function loadUser(username: string) {
    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/login", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username
        })
      });

      const u = await res.json();

      if (u.requestSuccess){
        setTransactionStudent(u.user);
        setLoading(false);
        return true;
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  async function getStaffLogs() {
    try {
      setLoading(true)

      const res = await fetch(url + "/gambling/getStaffLogs", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: nameInput,
          accessCode: accessCodeInput,
          page: staffLogsPage
        })
      });

      const u = await res.json();

      if (u.requestSuccess){
        setStaffLogs(u.staffLogList.reverse());
        if (u.pageCount > 0) {
          setStaffLogsPageCount(u.pageCount)
        }
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  
  async function applyChanges() {
    try {
      setLoading(true);

      if (!products) throw new Error("products is undefined");
      

      for (let i = 0; i < products.length; i++) {
        const p = products[i];
  
        if (displayAmounts[i] !== p.quantity){
          console.log('changed ' + p.productName + ' amount by ' + (displayAmounts[i] - p.quantity));
          
          await modifyProductAmount({
            accessCode: accessCodeInput,
            amount: (displayAmounts[i] - p.quantity),
            productName: p.productName,
            username: nameInput
          });
        }
  
        if (displayPrices[i] !== p.price){
          await modifyProductPrice({
            accessCode: accessCodeInput,
            newPrice: displayPrices[i],
            productName: p.productName,
            username: nameInput
          })
        }
  
      }
  
      setDisplayAmounts([]);
      setDisplayPrices([]);
      await loadProducts();
    } catch (error) {
      
    } finally {
      setInventoryChanged(false);
      setLoading(false);
    }
    
  }

  function sleep(milliseconds:number) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  async function update(logsBefore: any[], displayLogsRec: any[]) {
        const u = (await (await fetch(url + "/gambling/staffLogin", {
            method:"POST", 
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: "hayden",
              accessCode: "AF82C"
            })
          })).json()).users;

        let logsAfter = [];

        for (let i = 0; i < u.length; i++) {
            logsAfter[i] = (await (await fetch(url + "/gambling/staffGamblingLogs", {
                method:"POST", 
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  username: u[i].username,
                  accessCode: "AF82C"
                })
              })).json()).logs;

              if (logsBefore[i]) console.log(logsAfter[i].length  + " : " + logsBefore[i].length);
        }
        

        const newLogs:any[] = [];

        for (let i = 0; i < logsBefore.length; i++) {
            if (logsAfter[i].length !== logsBefore[i].length){
                
                
                
                newLogs.push(logsAfter[i][logsAfter[i].length - 1]);
            }
        }

        if (newLogs.length > 0) {
            const o = newLogs;

            displayLogsRec = displayLogsRec.concat(o);
            setDisplayLogs(displayLogsRec);
        }
        

        if (displayLogsRec.length > 14){
            displayLogsRec = displayLogsRec.slice(1);
        }

        

        setDisplayLogs(displayLogsRec);

        setUserLogs(logsAfter);

        setVal(val + 1);

        setTimeout(() => {
            update(logsAfter, displayLogsRec);
        }, 1000);
  }

  async function start() {
    await setNameInput("hayden");
    await setAccessCodeInput("AF82C")
    await login();
    
    update(userLogs, []);
  }

  useEffect(() => {
    start()
  }, [])
    

  return (
      <div className="App">
        <header className="App-header">
            
            <VStack>
                <Center>
                    <VStack>
                        <p style={{fontWeight:600}}>Recent Bets</p>
                        <div style={{maxWidth:'450px', display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
                            <Center>
                                {displayLogs.length > 0 && <div style={{marginLeft:'5px', marginRight:'5px'}}>{displayLogs.reverse().map((v) => {
                                    return (v.winnings !== 0 ? <p>{v.username} <b>{v.winnings > 0 ? "Won" : "Lost"}</b> {Math.abs(v.winnings).toLocaleString()} points</p> : <></>)
                                })}</div>}
                            </Center>
                            
                        </div>

                    </VStack>
                
                </Center>
                
                
            </VStack>
            
        </header>
    </div>
  );
}

export default App;
