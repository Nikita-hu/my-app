import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import YandexIcon from './image/YandexIcon.png'
const YandexMapInit = (props) => {
  const mapContainerRef = useRef(null)
  const scriptLoaded = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    const loadMap = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => setIsMapReady(true));
      } else {
        setTimeout(loadMap, 300);
      }
    };

    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ee6b563c-7c17-459c-b615-9b8d320325bf&lang=ru_RU';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        scriptLoaded.current = true;
        loadMap();
      };
    } else {
      loadMap();
    }
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        ref={mapContainerRef}
        sx={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 3,
          margin: '20px 0'
        }}
      />
      {(!isMapReady) ? null : <YandexMap mapContainerRef={mapContainerRef} {...props} />}
    </Box>
  )
}

const YandexMap = ({ mapContainerRef }) => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPointDialog, setNewPointDialog] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPlacemark, setSelectedPlacemark] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [pointData, setPointData] = useState({
    title: '',
    description: '',
    image: null,
  });

  const [mapInstance] = useState(() => {
    const map = new window.ymaps.Map(mapContainerRef.current, {
      center: [51.6607, 39.2003],
      zoom: 13,
      controls: ['zoomControl', 'typeSelector']
    });
    return map
  })

  const mapInstancRef = useRef(mapInstance)
  const authData = JSON.parse(localStorage.getItem('authData')) || {};
  const isLoggedIn = authData.isLoggedIn === true;

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapInstancRef.current) return;

      // 1. Всегда добавляем метку Воронежа
      addPlacemark(mapInstancRef.current, [51.6607, 39.2003], {
        hintContent: 'Воронеж',
        balloonContent: 'Наш офис в Воронеже'
      });

      // 2. Добавляем обработчик кликов
      mapInstancRef.current.events.add('click', handleMapClick);

      // 3. Загружаем все пользовательские метки (вне зависимости от авторизации)
      try {
        setIsLoading(true);
        const marks = await fetchAllPlacemarks();
        setPlacemarks(marks);

        marks.forEach(point => {
          addPlacemark(mapInstancRef.current, point.coords, point.data);
        });
      } catch (error) {
        console.error('Ошибка загрузки меток:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstancRef.current) {
        mapInstancRef.current.events.remove('click', handleMapClick);
      }
    };
  }, []);

  // Функция для загрузки всех точек (без привязки к пользователю)
  const fetchAllPlacemarks = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData')) || {};
      const headers = {
        'Accept': 'application/json'
      };

      if (authData.token) {
        headers['Authorization'] = `Bearer ${authData.token}`;
      }

      const response = await fetch('http://185.129.146.54:8189/wannago/points', {
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ответ API (все точки):', data);

      // Обрабатываем разные форматы ответа
      const points = Array.isArray(data) ? data : (data.data || data.points || []);

      return points.map(item => {
        try {
          // Улучшенная обработка данных точки
          let pointData;

          if (typeof item === 'string') {
            // Если точка пришла как строка
            if (item.startsWith('{') || item.startsWith('[')) {
              pointData = JSON.parse(item);
            } else {
              // Простая строка без JSON
              pointData = {
                title: item,
                description: '',
                coordinates: [51.6607 + Math.random() * 0.01, 39.2003 + Math.random() * 0.01]
              };
            }
          } else if (typeof item.data === 'string') {
            // Если data пришла как строка
            if (item.data.startsWith('{') || item.data.startsWith('[')) {
              pointData = JSON.parse(item.data);
            } else {
              // Простая строка без JSON
              pointData = {
                title: item.data,
                description: '',
                coordinates: item.coordinates || [51.6607 + Math.random() * 0.01, 39.2003 + Math.random() * 0.01]
              };
            }
          } else {
            // Готовый объект
            pointData = item.data || item;
          }

          // Нормализуем координаты
          const coords = pointData.coordinates ||
            (pointData.coords ? [pointData.coords.lat, pointData.coords.lng] :
              [pointData.lat, pointData.lng] ||
              [51.6607 + Math.random() * 0.01, 39.2003 + Math.random() * 0.01]);

          return {
            coords: Array.isArray(coords) ? coords : [coords.lat, coords.lng],
            data: {
              title: pointData.title || 'Точка без названия',
              description: pointData.description || '',
              image: pointData.image || null,
            },
          };
        } catch (e) {
          console.error('Ошибка обработки точки:', e, item);
          // Возвращаем метку с ошибкой, но с валидными координатами
          return {
            coords: [51.6607 + Math.random() * 0.01, 39.2003 + Math.random() * 0.01],
            data: {
              title: 'Ошибка загрузки',
              description: `Не удалось обработать данные: ${item}`,
              image: null
            }
          };
        }
      });

    } catch (error) {
      console.error('Ошибка загрузки всех меток:', {
        message: error.message,
        stack: error.stack
      });
      return [];
    }
  };

  // Вспомогательные функции
  function normalizeCoords(pointData) {
    if (pointData.coordinates) {
      return Array.isArray(pointData.coordinates) ?
        pointData.coordinates :
        [pointData.coordinates.lat, pointData.coordinates.lng];
    }
    return [pointData.lat, pointData.lng] || [0, 0];
  }

  function getErrorPlacemark() {
    return {
      coords: [0, 0],
      data: {
        title: 'Ошибка загрузки',
        description: '',
        image: null
      }
    };
  }


  const addPlacemark = (map, coords, data = {}) => {
    if (!map || !map.geoObjects) return null;

    try {
      // Формируем содержимое балуна
      let balloonContent = `
        <div style="max-width: 300px;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">${data.title || 'Новая точка'}</h3>
          ${data.description ? `<p style="margin: 0 0 10px 0;">${data.description}</p>` : ''}
      `;

      // Если есть изображение, добавляем его в балун с возможностью открыть
      if (data.image) {
        balloonContent += `
          <img src="${data.image}" 
               style="max-width: 100%; max-height: 200px; margin-bottom: 10px; border-radius: 4px; cursor: pointer;"
               alt="Изображение точки"
               onclick="document.getElementById('placemark-image-trigger').click()">
        `;
      }

      balloonContent += `</div>`;

      const placemark = new window.ymaps.Placemark(coords, {
        hintContent: data.title || data.hintContent || 'Новая точка',
        balloonContent: balloonContent,
        balloonContentHeader: ''
      }, {
        iconLayout: 'default#image',
        // iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
         iconImageHref: `${YandexIcon}`,
        iconImageSize: [32, 32],
        iconImageOffset: [-16, -32],
        draggable: isLoggedIn
      });

      // Добавляем обработчик открытия балуна
      placemark.events.add('balloonopen', () => {
        setSelectedPlacemark({ coords, data });
      });

      // Настройка балуна
      placemark.options.set({
        balloonCloseButton: true,
        balloonPanelMaxMapArea: Infinity
      });

      map.geoObjects.add(placemark);
      return placemark;
    } catch (error) {
      console.error('Ошибка создания метки:', error);
      return null;
    }
  };

  const handleMapClick = (e) => {
    // Проверка авторизации
    const authData = JSON.parse(localStorage.getItem('authData')) || {};
    if (!authData.isLoggedIn) {
      console.log('Пользователь не авторизован - добавление точек запрещено');
      return;
    }

    // Проверка инициализации карты
    if (!mapInstancRef.current) {
      console.warn('Карта не инициализирована');
      return;
    }

    try {
      const coords = e.get('coords');
      setCurrentCoords(coords);
      setNewPointDialog(true);

      // Создаем временную метку
      const tempPlacemark = new window.ymaps.Placemark(
        coords,
        {
          hintContent: 'Новая точка',
          balloonContent: 'Введите данные...'
        },
        {
          preset: 'islands#blueDotIcon'
        }
      );

      // Добавляем метку на карту
      mapInstancRef.current.geoObjects.add(tempPlacemark);

      // Удаляем метку через 2 секунды
      setTimeout(() => {
        try {
          if (tempPlacemark && mapInstancRef.current) {
            mapInstancRef.current.geoObjects.remove(tempPlacemark);
          }
        } catch (error) {
          console.warn('Ошибка при удалении метки:', error);
        }
      }, 2000);

    } catch (error) {
      console.error('Ошибка при обработке клика на карте:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPointData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePoint = async () => {
    setNewPointDialog(false);
    try {
      // 1. Проверка авторизации
      const authData = JSON.parse(localStorage.getItem('authData'));

      if (!authData?.isLoggedIn || !authData.userId) {
        throw new Error('Требуется авторизация');
      }

      // 2. Валидация данных
      if (!pointData.title || !currentCoords) {
        throw new Error('Название и координаты обязательны');
      }

      // 3. Подготовка данных
      const pointInfo = {
        coordinates: currentCoords,
        title: pointData.title,
        description: pointData.description,
        image: pointData.image || null
      };

      const requestBody = {
         pointId: uuidv4(),
        data: JSON.stringify(pointInfo),
        authorId: authData.userId,
         id: uuidv4()   
      };

      const response = await axios.post(
        'http://185.129.146.54:8189/wannago/points',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(authData.token && { 'Authorization': `Bearer ${authData.token}` })
          }
        }
      );

      // 4. Обновление состояния
      const newPoint = {
        coords: currentCoords,
        data: {
          title: pointData.title,
          description: pointData.description,
          image: pointData.image
        }
      };

      // 5. Обновляем метки без полной перерисовки
      setPlacemarks(prev => [...prev, newPoint]);

      // 6. Добавляем новую метку на карту
      addPlacemark(mapInstancRef.current, currentCoords, {
        hintContent: pointData.title,
        balloonContent: pointData.description,
        image: pointData.image
      });

      // 7. Сброс формы
      setPointData({ title: '', description: '', image: null });

    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setNewPointDialog(true);
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePointChange = (e) => {
    setPointData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <div
        id="placemark-image-trigger"
        style={{ display: 'none' }}
        onClick={() => setImageModalOpen(true)}
      />

      {/* Модальное окно для изображения */}
      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {selectedPlacemark?.data?.image && (
            <img
              src={selectedPlacemark.data.image}
              alt={selectedPlacemark.data.title || 'Изображение точки'}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newPointDialog} onClose={() => setNewPointDialog(false)}>
        <DialogTitle>Добавить новую точку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Название точки"
            fullWidth
            variant="standard"
            value={pointData.title}
            onChange={handlePointChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={pointData.description}
            onChange={handlePointChange}
          />

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="point-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="point-image-upload" style={{ marginTop: '16px', display: 'block' }}>
            <Button variant="contained" component="span">
              Загрузить изображение
            </Button>
          </label>

          {/* Превью изображения */}
          {pointData.image && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <img
                src={pointData.image}
                alt="Превью"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px'
                }}
              />
              <Button
                variant="text"
                color="error"
                onClick={() => setPointData(prev => ({ ...prev, image: null }))}
                style={{ marginTop: '8px' }}
              >
                Удалить
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPointDialog(false)}>Отмена</Button>
          <Button onClick={handleSavePoint}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* {isLoggedIn && (
        <Button
          variant="contained"
          onClick={() => {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            localStorage.setItem('user', JSON.stringify({ ...user, points: placemarks, }));
            alert('Все точки сохранены!');
          }}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#F88821',
            '&:hover': { backgroundColor: '#1ABAA6' },
            borderRadius: '10px'
          }}
        >
          Сохранить все точки
        </Button>
      )} */}
    </>
  );
};

export default YandexMapInit;