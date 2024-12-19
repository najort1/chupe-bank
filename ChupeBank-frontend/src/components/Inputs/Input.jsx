import React, { useState } from 'react';
import styled from "styled-components";
import useDarkMode from '../../utils/useDarkMode';
import boxicons from 'boxicons';

import eyeShow from '../../assets/eye-password-show.svg';
import eyeHide from '../../assets/eye-password-hide.svg';

const InputText = ({ label, id, value, onChange, tipo,copyButton }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isDarkMode = useDarkMode();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <StyledWrapper $isDarkMode={isDarkMode}>
            <div className="input-text-styled">
                <input
                    type={tipo === 'password' && showPassword ? 'text' : tipo}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required
                />
                <label htmlFor={id}>{label}</label>
                {tipo === 'password' && (
                    <button type="button" className="toggle-password" onClick={toggleShowPassword}>
                        <img src={showPassword ? eyeHide : eyeShow} alt="Mostrar senha" />
                    </button>
                )}

                {copyButton && (
                    <button type="button" className='copy-button' onClick={() => navigator.clipboard.writeText(value)}>
                        {isDarkMode ? <box-icon name='copy' color='#ffff'></box-icon> : <box-icon name='copy'></box-icon>}
                    </button>
                )}



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
        color: ${({ $isDarkMode }) => ($isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')};
        pointer-events: none;
        transform: translateY(1rem);
        transition: 150ms cubic-bezier(0.4,0,0.2,1);
    }

    .input-text-styled input:focus, .input-text-styled input:valid {
        border-color: rgba(0, 255, 21, 0.51);
        outline: none;
    }

    .input-text-styled input:focus ~ label, .input-text-styled input:valid ~ label {
        transform: translateY(-10px) scale(1);
        font-size: 0.8rem;
        color: ${({ $isDarkMode }) => ($isDarkMode ? 'rgb(0, 255, 21)' : 'rgb(0, 0, 0)')};
    }

    .toggle-password {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        ${({ $isDarkMode }) => ($isDarkMode ? 'filter: invert(1);' : '')}
    }

    .copy-button{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
    }
`;

export default InputText;