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

  const [inventory, setInventory] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  async function update(scrollPos: number, goingUp: boolean) {
        await loadProducts();

        window.scroll({ behavior: 'smooth', top:scrollPos})

        // 3105
        
        if (scrollPos <= 50 && goingUp) goingUp = false;
        if (scrollPos >= 3105 && !goingUp) goingUp = true;

        setTimeout(() => {
            update(scrollPos + (50 * (goingUp ? -1 : 1)), goingUp);
        }, 1000);
  }

  async function start() {
    await setNameInput("hayden");
    await setAccessCodeInput("AF82C")
    
    update(5, false);

    
  }

  useEffect(() => {
    start()
  }, [])
    

  return (
      <div className="App">
        <header className="App-header">
            <div style={{padding:'20px'}}>
        {
            products.length > 0 && products.map((v, i) => {
                const a = products[i];
                const b = products[i + 1];
                const c = products[i + 2];

                return (
                i % 3 === 0 ? <HStack style={{minWidth:'1100px', maxWidth:'1100px', marginBottom:'10px'}}>
                    {a && <Card.Root borderRadius={'4px'} style={{backgroundColor:'#FFFFFF', color:'black', width:'33%', minHeight:'290px'}}>
                    <Card.Header style={{backgroundColor:'#FFFFFF', padding:'10px', borderRadius:'4px', fontWeight:600}}>
                        <p style={{fontSize:24}}>{a.productName}</p>
                        <HStack>
                            {a.quantity <= 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Out of Stock</Badge>}
                            {a.quantity > 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>In Stock</Badge>}
                            {a.quantity > 15 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>High Quantity</Badge>}
                            {a.quantity < 5 && a.quantity > 0  &&<Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Limited Supply</Badge> }
                            {a.amountSold > 10 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Popular Item</Badge>}
                        </HStack>
                        
                        </Card.Header>
                        <Card.Body>
                        <VStack style={{textAlign:'left',justifyContent:'left',  margin:'auto', padding:'auto', marginLeft:'0px'}}>
                            <p style={{width:'200px', fontWeight:600}}>{a.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                            <p style={{width:'200px'}}>{a.quantity + " " + (a.quantity !== 1 ? "items" : "item")}</p>
                        </VStack>
                        
                        </Card.Body>
                        <Card.Footer>
                            <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>{a.amountSold} Sold</Badge>
                        </Card.Footer>
                    
                    </Card.Root>}
                    {b && <Card.Root borderRadius={'4px'} style={{backgroundColor:'#FFFFFF', color:'black', width:'33%', minHeight:'290px'}}>
                    <Card.Header style={{backgroundColor:'#FFFFFF', padding:'10px', borderRadius:'4px', fontWeight:600}}>
                        <p style={{fontSize:24}}>{b.productName}</p>
                        <HStack>
                            {b.quantity <= 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Out of Stock</Badge>}
                            {b.quantity > 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>In Stock</Badge>}
                            {b.quantity > 15 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>High Quantity</Badge>}
                            {b.quantity < 5 && b.quantity > 0 &&<Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Limited Supply</Badge> }
                            {b.amountSold > 10 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Popular Item</Badge>}
                        </HStack>
                        
                        </Card.Header>
                        <Card.Body>
                        <VStack style={{textAlign:'left',justifyContent:'left',  margin:'auto', padding:'auto', marginLeft:'0px'}}>
                            <p style={{width:'200px', fontWeight:600}}>{b.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                            <p style={{width:'200px'}}>{b.quantity + " " + (b.quantity !== 1 ? "items" : "item")}</p>
                        </VStack>
                        
                        </Card.Body>
                        <Card.Footer>
                            <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>{b.amountSold} Sold</Badge>
                        </Card.Footer>
                    
                    </Card.Root>}
                    {c && <Card.Root borderRadius={'4px'} style={{backgroundColor:'#FFFFFF', color:'black', width:'33%', minHeight:'290px'}}>
                    <Card.Header style={{backgroundColor:'#FFFFFF', padding:'10px', borderRadius:'4px', fontWeight:600}}>
                        <p style={{fontSize:24}}>{c.productName}</p>
                        <HStack>
                            {c.quantity <= 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Out of Stock</Badge>}
                            {c.quantity > 0 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>In Stock</Badge>}
                            {c.quantity > 15 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>High Quantity</Badge>}
                            {c.quantity < 5 && c.quantity > 0  &&<Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Limited Supply</Badge> }
                            {c.amountSold > 10 && <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>Popular Item</Badge>}
                        </HStack>
                        
                        </Card.Header>
                        <Card.Body>
                        <VStack style={{textAlign:'left',justifyContent:'left',  margin:'auto', padding:'auto', marginLeft:'0px'}}>
                            <p style={{width:'200px', fontWeight:600}}>{c.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                            <p style={{width:'200px'}}>{c.quantity + " " + (c.quantity !== 1 ? "items" : "item")}</p>
                        </VStack>
                        
                        </Card.Body>
                        <Card.Footer>
                            <Badge style={{width:'fit-content', padding:'4px', paddingRight:'8px', paddingLeft:'8px', textAlign:'center'}}>{c.amountSold} Sold</Badge>
                        </Card.Footer>
                    
                    </Card.Root>}
                    </HStack>
                :
                <></>
                )})
            }
            </div>
            
        </header>
    </div>
  );
}

export default App;
