import './App.css';
import NoAuth from './NoAuth.jsx'
import Header from './headlines/Header.jsx';
import Footer from './headlines/Footer.jsx';
import Y1 from './Y1.jsx';
import { useState } from 'react';
function App() {
  const [open, setOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)


  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickExit = () => {
    localStorage.clear();
    setIsLoggedIn(false);

    console.log('Выход выполнен. Статус isLoggedIn:', false);

    window.location.reload();
  };

  return (
    <>
      <Header open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn} handleClickExit={handleClickExit}
        handleClickOpenForm={handleClickOpenForm} handleCloseForm={handleCloseForm} setOpenForm={setOpenForm} openForm={openForm} />

      <NoAuth handleClickOpen={handleClickOpen} handleClickExit={handleClickExit} isLoggedIn={isLoggedIn} />
      <Y1 isLoggedIn={isLoggedIn} />
      <Footer />
    </>
  );
}

export default App;
