import React, { useState } from 'react';
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

  const url = 'http://127.0.0.1:4000/api'

  async function login() {
    try {
      setLoading(true)
      const res = await fetch(url + "/gambling/staffLogin", {
        method:"POST", 
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: nameInput,
          accessCode: accessCodeInput
        })
      });

      const u = await res.json();

      console.log(u);
      

      if (u.requestSuccess){
        setLoggedIn(true);
        setStaffName(nameInput);
        setUsers(u.users);
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  async function grabGamblingLogs(username: string) {
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
          accessCode: accessCodeInput
        })
      });

      const u = await res.json();

      if (u.requestSuccess){
        setGamblingLogs(u.logs.reverse());
        setUsers(u.users);
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
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
          deleteLog: deleteLog
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
    

  return (
      <div className="App">
        <header className="App-header">
        {!loggedIn ?
          <Center>
            <VStack>
              <h1 style={{marginBottom:'10px'}}>Staff Login (The Salas Casino)</h1>
              <Input onChange={(e) => {
                setNameInput(e.target.value); 
              }} disabled={loading} borderColor={'#FFFFFF'} placeholder='Your Name' />
              <Input onChange={(e) => {
                setAccessCodeInput(e.target.value); 
              }} disabled={loading} borderColor={'#FFFFFF'} placeholder='Access Code' />
              <Button onClick={() => {
                login();
              }} loading={loading} style={{marginTop:'20px'}}>Login</Button>
            </VStack>
          </Center>
          :
          !shopUiEnabled ?
          <Center>
             <VStack>
              <h1 style={{marginBottom:'10px'}}>Staff Interface</h1>
              <Button onClick={() => {setShopUiEnabled(true); loadProducts()}} style={{marginBottom:'20px'}}>Take Me To The Shop UI</Button>
              {users && 
                <VStack>
                  {users.map((v) => {
                    return (
                      <div style={{minWidth:'450px', maxWidth:'450px', backgroundColor:'#333333', borderRadius:'12px'}}>
                        <HStack style={{padding:'10px'}}>
                          <p style={{textAlign:'left', paddingLeft:'10px'}}>{v.username}</p>
                          <HStack style={{justifyContent:'right', margin:'auto', marginRight:'0px'}}>
                            <p style={{textAlign:'right', marginRight:'0px'}}>{v.balance}</p>
                            <Button onClick={() => {
                              setGamblingLogs([]);
                              grabGamblingLogs(v.username);
                            }} style={{textAlign:'right', justifyContent:'right', margin:'auto', marginRight:'0px'}}>View</Button>
                          </HStack>
                          
                        </HStack>

                        
                        {selectedUser == v.username && 
                        <>
                        
                        <Center>
                          <VStack>
                          <p>Add Points</p>
                          <p style={{fontSize:11}}>ALL POINT TRANSACTIONS ARE RECORDED AND FOUL PLAY WILL RESULT IN PUNISHMENT</p>
                          <Input onChange={(e) => {
                            setAddPointAmount(Number.parseInt(e.target.value));
                          }} style={{width:'50%', borderColor:'#FFFFFF'}} placeholder='Amount'/>
                          <Button onClick={async () => {
                            if (addPointAmount === 0) return;
                            await addPoints(v.username, addPointAmount);
                            await grabGamblingLogs(v.username);
                          }}>Add Points</Button>
                          </VStack>
                        </Center>
                        <Center>
                          <HStack style={{marginTop:'25px', marginBottom:'10px'}}>
                            <p >Previous Bets</p>
                            <Tooltip positioning={{placement:'right'}} openDelay={0.1} content={'Refresh bets'}>
                            <IconButton style={{marginRight:'-20px', marginLeft:'20px'}} onClick={() => {grabGamblingLogs(v.username)}}><PiArrowArcRight/></IconButton>
                            </Tooltip>
                            
                          </HStack>
                        </Center>
                        
                        
                        {gamblingLogs && gamblingLogs.length > 0 && gamblingLogs.map((l) => {
                          if (l.winnings === 0) return <></>
                          return <div style={{marginLeft:'100px',left:'0px', marginBottom:'10px'}}>
              
                            <HStack style={{left:'0px'}}>
                              <VStack>
                              <p style={{width:'200px'}}><b>{l.shopRelated ? l.winnings < 0 ? 'Spent' : 'Refunded' : l.winnings < 0 ? 'Lost' : 'Won'}</b> {Math.abs(l.winnings)}</p>
                              {l.time && <p style={{fontSize:12, top:'2px', color:'#AAAAAA', marginTop:'-10px'}}>Bet {new Date(new Date().getTime() - new Date(l.time).getTime()).getMinutes() === 0 && new Date(new Date().getTime() - new Date(l.time).getTime()).getHours() === 0 ? "less than a minute ago" : (new Date(new Date().getTime() - new Date(l.time).getTime()).getHours() > 0 ? new Date(new Date().getTime() - new Date(l.time).getTime()).getHours() + " hours and " : "") + new Date(new Date().getTime() - new Date(l.time).getTime()).getMinutes() + " minutes ago"}</p>}
                              </VStack>
                            
                            <Tooltip positioning={{placement:'right'}} openDelay={0.1} content={"Reverse " + (l.shopRelated ? 'Purchase' : 'Bet') + " (" + (l.winnings < 0 ? 'Add ' + Math.abs(l.winnings).toString() + ' to their account' : 'Remove ' + Math.abs(l.winnings).toString() + ' from their account') + ")"}>
                              <IconButton disabled={loading} style={{}} onClick={async () => {
                                await addPoints(v.username, -(l.winnings as number), l._id);
                                setUsers(users.map((c) => {
                                  if (c.username == v.username){
                                    c.balance += (-(l.winnings as number));
                                    return c;
                                  }else{
                                    return c;
                                  }
                                
                                }))
                                await grabGamblingLogs(v.username);
                              }}><PiX/></IconButton>
                            </Tooltip>
                          </HStack>
                          


                          </div>
                        })}
                        </>
                        
                        }
                          
                      </div>)
                  })}
                </VStack>
              }
            </VStack>
          </Center>

          :
          <Center>
            <VStack>
              <HStack style={{marginTop:'40px'}}>
                <Button onClick={() => {setInSalesFront(false); loadProducts()}}>Manage Inventory</Button>
                <Button onClick={() => {setInSalesFront(true); loadProducts()}}>Manage Sales</Button>
                <Button onClick={() => {setInSalesFront(false); setShopUiEnabled(false)}}>Return To Point Management</Button>
              </HStack>

              {!inSalesFront ? <><p style={{marginTop:'20px'}}>Manage Inventory</p>
              
              {loading && <Spinner/>}
              
              <div>
              {inventoryChanged && <Button loading={loading} onClick={() => {applyChanges();}}>Apply Changes</Button>}
              {products && products.length > 0 && <Table.Root size={"lg"} borderRadius={20} style={{width:'600px',  margin:'auto', marginBottom:'60px', marginTop:'40px', borderRadius:'20px', height:'90px', backgroundColor:'#494846'}}>
                                  <Table.Header>
                                      <Table.Row style={{backgroundColor:'#494846', color:'white'}}>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Product Name</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Quantity</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Price</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}} textAlign="end">Amount Sold</Table.ColumnHeader>
                                      </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                  {products.length > 0 && products.map((v, m) => {
                                    return (<Table.Row><Table.Cell>{v.productName}</Table.Cell>
                                    {displayAmounts && <Table.Cell>{displayAmounts && <Input readOnly={loading} type='number' onChange={async (e) => {
                                      let a = e.target.value === "" ? 0 : Number.parseInt(e.target.value);
                                      
                                      if (isNaN(a)) return;

                                      setDisplayAmounts(displayAmounts.map((v, i) => {
                                        if (i === m && !isNaN(a)) {
                                          return a;

                                        }else{
                                          return v;
                                        }
                                      }))

                                      setInventoryChanged(true);
                                    }} value={displayAmounts[m]}/>}</Table.Cell>}
                                    <Table.Cell><Input readOnly={loading} type='number' onChange={async (e) => {
                                      let a = e.target.value === "" ? 0 : Number.parseInt(e.target.value);

                                      if (isNaN(a)) return;

                                    setDisplayPrices(displayPrices.map((v, i) => {
                                      if (i === m && !isNaN(a)) {
                                        return a;

                                      }else{
                                        return v;
                                      }
                                    }))

                                    setInventoryChanged(true);

                                    }} value={displayPrices[m]}/></Table.Cell>
                                    <Table.Cell textAlign="end">{v.amountSold}</Table.Cell></Table.Row>)
                                  })}
                                  </Table.Body>
                          </Table.Root>}
                          </div></>
                          :
                          <div style={{marginTop:'20px'}}>
                          {transactionStarted && transactionStudent ?
                          <VStack style={{width:'1200px', padding:'20px'}}>
                            <div style={{minWidth:'95%', backgroundColor:'#FFFFFF', height:'300px', borderRadius:'6px', marginBottom:'100px'}}>
                              <VStack> 
                                <p style={{color:'black', fontWeight:600, fontSize:30, textAlign:'left', margin:'auto', marginLeft:'2%', marginTop:'1%'}}>Shop Transaction for Student: {transactionStudentIdInput} ({currentCart.length} Items)</p>
                                <div style={{width:'90%', height:'2px', backgroundColor:'black', marginLeft:'0px', left:'0px', marginRight:'6%'}}/>
                                <HStack style={{width:'1200px'}}>
                                <div style={{display:'flex', flexWrap:'wrap', textAlign:'left', padding:'20px', fontSize:20, maxHeight:'220px', overflow: 'scroll', scrollbarColor:'#000000', width:'65%', maxWidth:'65%'}}>
                                {currentCart.length > 0 && currentCart.map((v, i) => {
                                    if (currentCart.indexOf(v) !== i){
                                      return <></>
                                    }

                                    return <div style={{color:'white', left:'10px', marginLeft:'-39%', width:'300px', margin:'10px'}}>
                                      <div style={{width:'100%', backgroundColor:'black', padding:'10px', borderRadius:'4px'}}>
                                        <VStack>
                                        <p style={{textAlign:'left', marginLeft:'0px', fontWeight:600}}>{v.productName}</p>
                                        <HStack>
                                          <Button style={{borderRadius:'100px', width:'20px', height:'30px'}} onClick={() => {
                                            const o  = currentCart;

                                            o.push(v);

                                            setCurrentCart(o);
                                            v.quantity -= 1;
                                            setCartTotalCost(cartTotalCost + v.price);
                                          }}><LuPlus style={{width:'17px', height:'17px'}}/></Button>
                                          {currentCart.filter((x) => {
                                          return v.productName == x.productName;
                                        }).length }
                                        <Button style={{borderRadius:'100px', width:'20px', height:'30px'}} onClick={() => {
                                            const o  = currentCart;
                                            const t = o.indexOf(v);

                                            setCurrentCart(o.filter((z, n) => {
                                                return n !== t;
                                            }));

                                            v.quantity += 1;

                                            setCartTotalCost(cartTotalCost - v.price)
                                          }}><LuMinus style={{width:'17px', height:'17px'}}/></Button>
                                        </HStack>
                                        
                                       {/* <Button style={{backgroundColor:'black', color:'white', position:'absolute', right:'55%'}} onClick={() => {
                                          let o = currentCart;

                                          o = o.filter((x, b) => {
                                            return b !== i;
                                          })

                                          setCartTotalCost(cartTotalCost - v.price);

                                          setCurrentCart(o);
                                        }}>Remove One From Cart</Button>*/}
                                        </VStack>
                                        
                                      </div>
                                     
                                    </div>
                                  })}

                                </div>

                                <VStack style={{justifyContent:'right', margin:'auto'}}>
                                  <p style={{color:'black', fontWeight:600}}>Total: {cartTotalCost} points</p>
                                  <p style={{marginBottom:'50px', fontSize:11, color:'#777777', width:'100%'}}>Student will have {transactionStudent.balance - cartTotalCost} points remaining after this transaction</p>
                                  <Button style={{backgroundColor:'#000000', color:'white', width:'200px'}} onClick={() => {
                              loadProducts();
                              setTransactionStudentIdInput("");
                              setTransactionStarted(false);
                              setCartTotalCost(0)
                            }}>Cancel Transaction</Button>
                                  <Button style={{backgroundColor:'#000000', color:'white', width:'200px'}} disabled={transactionStudent.balance - cartTotalCost < 0} onClick={() => {
                            let seenProducts:any[] = []

                            currentCart.map(async (v) => {
                              if (seenProducts.includes(v)) return undefined;
                              
                              await modifyProductAmount({
                                accessCode: accessCodeInput,
                                amount: currentCart.filter((x) => {
                                  return v.productName == x.productName;
                                 }).length * -1,
                                 productName: v.productName,
                                 username: nameInput,
                                 chargeUser: transactionStudentIdInput
                              });

                              seenProducts.push(v);
                            })

                            loadProducts();
                            setTransactionStudentIdInput("");
                            setTransactionStarted(false);
                            setCartTotalCost(0)
                            
                          }}>Checkout</Button>
                                </VStack>
                                </HStack>
                              </VStack>
                              
                            </div>
                          
                            

                              {
                                products.length > 0 && products.map((v, i) => {
                                  const a = products[i];
                                  const b = products[i + 1];
                                  const c = products[i + 2];

                                  return (
                                    i % 3 === 0 ? <HStack style={{minWidth:'1100px', maxWidth:'1100px'}}>
                                        {a && <Card.Root borderRadius={'4px'} style={{backgroundColor:'#FFFFFF', color:'black', width:'33%', minHeight:'290px'}}>
                                        <Card.Header style={{backgroundColor:'#FFFFFF', padding:'10px', borderRadius:'4px', fontWeight:600}}>
                                            <p style={{fontSize:24}}>{a.productName + (currentCart.filter((v) => {return v === a}).length > 0 ? " - " + currentCart.filter((v) => {return v === a}).length + " In Cart" : "")}</p>
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
                                              <p style={{width:'200px'}}>{a.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                                              <p style={{width:'200px'}}>{a.quantity + " " + (a.quantity > 1 ? "items" : "item")}</p>
                                            </VStack>
                                            
                                          </Card.Body>
                                          <Card.Footer>
                                            <Button disabled={a.quantity <= 0} style={{backgroundColor:'black', color:'white'}} onClick={() => {
                                      const o = currentCart
                                      o.push(a);
                                      setCurrentCart(o);

                                      a.quantity -= 1;

                                      setCartTotalCost(cartTotalCost + a.price);
                                    
                                    }}>Add to cart</Button>
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
                                              <p style={{width:'200px'}}>{b.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                                              <p style={{width:'200px'}}>{b.quantity + " " + (b.quantity === 1 ? "items" : "item")}</p>
                                            </VStack>
                                            
                                          </Card.Body>
                                          <Card.Footer>
                                            <Button disabled={b.quantity <= 0} style={{backgroundColor:'black', color:'white'}} onClick={() => {
                                      const o = currentCart
                                      o.push(b);
                                      setCurrentCart(o);

                                      b.quantity -= 1;

                                      setCartTotalCost(cartTotalCost + b.price);
                                    
                                    }}>Add to cart</Button>
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
                                              <p style={{width:'200px'}}>{c.price.toLocaleString(undefined, { minimumFractionDigits: 0 }) + " points"}</p>
                                              <p style={{width:'200px'}}>{c.quantity + " " + (c.quantity > 1 ? "items" : "item")}</p>
                                            </VStack>
                                            
                                          </Card.Body>
                                          <Card.Footer>
                                            <Button disabled={c.quantity <= 0} style={{backgroundColor:'black', color:'white'}} onClick={() => {
                                              const o = currentCart
                                              o.push(c);
                                              setCurrentCart(o);

                                              c.quantity -= 1;

                                              setCartTotalCost(cartTotalCost + c.price);
                                            
                                            }}>Add to cart</Button>
                                          </Card.Footer>
                                        
                                      </Card.Root>}
                                      </HStack>
                                    :
                                  <></>
                                  )})
                              }
                          
                              
                            

                            <Table.Root size={"md"} borderRadius={20} style={{width:'300px',  margin:'auto', marginBottom:'60px', marginTop:'40px', borderRadius:'20px', height:'90px', backgroundColor:'#494846'}}>
                                  <Table.Header>
                                      <Table.Row style={{backgroundColor:'#494846', color:'white'}}>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Product Name</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Quantity</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}}>Price</Table.ColumnHeader>
                                      <Table.ColumnHeader style={{color:'white', fontWeight:600}} textAlign="end">Amount Sold</Table.ColumnHeader>
                                      </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                  {products.length > 0 && products.map((v) => {
                                    return (<Table.Row><Table.Cell>{v.productName}</Table.Cell>
                                    <Table.Cell>{v.quantity}</Table.Cell>
                                    <Table.Cell>{v.price}</Table.Cell>
                                    <Table.Cell>{v.amountSold}</Table.Cell>
                                    <Table.Cell textAlign="end"><Button onClick={() => {
                                      const o = currentCart
                                      o.push(v);
                                      setCurrentCart(o);

                                      setCartTotalCost(cartTotalCost + v.price);
                                    
                                    }}>Add To Cart</Button></Table.Cell>
                                    </Table.Row>)
                                  })}
                                  </Table.Body>
                          </Table.Root>
                          
                          
                          </VStack>
                          :
                          <HStack>
                          <Input onChange={(e) => {setTransactionStudentIdInput(e.target.value)}} type='number' style={{borderColor:'#FFFFFF'}} placeholder='Student ID'/>
                          <Tooltip content={transactionStudentIdInput.length < 6 || transactionStudentIdInput.length > 6 || isNaN(Number.parseInt(transactionStudentIdInput)) ? "Please enter a valid student ID" : "Press to start transaction"}>
                            <Button disabled={transactionStudentIdInput.length < 6 || transactionStudentIdInput.length > 6 || isNaN(Number.parseInt(transactionStudentIdInput))} loading={loading} onClick={async () => {
                              const q = await loadUser(transactionStudentIdInput)
                              setCurrentCart([]);
                              setCartTotalCost(0)

                              if (q === true){
                                setTransactionStarted(true);
                              }
                              
                            }}>Start Transaction</Button>
                          </Tooltip>
                          
                          </HStack>}
                          </div>}
            </VStack>
            
          </Center>
          
        }
        </header>
      </div>
  );
}

export default App;
