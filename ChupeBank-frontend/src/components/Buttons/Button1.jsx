import styled from 'styled-components';

const Button1 = ({ text, color,onClick,hoverColor='#0fc427' }) => {

  return (
    <StyledWrapper color={color || '#2ba8fb'} hoverColor={hoverColor}>
      <button onClick={onClick}>
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
    background-color: ${(props) => props.color || '#2ba8fb'};
    color: #ffffff;
    font-weight: bold;
    transition: all 0.5s;
    min-width: 150px; /* Define uma largura mínima para os botões */
    text-align: center;
  }

  button:hover {
    background-color: ${(props) => props.hoverColor || '#0fc427'};
    box-shadow: 0 0 20px #6fc5ff50;
    transform: scale(1.1);
  }

  button:active {
    background-color: ${(props) => props.color || '#2ba8fb'};
    transition: all 0.25s;
    box-shadow: none;
    transform: scale(0.98);
  }
`;


export default Button1;