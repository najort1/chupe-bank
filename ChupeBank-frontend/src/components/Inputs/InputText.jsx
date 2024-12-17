import styled from "styled-components";
import useDarkMode from '../../utils/useDarkMode';

const InputText = ({ label, id, value, onChange,tipo }) => {

    const isDarkMode = useDarkMode();
  return (
    <StyledWrapper isDarkMode={isDarkMode}>
        <div className="input-text-styled">
            <input type={tipo} id={id} value={value} onChange={onChange} required />
            <label htmlFor={id}>{label}</label>
        </div>    

    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`

    .input-text-styled {
        position: relative;
    }

    .input-text-styled input {
        width: 100%;
        padding: 5px;
        border: 1px solid green;
        font-size: 1rem;
        border-radius: 10px;
        transition: border 150ms cubic-bezier(0.4,0,0.2,1);
    }

    .input-text-styled label {
        position: absolute;
        left: 10px;
        top: -10px;
        color:${({ isDarkMode }) => (isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')};
        pointer-events: none;
        transform: translateY(1rem);
        transition: 150ms cubic-bezier(0.4,0,0.2,1);
    }

    .input-text-styled input:focus, .input-text-styled input:valid {
        border-color:rgba(0, 255, 21, 0.51);
        outline: none;    
    }

    .input-text-styled input:focus ~ label, .input-text-styled input:valid ~ label {
        transform: translateY(-10px) scale(1);
        font-size: 0.8rem;
        color:${({ isDarkMode }) => (isDarkMode ? 'rgb(0, 255, 21)' : 'rgb(0, 0, 0)')};
    }



    

`;

export default InputText;
