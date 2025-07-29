
import WannaGo from './image/WannaGo.jpg'
import Button from '@mui/material/Button';
import Image44 from './image/image44.png'
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function NoAuth({ handleClickOpen }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const authData = JSON.parse(localStorage.getItem('authData')) || {};

    const isLoggedIn = authData.isLoggedIn === true;

    return (
        <div style={{
            padding: isMobile ? '0 5%' : '0 15%',
            boxSizing: 'border-box',
            marginTop: isMobile ? '10%' : '5%',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '30px' : '40px'
            }}>
                <div style={{
                    maxWidth: isMobile ? '100%' : '600px',
                    textAlign: isMobile ? 'center' : 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start'
                }}>
                    <img
                        alt='WannaGo'
                        src={WannaGo}
                        style={{
                            width: isMobile ? '80%' : '100%',
                            maxWidth: '300px',
                            marginBottom: '20px'
                        }}
                    />

                    <p style={{
                        fontWeight: '600',
                        fontSize: isMobile ? '1.1rem' : '1.2rem',
                        marginBottom: '15px'
                    }}>
                        WannaGo — путешествуй с теми, кто знает
                    </p>

                    <p style={{ marginBottom: '10px' }}>Создавай и находи лучшие места для поездок</p>
                    <p style={{ marginBottom: '5px' }}>Как это работает: </p>
                    <p style={{ marginBottom: '5px' }}>1️⃣ Зарегистрируйся (30 секунд) </p>
                    <p style={{ marginBottom: '5px' }}>2️⃣ Отмечай любимые места на карте с фото и советами </p>
                    <p style={{ marginBottom: '20px' }}>3️⃣ Следи за сезонными локациями от других путешественников </p>

                    {!isLoggedIn ? (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#FF7A00',
                                color: 'white',
                                borderRadius: '10px',
                                textTransform: 'none',
                                width: isMobile ? '100%' : 'auto',
                                padding: isMobile ? '10px 20px' : '8px 24px',
                                fontSize: isMobile ? '1rem' : '0.875rem'
                            }}
                            onClick={handleClickOpen}
                        >
                            Вход
                        </Button>
                    ) : (
                        <>
                        </>
                    )}
                </div>

                <div style={{
                    width: isMobile ? '100%' : '40%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img
                        alt='WannaGo'
                        src={Image44}
                        style={{
                            width: '100%',
                            maxWidth: isMobile ? '400px' : 'none',
                            height: 'auto',
                            maxHeight: isMobile ? '50vh' : '70vh',
                            objectFit: 'contain',
                            borderRadius: isMobile ? '8px' : 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoAuth;

