'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {firestore} from '@/firebase'
import { collection, getDocs, query, setDoc } from 'firebase/firestore';

//const item = [ 'tomato','potato','onion','garlic','carrot','lettuce','kale','cucumber']

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
    <Box 
      width="100vw"
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      gap={2}
    >
        <Modal 
        open = {handleOpen} 
        onClose = {handleClose}
        >
          <Box 
            position="absolute" 
            top ="50%" 
            left="50"  
            width={400} 
            bgcolor="white" 
            border="2px solid #000" 
            boxShadow={24} 
            padding={4} 
            display="flex" 
            flexDirection="column" 
            gap={3} 
            sx={{transform:"translate(-50%,-50%)"}}
          > 
            <Typography variant='h6'>Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                  <TextField 
                  variant='outlined' 
                  fullWidth value={itemName} 
                  onChange={(e) => {setItemName(e.target.value)}}>
                    <Button variant='outlined' onClick={()=>
                    {addItem(itemName)
                     setItemName('')
                     handleClose()
                    }}>

                    </Button>
                  </TextField> 
              </Stack>
          </Box>
        </Modal>
        <Typography variant="h1">
           Inventory Management
        </Typography>  
    </Box> 
  )

}