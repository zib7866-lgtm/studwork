// Sample Job Data
const sampleJobs = [
    {
        title: 'Консультант',
        company: 'Акцент',
        salary: '₸120,000 - ₸"200,000',
        city: 'Сатпаев',
        description: 'Мы ищем консултанта для работы с клиентами в сфере финансовых услуг. Требуется опыт в продажах и отличные коммуникативные навыки.',
    },
    {
        title: 'У меня дома',
        company: 'компания обмана',
        salary: '₸5,000 - ₸10,000',
        city: 'Сатпаев',
        description: 'мне нужен айтишник джуниор для обмана людей, если ты хочешь обманывать людей и зарабатывать деньги, то тебе сюда(шутка)',
    },
    {
        title: 'Мобилограф',
        company: 'Creative Solutions',
        salary: '₸90,000 - ₸120,000',
        city: 'Сатпаев',
        description: 'мы ищем мобилографа для создания креативного контента в социальных сетях. Требуется опыт съемки и монтажа видео на мобильных устройствах.',
    },
    {
        title: 'Повар',
        company: 'Kinza',
        salary: '₸100,000 - ₸140,000',
        city: 'Сатпаев',
        description: 'мы ищем повара для работы в ресторане. Требуется опыт приготовления блюд и умение работать в команде.',
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Job Listings
    renderJobs(sampleJobs);

    // 2. Setup Search & Filtering
    const searchInput = document.getElementById('search-position');
    const locationFilter = document.getElementById('filter-location');

    const filterJobs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const locationTerm = locationFilter.value;

        const filtered = sampleJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm);
            const matchesLocation = locationTerm === '' || job.city === locationTerm;
            return matchesSearch && matchesLocation;
        });

        renderJobs(filtered);
    };

    searchInput.addEventListener('input', filterJobs);
    locationFilter.addEventListener('change', filterJobs);

    // 3. Setup Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 4. Form Submission & Telegram Integration
    const form = document.getElementById('resume-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Define Telegram Bot Config
        const BOT_TOKEN = '8526191940:AAHiAl-6nXgTF_NCrOaK7zRXU2OEOCKsEY8';
        const CHAT_ID = '5100002269';

        // Collect Data
        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            phone: document.getElementById('phone').value,
            telegram: document.getElementById('telegram').value,
            position: document.getElementById('position').value,
            skills: document.getElementById('skills').value,
            experience: document.getElementById('experience').value,
            about: document.getElementById('about').value
        };

        // Format Message
        const message = `📄 New Resume Submission

👤 Name: ${formData.fullName}
🎂 Age: ${formData.age}
📞 Phone: ${formData.phone}
💬 Telegram: @${formData.telegram}

💼 Desired Position:
${formData.position}

🛠 Skills:
${formData.skills}

📚 Work Experience:
${formData.experience}

ℹ About Me:
${formData.about}`;

        // UI State: Loading
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');
        const notification = document.getElementById('form-notification');

        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        // Hide previous notification
        notification.classList.add('hidden');
        notification.className = '';

        try {
            // Send API Request
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
                // Success notification
                showNotification('Резюме успешно отправлено.', 'success');
                form.reset(); // Reset form on success
            } else {
                const data = await response.json();
                // Error notification from API
                showNotification(`Ошибка API: ${data.description || 'Не удалось отправить резюме.'}`, 'error');
            }
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            // Handle network/connection errors gracefully
            showNotification('Не удалось отправить резюме. Пожалуйста, проверьте ваше интернет-соединение.', 'error');
        } finally {
            // Restore UI State
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function showNotification(message, type) {
        const notification = document.getElementById('form-notification');
        notification.textContent = message;
        notification.className = `notification-${type}`;
        notification.classList.remove('hidden');

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }
});

// Helper function to render job cards
function renderJobs(jobs) {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = '';

    if (jobs.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No jobs found matching your criteria.</p>';
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'glass-card job-card fade-in visible';

        card.innerHTML = `
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <span class="company">${job.company}</span>
            </div>
            <div class="job-details">
                <span class="tag">${job.salary}</span>
                <span class="tag">${job.city}</span>
            </div>
            <p class="job-desc">${job.description}</p>
            <a href="#post-resume" class="btn btn-primary apply-btn">Apply Now</a>
        `;

        grid.appendChild(card);
    });
}
