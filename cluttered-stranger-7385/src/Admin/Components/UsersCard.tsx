import React from 'react'
import { useNavigate } from 'react-router-dom';
import users from "../Images/user.png";
import { styled } from 'styled-components';
import { Button } from '@chakra-ui/react';

import { deleteUser } from '../Redux/action';

interface Users {
    el: any;
    onDelete: (id: any) => void;
}

const UsersCard = ({ el, onDelete }: Users) => {
    const navigate = useNavigate();

    return (
        <DIV>
            <div className='maindiv' onClick={() => navigate(`/admin/user/${el.id}`)} style={{ cursor: 'pointer' }}>
                <img src={users} alt="User Icon" />
                <h1><span>Username: </span>{el.username}</h1>

                <div onClick={(e) => e.stopPropagation()}>
                    {/* <Button className='btn'>Edit</Button> */}

                    <Button className='btn' onClick={() => onDelete(el.id)}>Delete</Button>
                </div>
            </div>
        </DIV>
    )
}

export default UsersCard


const DIV = styled.div`

.maindiv{
    // border: 1px solid;
    width: 100%;
    padding: 20px;
    margin-top:30px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: transform 0.2s;
}

.maindiv:hover {
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
}

span{
    font-weight: bold;
    color: #5c6bc0;
}
.maindiv div{
    display: flex;
    margin: auto;
    justify-content: space-between;
    margin-top:30px;
}

.btn:hover{
    background-color: red;
    color: white;
}

img{
    width: 100%;
}


`