import React from 'react'
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components'
import users from "../Images/user.png";
import { Button, Select } from '@chakra-ui/react';

interface Users {
    el: any;
    onDelete: (id: any) => void;
    onUpdateStatus: (id: any, status: string) => void;
}



const OrdersCard = ({ el, onDelete, onUpdateStatus }: Users) => {
    const navigate = useNavigate();
    // Ideally use real date from el.date
    const orderDate = el.date ? new Date(el.date) : new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 7); // Approx 7 days delivery

    return (
        <DIV>
            <div className='maindiv' onClick={() => navigate(`/admin/order/${el.id}`)} style={{ cursor: 'pointer' }}>
                <img src={el.image || users} alt="Order Item" />

                <div className='datadiv'>
                    <h1><span>Order ID: </span>{el.id}</h1>
                    <h1><span>User: </span>{el.username}</h1>
                    <h2><span>Product: </span> {el.title || "Product"}</h2>
                    <h1><span>Address: </span>{el.address}</h1>
                    <h1><span>Mobile: </span>{el.mobile}</h1>
                    <h1><span>Price: </span>{el.price}</h1>
                    <h1><span>Date: </span>{el.date}</h1>
                    <h1><span>Status: </span>
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline-block' }}>
                            <Select
                                size="sm"
                                value={el.status || "Pending"}
                                onChange={(e) => onUpdateStatus(el.id, e.target.value)}
                                width="150px"
                                borderColor="gray.400"
                                mt={1}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </Select>
                        </div>
                    </h1>
                </div>

                <div className='btndiv' onClick={(e) => e.stopPropagation()}>
                    <Button className='btn' colorScheme="red" size="sm" onClick={() => onDelete(el.id)}>Delete Order</Button>
                </div>
            </div>
        </DIV>
    )
}

export default OrdersCard


const DIV = styled.div`

.maindiv{
    // border: 1px solid;
    width: 100%;
    padding: 20px;
    margin-top:10px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    background: white;
}

.datadiv {
    text-align: start;
}
span{
    font-weight: bold;
    color: #5c6bc0;
}

h1{
    padding-top:10px;
    font-size: 0.9rem;
}
h2 {
    padding-top:10px;
    font-size: 1rem;
    font-weight: bold;
}

.btndiv{
    display: flex;
    justify-content: flex-end;
    margin-top:20px;
}

.btn:hover{
    transform: scale(1.05);
    transition: 0.2s;
}

img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
}

`