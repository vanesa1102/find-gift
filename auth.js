(function () {
    const STORAGE_KEY = 'find-gift-auth';

    function checkPassword(input) {
        return input === '10082024';
    }

    if (sessionStorage.getItem(STORAGE_KEY) === 'ok') {
        return;
    }

    document.documentElement.classList.add('auth-locked');

    const style = document.createElement('style');
    style.textContent = `
        html.auth-locked body > *:not(#auth-gate) {
            display: none !important;
        }
        #auth-gate {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #121212;
            font-family: "Montserrat", sans-serif;
        }
        #auth-gate .auth-box {
            width: min(90vw, 360px);
            padding: 32px 28px;
            background-color: #18122B;
            border: 1px solid #5C469C;
            text-align: center;
            color: #D4ADFC;
        }
        #auth-gate h2 {
            font-size: 1.25rem;
            margin-bottom: 8px;
        }
        #auth-gate p {
            font-size: 0.9rem;
            opacity: 0.85;
            margin-bottom: 20px;
        }
        #auth-gate input {
            width: 100%;
            padding: 12px 14px;
            margin-bottom: 12px;
            border: 1px solid #5C469C;
            background-color: #121212;
            color: #D4ADFC;
            font-size: 1rem;
            outline: none;
        }
        #auth-gate input:focus {
            border-color: #D4ADFC;
        }
        #auth-gate button {
            width: 100%;
            padding: 12px;
            border: 1px solid #D4ADFC;
            background-color: #5C469C;
            color: #D4ADFC;
            font-size: 1rem;
            cursor: pointer;
        }
        #auth-gate button:hover {
            background-color: #D4ADFC;
            color: #18122B;
        }
        #auth-gate .auth-error {
            color: #ff6b6b;
            font-size: 0.85rem;
            min-height: 1.2em;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    const gate = document.createElement('div');
    gate.id = 'auth-gate';
    gate.innerHTML = `
        <div class="auth-box">
            <h2>Acceso privado</h2>
            <p>Ingresa la clave para continuar.</p>
            <form id="auth-form">
                <input type="password" id="auth-password" placeholder="Clave" autocomplete="current-password" required>
                <button type="submit">Entrar</button>
            </form>
            <div class="auth-error" id="auth-error"></div>
        </div>
    `;

    document.body.insertBefore(gate, document.body.firstChild);

    const form = document.getElementById('auth-form');
    const passwordInput = document.getElementById('auth-password');
    const errorEl = document.getElementById('auth-error');

    function unlock() {
        sessionStorage.setItem(STORAGE_KEY, 'ok');
        document.documentElement.classList.remove('auth-locked');
        gate.remove();
        style.remove();

        let attempts = 0;
        const tryShowIntro = () => {
            if (window.jQuery) {
                if (window.jQuery('#introModal').length) {
                    window.jQuery('#introModal').modal('show');
                }
                return;
            }
            if (attempts++ < 40) {
                setTimeout(tryShowIntro, 50);
            }
        };
        tryShowIntro();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkPassword(passwordInput.value)) {
            unlock();
        } else {
            errorEl.textContent = 'Clave incorrecta. Intenta de nuevo.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    passwordInput.focus();
})();
