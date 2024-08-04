'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {Box, Typography} from "@mui/material";
import {firestore} from '@/firebase'
import { collection, getDocs, query, setDoc } from 'firebase/firestore';

const item = [ 'tomato','potato','onion','garlic','carrot','lettuce','kale','cucumber']

export default function Home() {
  const [inventory, setInventory]= useState([])
  const [open, setOpen]= useState([false])
  const [itemName, setItemName]= useState([''])

  const updateInventory = async() =>{
    const snapshot =  query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=> {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }
  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef,{quantity:quantity +1})
      } else {
        await setDoc(docRef,{quantity: 1})
      }
      await updateInventory()
    }

  }
    const removeItem = async (item) =>{
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      
      if(docSnap.exists()){
        const {quantity} = docSnap.data()
        if (quantity ==1){
          await deleteDoc(docRef)
        }else{
          await setDoc(docRef,{quantity:quantity -1})
        }
      }

    }
   useEffect(() =>{
    updateInventory()
  } ,[])

  const handleOpen = () => setOpen(true) // true - opens up
  const handleClose = () => setOpen(false) // false - closes up 

  return (
    <Box>
        <Typography variant={'h1'} color={'#333'} textAlign={'center'} >
           Inventory Management
        </Typography>
        {inventory.forEach((item)=>{
          return (
            <Box>
              {item.name}
              {item.count}
            </Box>
          )
          }

          )
        }
        
    </Box> 
  )

