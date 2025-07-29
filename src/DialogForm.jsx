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
    const [formattedPhone, setFormattedPhone] = useState('');

    const formatPhoneNumber = (input) => {
        // Удаляем все нецифровые символы
        const cleaned = input.replace(/\D/g, '');
        
        // Ограничиваем длину номера (11 цифр с 7 или 8 в начале)
        let trimmed = cleaned;
        if (cleaned.length > 11) {
            trimmed = cleaned.substring(0, 11);
        }
        
        // Форматируем номер для отображения
        let formatted = '';
        if (trimmed.length > 0) {
            formatted = `+7 (${trimmed.substring(1, 4)}`;
            if (trimmed.length > 4) {
                formatted += `) ${trimmed.substring(4, 7)}`;
            }
            if (trimmed.length > 7) {
                formatted += ` ${trimmed.substring(7, 9)}`;
            }
            if (trimmed.length > 9) {
                formatted += ` ${trimmed.substring(9, 11)}`;
            }
        }
        
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value;
        const formatted = formatPhoneNumber(input);
        setFormattedPhone(formatted);
        
        // Сохраняем чистый номер для отправки
        const cleaned = input.replace(/\D/g, '');
        if (cleaned.startsWith('8')) {
            setPhone(`+7${cleaned.substring(1)}`);
        } else if (cleaned.startsWith('7')) {
            setPhone(`+${cleaned}`);
        } else if (cleaned) {
            setPhone(`+7${cleaned}`);
        } else {
            setPhone('');
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = {
                fio: name,
                number: phone.startsWith('+') ? phone : `+${phone}`
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
            setFormattedPhone('');

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
                    value={formattedPhone}
                    onChange={handlePhoneChange}
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