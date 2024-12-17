import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button1 = ({ text, color, link }) => {
  const navigate = useNavigate();

  return (
    <StyledWrapper color={color}>
      <button onClick={() => navigate(link)}>
        {text}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    padding: 12.5px 30px;
    border: 0;
    border-radius: 100px;
    background-color: ${props => props.color || '#2ba8fb'};
    color: #ffffff;
    font-weight: Bold;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
  }

  button:hover {
    background-color:rgb(15, 196, 39);
    box-shadow: 0 0 20px #6fc5ff50;
    transform: scale(1.1);
  }

  button:active {
    background-color:rgb(15, 196, 39);
    transition: all 0.25s;
    -webkit-transition: all 0.25s;
    box-shadow: none;
    transform: scale(0.98);
  }
`;

export default Button1;