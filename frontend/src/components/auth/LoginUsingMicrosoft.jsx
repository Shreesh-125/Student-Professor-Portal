import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constant';

const LoginButton = ({ user }) => {
  const navigate = useNavigate();



  const handleLogin = () => {
    window.location.href = `${USER_API_END_POINT}/${user}/auth/microsoft`;
  };

  return <button onClick={handleLogin}>Login with Microsoft</button>;
};

export default LoginButton;
