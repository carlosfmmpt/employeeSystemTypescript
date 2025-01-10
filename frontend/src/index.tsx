import { createRoot } from 'react-dom/client'; // Importación correcta
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';


const rootElement = document.getElementById('root') as HTMLElement;

// Usar createRoot para renderizar la aplicación
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);