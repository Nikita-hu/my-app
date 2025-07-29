import React, { useState } from 'react';
import {
    Dialog,
    Box,
    TextField,
    Typography,
    Button,
    DialogContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WannaGo from './image/WannaGo.jpg'

export default function DialogForm({ handleCloseForm, openForm }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async () => {
        try {

            const formData = {
                fio: name,
                number: phone
            };

            const response = await fetch('http://185.129.146.54:8189/wannago/req', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log("принято")
            }

            handleCloseForm();
            setName('');
            setPhone('');

            console.log('Данные успешно отправлены:', response);
        } catch (error) {
            console.error('Ошибка при отправке:', error);
        }
    };

    return (
        <Dialog
            open={openForm}
            onClose={handleCloseForm}
            aria-labelledby="simple-dialog"
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
                    onClick={handleCloseForm}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary' }
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

            <DialogContent sx={{ px: 4 }}>
                <Typography
                    variant="body1"
                    sx={{ textAlign: 'left', fontSize: '14px' }}
                >
                    Как вас зовут?
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label="ФИО"
                    variant="outlined"
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'rgb(146, 146, 146)',
                            '&.Mui-focused': { color: 'rgb(0, 0, 0)' },
                        },
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-root': { borderRadius: '10px' }
                    }}
                />

                <Typography
                    variant="body1"
                    sx={{ textAlign: 'left', fontSize: '14px' }}
                >
                    Номер телефона:
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label="+7 (___) ___ __ __"
                    variant="outlined"
                    size="small"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'rgb(146, 146, 146)',
                            '&.Mui-focused': { color: 'rgb(0, 0, 0)' },
                        },
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-root': { borderRadius: '10px' }
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#F88821',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#1ABAA6' },
                        borderRadius: '10px'
                    }}
                >
                    Отправить
                </Button>
            </DialogContent>
        </Dialog>
    );
}