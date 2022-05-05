import styled from 'styled-components'

export const Background = styled.div`
  // Enable GPU acceleration
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);

  position: fixed;
  object-fit: cover;
  min-width: 100%;
  min-height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -100;

  background-image: url('/img/background.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

export const Main = styled.main`
  // Enable GPU acceleration
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);

  position: relative;
  width: 100%;
  min-height: 85vh;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: 16px;
  background: rgb(35 35 35 / 35%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
`
