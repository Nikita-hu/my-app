import React from 'react';
import { Box, Typography } from '@mui/material';
import WannaGo from '../image/WannaGo.jpg'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        maxWidth: '1200px',
        borderTop: '1px solid #e0e0e0',
        padding: '40px 5%',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '40px',
        alignItems: 'flex-start',
        margin: '0 auto'
      }}
    >
      {/* Логотип и копирайт */}
      <Box sx={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flex: '1 1 300px'
      }}>
        <img
          src={WannaGo}
          alt="WannaGo Logo"
          style={{ height: '35px', width: '207px' }}
        />

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Typography variant="body1" sx={{ fontSize: '14px' }}>© 2022</Typography>
          <Typography variant="h6" sx={{ fontSize: '14px' }}>WannaGo</Typography>
          <Typography variant="caption" sx={{ fontSize: '14px' }}>Все права защищены</Typography>
        </Box>
      </Box>

      {/* Основной контент - горизонтальное расположение */}
      <Box sx={{
        display: 'flex',
        gap: '60px', // Расстояние между навигацией и контактами
        flexWrap: 'wrap',
        flex: '2 1 400px',
        alignItems: 'flex-start'
      }}>
        {/* Навигационные ссылки - теперь горизонтально */}
        <Box sx={{
          display: 'flex',
          gap: '30px', // Расстояние между ссылками
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{
            color: '#1ABAA6',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
            whiteSpace: 'nowrap' // Запрет переноса текста
          }}>
            Главная
          </Typography>
          <Typography variant="body2" sx={{
            color: '#1ABAA6',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
            whiteSpace: 'nowrap'
          }}>
            Туры
          </Typography>
          <Typography variant="body2" sx={{
            color: '#1ABAA6',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
            whiteSpace: 'nowrap'
          }}>
            Личный кабинет
          </Typography>
        </Box>

        {/* Контакты - на том же уровне */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Typography variant="body2" sx={{
            fontWeight: '600',
            fontSize: '14px',
            color: '#1ABAA6',
            marginBottom: '4px',
            whiteSpace: 'nowrap'
          }}>
            Наши контакты
          </Typography>

          <Typography variant="body2" sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
            Email: wannago@gmail.com
          </Typography>

          <Typography variant="body2" sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
            Телефон: +7 920 885 02 64
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer