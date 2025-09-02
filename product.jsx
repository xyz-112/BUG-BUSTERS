import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'


export default function Product(){
const { slug } = useParams();
const [p, setP] = useState(null);
useEffect(()=>{
api.get(`/products/${slug}`).then(r=> setP(r.data)).catch(console.error)
},[slug])
if(!p) return <div>Loading...</div>
return (
<div>
<h1>{p.title}</h1>
<p>{p.description}</p>
<strong>₹{p.price}</strong>
</div>
)
}