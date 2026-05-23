// Настройки Telegram
const BOT_TOKEN = '8643236633:AAGIltjbPGR3tIqzFCKfAROHlgn4fO3ZhU4'; // Убрал лишние пробелы в конце
const CHAT_ID = '5100002269';

// Элементы модального окна для вакансий
const modal = document.getElementById('vacancy-modal');
const openModalBtn = document.querySelector('a[href="#post-vacancy"]');
const closeModalBtn = document.querySelector('.close-modal');
const vacancyForm = document.getElementById('vacancy-form');
const vacancySubmitBtn = document.getElementById('vacancy-submit-btn');

// Открытие модального окна при клике на кнопку "Разместить вакансию"
openModalBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Отменяем стандартный переход по ссылке
    modal.classList.remove('hidden');
});

// Закрытие по клику на крестик
closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Закрытие по клику на темный фон вне окна
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Отправка формы с вакансией
vacancyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Собираем данные из инпутов модалки
    const formData = {
        company: document.getElementById('company-name').value,
        title: document.getElementById('job-title-input').value,
        salary: document.getElementById('job-salary').value,
        city: document.getElementById('job-city').value,
        contacts: document.getElementById('job-contacts').value,
        description: document.getElementById('job-description').value
    };

    // Формируем красивое сообщение для Telegram
    const message = `📢 Новая вакансия!

🏢 Компания: ${formData.company}
💼 Должность: ${formData.title}
💰 Зарплата: ${formData.salary}
📍 Город: ${formData.city}
📞 Контакты: ${formData.contacts}

📝 Описание:
${formData.description}`;

    // Находим элементы управления UI
    const btnText = vacancySubmitBtn.querySelector('.btn-text');
    const loader = vacancySubmitBtn.querySelector('.loader');
    const notification = document.getElementById('modal-notification');

    // Меняем состояние кнопки на "Загрузка"
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    vacancySubmitBtn.disabled = true;

    // Прячем предыдущие уведомления
    notification.classList.add('hidden');
    notification.className = '';

    try {
        // Отправка запроса к Telegram API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        if (response.ok) {
            // Если успешно
            notification.textContent = 'Вакансия успешно отправлена на модерацию!';
            notification.className = 'notification-success';
            notification.classList.remove('hidden');
            vacancyForm.reset();
            
            // Автоматически закрываем окно через 2 секунды после успеха
            setTimeout(() => {
                modal.classList.add('hidden');
                notification.classList.add('hidden');
            }, 2000);
        } else {
            // Ошибка со стороны API Telegram
            notification.textContent = 'Ошибка отправки. Попробуйте позже.';
            notification.className = 'notification-error';
            notification.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        // Ошибка интернет-соединения
        notification.textContent = 'Ошибка сети. Проверьте подключение.';
        notification.className = 'notification-error';
        notification.classList.remove('hidden');
    } finally {
        // Восстанавливаем кнопку
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        vacancySubmitBtn.disabled = false;
    }
});