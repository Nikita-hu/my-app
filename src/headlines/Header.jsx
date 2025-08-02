import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import WannaGo from '../image/WannaGo.jpg';
import DialogWindow from '../DialogWindow';
import DialogForm from '../DialogForm';

const Header = ({ open, handleClickOpenForm, handleClose, setIsLoggedIn, openForm, handleCloseForm, handleClickExit, handleClickOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const authData = JSON.parse(localStorage.getItem('authData')) || {};
    const isLoggedIn = authData.isLoggedIn === true;

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: 'none',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isMobile ? '8px 25px' : '8px 24px',
                    gap: isMobile ? '0px' : '16px',
                    minHeight: '64px',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    {/* Логотип */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        marginRight: isMobile ? '0px' : '0px'
                    }}>
                        <img
                            src={WannaGo}
                            alt="Логотип WannaGo"
                            style={{
                                height: isMobile ? '8px' : '36px',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>

                    {/* Группа кнопок */}
                    <Box sx={{
                        display: 'flex',
                        gap: isMobile ? '6px' : '12px',
                        flexShrink: 0,
                        marginLeft: 'auto'
                    }}>

                        <Button
                            onClick={handleClickOpenForm}
                            variant="contained"
                            sx={{
                                backgroundColor: '#FF7A00',
                                color: 'white',
                                borderRadius: '10px',
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                                padding: isMobile ? '6px 10px' : '8px 16px',
                                minWidth: isMobile ? '100px' : '140px',
                                '&:hover': {
                                    backgroundColor: '#e56d00',
                                }
                            }}
                        >
                            {isMobile ? 'Хочу авторский тур' : 'Хочу авторский тур'}
                        </Button>

                        {/* Кнопка авторизации/выхода */}
                        {isLoggedIn ? (
                            <Button
                                variant="contained"
                                sx={{
                                    border: '2px solid', // Добавляем явное указание ширины и стиля границы
                                    borderColor: '#808080!important', // Серый цвет рамки

                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    padding: isMobile ? '6px 10px' : '8px 16px',
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    minWidth: isMobile ? '70px' : '90px',
                                }}
                                onClick={handleClickExit}
                            >
                                Выход
                            </Button>
                        ) : (
                            <>
                            </>)
                        }

                        {/* Кнопка авторского тура */}

                    </Box>
                </Toolbar>
            </AppBar>

            <DialogWindow open={open} handleClose={handleClose} setIsLoggedIn={setIsLoggedIn} />
            <DialogForm openForm={openForm} handleCloseForm={handleCloseForm} />
        </>
    );
};

export default Header;