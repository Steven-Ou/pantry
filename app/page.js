'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {Box,Stack, Typography} from "@mui/material";
import {firestore} from '@/firebase'
import { collection, getDocs, query } from 'firebase/firestore';

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
  return (
   
    <Box 
      width="100vw" 
      height="100vh"
      display = {'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Box border={'1px solid #ccc'}>
      <Box 
      width ="800px"
      height="100px" 
      bgcolor={'#ADD8E6'} 
      display={'flex'} 
      justifyContent={'center'} 
      alignItems={'center'}
      border={'1px solid #ccc'}>
        <Typography variant={'h1'} color={'#333'} textAlign={'center'} >
           Pantry Items
        </Typography>
        
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {item.map((i)=>(
          <Box 
            key={i}
            width="100%"
            height="300px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
          >
            <Typography variant={'h3'} color={'black'} textAlign={'center'} >
              { 
                // Capitalize the first letter of the item 
                i.charAt(0).toUpperCase()+ i.slice(1)
              }
            </Typography>
          </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  );
}
