import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css'
import './script.js';
import { initExpenseTracker } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
  initExpenseTracker();
});