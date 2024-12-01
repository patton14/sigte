// context/InactivityContext.js
import React, { createContext, useContext, useState, useRef } from 'react';
import { IdleTimerProvider, useIdleTimer } from 'react-idle-timer';
import { signOut } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const InactivityContext = createContext();

export const InactivityProvider = ({ children }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const toast = useRef(null);
    const countdownRef = useRef(null);

    const handleOnPrompt = () => {
        setShowDialog(true);
        setCountdown(60);
        startCountdown();
    };

    const handleOnIdle = () => {
        signOut();
    };

    const handleOnActive = () => {
        setShowDialog(false);
        clearInterval(countdownRef.current);
    };

    const handleContinueSession = () => {
        setShowDialog(false);
        clearInterval(countdownRef.current);
    };

    const startCountdown = () => {
        countdownRef.current = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(countdownRef.current);
                    handleOnIdle();
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    return (
        <IdleTimerProvider
            timeout={1000 * 60 * Number(20)} // 20 minutos de inactividad
            promptBeforeIdle={1000 * 60} // 1 minuto antes de inactividad
            onPrompt={handleOnPrompt}
            onIdle={handleOnIdle}
            onActive={handleOnActive}
        >
            <InactivityContext.Provider value={{}}>
                <Toast ref={toast} />
                <Dialog header="Inactividad Detectada" visible={showDialog} onHide={handleOnIdle} modal>
                    <p>Serás desconectado por inactividad en {countdown} segundos.</p>
                    <Button label="Continuar Sesión" icon="pi pi-check" onClick={handleContinueSession} autoFocus />
                    <Button label="Cerrar Sesión" icon="pi pi-times" onClick={handleOnIdle} className="p-button-secondary" />
                </Dialog>
                {children}
            </InactivityContext.Provider>
        </IdleTimerProvider>
    );
};

export const useInactivity = () => useContext(InactivityContext);
