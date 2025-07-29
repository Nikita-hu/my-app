import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WannaGo from './image/WannaGo.jpg'
import { useState, useEffect } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';

export default function AlertDialog({ handleClose, open, isLoggedIn, setIsLoggedIn }) {

    const [activeTab, setActiveTab] = useState('login');

    const [registerData, setRegisterData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    });

    const [loginData, setLoginData] = useState({
        login: '',
        password: ''
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
    };

    const [errors, setErrors] = useState({
        email: false,
        password: false,
        emailRegistr: false,
        passwordRegistr: false,
        returnPasswordRegistr: false
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
             setIsLoggedIn(true);
        }
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({
            email: false,
            password: false,
            emailRegistr: false,
            passwordRegistr: false,
            returnPasswordRegistr: false
        });
    };


    const handleLogin = async () => {
        console.log(localStorage)
        if (!loginData.login || !loginData.password) {
            console.error('Логин и пароль обязательны!');
            return;
        }

        try {
            const response = await axios.post(
                'http://185.129.146.54:8189/wannago/auth',
                {
                    login: loginData.login,
                    password: loginData.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            console.log('', response.data)
            if (response.data.token) {
                localStorage.setItem('authData', JSON.stringify({
                    isLoggedIn: true,
                    token: response.data.token,
                    userId: response.data.userId,
                }

                ))

                handleClose(true)
                console.log('Успешная авторизация! Токен:', response.data.token);
                console.log(localStorage)
            }
        } catch (error) {
            console.error('Полная ошибка:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setIsLoggedIn(false);
        }
    };


    const handleRegister = async () => {
        try {
            const response = await axios.post(
                "http://185.129.146.54:8189/wannago/api/v1/profile/register",
                {
                    login: registerData.login,
                    password: registerData.password,
                    firstName: "",
                    lastName: "",
                    dateOfBirth: null,
                    city: "",
                    avatar: "",
                    about: ""
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                localStorage.setItem('authData', JSON.stringify({
                    isLoggedIn: true,
                    userId: response.data.id,  
                }));

                console.log('Регистрация успешна!', {
                    userId: response.data.id,
                });

                handleClose(true);
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error.response?.data || error.message);
            alert('Ошибка регистрации. Проверьте данные и попробуйте снова.');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="login-dialog"
            maxWidth="xs"
            fullWidth
        >
            <Box sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                zIndex: 1,
                cursor: 'pointer'
            }}>
                <CloseIcon
                    onClick={handleClose}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'text.primary'
                        }
                    }}
                />
            </Box>        
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                <img
                    alt='WannaGo'
                    style={{ width: '96px', height: '17px', marginBottom: '10px' }}
                    src={WannaGo}
                />
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',

                gap: 2,
                mb: 0,
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',

                }
            }}>
                <Button
                    onClick={() => {
                        handleTabChange('login');
                    }}
                    sx={{
                        fontSize: '16px',
                        color: activeTab === 'login' ? '#FF7A00' : 'black',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            backgroundColor: activeTab === 'login' ? '#FF7A00' : 'transparent',
                            transition: 'all 0.3s ease'
                        },
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    Вход
                </Button>
                <Button
                    onClick={() => {
                        handleTabChange('register');
                    }}
                    sx={{
                        fontSize: '16px',
                        color: activeTab === 'register' ? '#FF7A00' : 'black',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            backgroundColor: activeTab === 'register' ? '#FF7A00' : 'transparent',
                            transition: 'all 0.3s ease'
                        },
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    Регистрация
                </Button>
            </Box>

            <DialogContent sx={{ px: 4 }}>

                {activeTab === 'login' ? (
                    <>
                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'left',
                                fontSize: '14px'
                            }}
                        >
                            Вход по почте
                        </Typography>

                        {/* Поля ввода */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="i.ivanov@example.ru"
                            variant="outlined"
                            size="small"

                            name='login'
                            value={loginData.login}
                            onChange={handleLoginChange}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'rgb(146, 146, 146)',
                                    '&.Mui-focused': {
                                        color: 'rgb(0, 0, 0)',
                                    },
                                },
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Пароль"
                            type="password"
                            variant="outlined"
                            size="small"
                            name='password'
                            value={loginData.password}
                            onChange={handleLoginChange}

                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'rgb(146, 146, 146)',
                                    '&.Mui-focused': {
                                        color: 'rgb(0, 0, 0)',
                                    },
                                },
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />

                        {/* Кнопка входа */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                handleLogin();


                            }}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#F88821',
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#1ABAA6' },
                                borderRadius: '10px'
                            }}
                        >
                            Войти
                        </Button>
                    </>
                ) : (
                    <>

                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'left',
                                fontSize: '14px'
                            }}
                        >
                            Почта:
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="i.ivanov@example.ru"
                            variant="outlined"
                            size="small"
                            name="login"
                            value={registerData.login}
                            onChange={
                                handleRegisterChange
                            }
                            error={errors.emailRegistr}
                            helperText={errors.emailRegistr ? 'Введите email' : ''}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'rgb(146, 146, 146)',
                                    '&.Mui-focused': {
                                        color: 'rgb(0, 0, 0)',
                                    },
                                },
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />


                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'left',
                                fontSize: '14px'
                            }}
                        >
                            Пароль:
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="*******"
                            type="password"
                            variant="outlined"
                            size="small"
                            name="password"
                            value={registerData.password}
                            onChange={
                                handleRegisterChange
                            }
                            error={errors.passwordRegistr}
                            helperText={errors.passwordRegistr ? 'Введите пароль' : ''}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'rgb(146, 146, 146)',
                                    '&.Mui-focused': {
                                        color: 'rgb(0, 0, 0)',
                                    },
                                },
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />

                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'left',
                                fontSize: '14px'
                            }}
                        >
                            Повторите пароль:
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="*******"
                            type="password"
                            variant="outlined"
                            size="small"
                            name="confirmPassword"
                            value={registerData.confirmPassword}

                            onChange={
                                handleRegisterChange
                            }
                            error={errors.returnPasswordRegistr}
                            helperText={errors.returnPasswordRegistr ? 'Введите пароль' : ''}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: 'rgb(146, 146, 146)',
                                    '&.Mui-focused': {
                                        color: 'rgb(0, 0, 0)',
                                    },
                                },
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        />

                         <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                handleRegister();
                            }}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#F88821',
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#1ABAA6' },
                                borderRadius: '10px'
                            }}
                        >
                            Зарегистрироваться
                        </Button>
                    </>
                )
                }

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                        marginBottom: '10px'
                    }}
                >
                    Забыли пароль?
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0,

                }}>
                    <Box sx={{
                        flex: 1,
                        height: '1px',
                        backgroundColor: '#000'
                    }} />
                    <Typography
                        variant="body2"
                        sx={{
                            mx: 2,
                            color: '#000',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Войти через соцсети
                    </Typography>
                    <Box sx={{
                        flex: 1,
                        height: '1px',
                        backgroundColor: '#000'
                    }} />
                </Box>
            </DialogContent>
        </Dialog>
    );
}